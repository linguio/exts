import logging
import os
from collections.abc import Iterator, Sequence
from contextlib import contextmanager
from threading import Lock

import psycopg
from psycopg import ClientCursor, sql
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from core.config import BUSINESS_TIMEZONE, required_setting
from core.responses import ApiError

_pool: ConnectionPool | None = None
_pool_lock = Lock()
logger = logging.getLogger('exts.api')
_SETTINGS_SQL = (
    "SELECT set_config('TimeZone', %s, true), "
    "set_config('statement_timeout', %s, true), "
    "set_config('lock_timeout', %s, true)"
)
_SETTINGS_VALUES = (BUSINESS_TIMEZONE, '10000', '5000')


def get_pool() -> ConnectionPool:
    global _pool
    with _pool_lock:
        if _pool is None:
            # 按需创建共享池，后台预建与业务请求复用同一实例。
            pool = ConnectionPool(
                required_setting('DATABASE_URL'),
                kwargs={'connect_timeout': 5, 'row_factory': dict_row, 'autocommit': True},
                min_size=0, max_size=4, timeout=5, max_idle=60,
                open=False, name='api',
            )
            pool.open()
            _pool = pool
        return _pool


def close_pool() -> None:
    global _pool
    with _pool_lock:
        pool, _pool = _pool, None
    if pool is not None:
        pool.close()


def warm_pool() -> None:
    if not os.environ.get('DATABASE_URL', '').strip():
        return
    try:
        # 只预建连接，不执行用户查询；使用后归还并沿用空闲回收策略。
        with get_pool().connection():
            pass
    except (psycopg.Error, ApiError):
        logger.warning('API 连接预建失败，首次业务请求将按需获取连接')


@contextmanager
def borrow_connection() -> Iterator[psycopg.Connection]:
    try:
        with get_pool().connection() as database:
            yield database
    except psycopg.Error:
        raise ApiError(503, 'DATABASE_UNAVAILABLE', '数据服务暂不可用') from None


@contextmanager
def connection(*, readonly: bool = True) -> Iterator[psycopg.Connection]:
    with borrow_connection() as database:
        mode = 'READ ONLY' if readonly else 'READ WRITE'
        with ClientCursor(database) as setup:
            setup.execute(f"BEGIN {mode}; {_SETTINGS_SQL}", _SETTINGS_VALUES)
        yield database


def read_rows(
    database: psycopg.Connection, query: sql.Composable, parameters: Sequence[object],
) -> list[dict]:
    # 已有事务由调用者管理，读取不提交或覆盖其模式与设置。
    if database.info.transaction_status == psycopg.pq.TransactionStatus.INTRANS:
        return database.execute(query, parameters).fetchall()
    with ClientCursor(database) as cursor:
        cursor.execute(
            sql.SQL("BEGIN READ ONLY; " + _SETTINGS_SQL + "; {}; COMMIT").format(query),
            (*_SETTINGS_VALUES, *parameters),
        )
        # 跳过 BEGIN 和参数设置的结果，读取业务 SELECT；COMMIT 已随批次执行。
        cursor.nextset()
        cursor.nextset()
        return cursor.fetchall()
