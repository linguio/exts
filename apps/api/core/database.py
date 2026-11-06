from contextlib import contextmanager
from collections.abc import Iterator

import psycopg
from psycopg.rows import dict_row

from core.config import BUSINESS_TIMEZONE, required_setting
from core.responses import ApiError


@contextmanager
def connection(*, readonly: bool = True) -> Iterator[psycopg.Connection]:
    try:
        with psycopg.connect(required_setting('DATABASE_URL'), connect_timeout=5,
                             row_factory=dict_row) as database:
            if readonly:
                database.execute('SET TRANSACTION READ ONLY')
            database.execute("SELECT set_config('TimeZone', %s, true)", (BUSINESS_TIMEZONE,))
            database.execute("SELECT set_config('statement_timeout', '10000', true)")
            database.execute("SELECT set_config('lock_timeout', '5000', true)")
            yield database
    except psycopg.Error:
        raise ApiError(503, 'DATABASE_UNAVAILABLE', '数据服务暂不可用') from None
