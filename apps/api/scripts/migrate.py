import argparse
import hashlib
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import psycopg
from psycopg.rows import dict_row

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from core.config import API_DIRECTORY, load_environment, required_setting
from core.responses import ApiError


class MigrationError(Exception):
    pass


@dataclass(frozen=True)
class Migration:
    name: str
    checksum: str
    sql: str


def load_migrations(directory: Path = API_DIRECTORY / 'migrations') -> list[Migration]:
    migrations = []
    versions = set()
    for path in sorted(directory.glob('*.sql')):
        match = re.fullmatch(r'(\d{4})_[a-z0-9_]+\.sql', path.name)
        if not match or match[1] in versions:
            raise MigrationError('迁移文件名称或版本重复')
        versions.add(match[1])
        # 统一换行后计算，避免 Windows checkout 的 CRLF 改变逻辑校验和。
        text = path.read_text(encoding='utf-8').replace('\r\n', '\n')
        migrations.append(Migration(path.name, hashlib.sha256(text.encode()).hexdigest(), text))
    if not migrations:
        raise MigrationError('没有可用迁移文件')
    return migrations


def pending_migrations(migrations: list[Migration], applied: dict[str, str]) -> list[Migration]:
    local = {item.name: item for item in migrations}
    for name, checksum in applied.items():
        if name not in local or local[name].checksum != checksum:
            raise MigrationError('已应用迁移缺失或内容发生变化')
    pending = [item for item in migrations if item.name not in applied]
    if applied and pending and pending[0].name < max(applied):
        raise MigrationError('不允许在已应用版本之前插入迁移')
    return pending


def read_applied(database: psycopg.Connection) -> dict[str, str]:
    exists = database.execute("SELECT to_regclass('public._exts_migrations') AS name").fetchone()
    if exists['name'] is None:
        return {}
    return {row['name']: row['checksum'] for row in database.execute(
        'SELECT name, checksum FROM public._exts_migrations ORDER BY name',
    ).fetchall()}


def migrate(database: psycopg.Connection, migrations: list[Migration], *, apply: bool = False) -> list[str]:
    # 事务与版本登记共同提交，任何 SQL 失败时由上下文回滚。
    with database.transaction():
        if not apply:
            database.execute('SET TRANSACTION READ ONLY')
        database.execute("SELECT set_config('statement_timeout', '30000', true)")
        database.execute("SELECT set_config('lock_timeout', '5000', true)")
        if apply:
            database.execute('SELECT pg_advisory_xact_lock(%s)', (426180611,))
        pending = pending_migrations(migrations, read_applied(database))
        if apply:
            database.execute('''CREATE TABLE IF NOT EXISTS public._exts_migrations (
                name TEXT PRIMARY KEY, checksum TEXT NOT NULL,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )''')
            for item in pending:
                database.execute(item.sql)
                database.execute('INSERT INTO public._exts_migrations (name, checksum) VALUES (%s, %s)',
                                 (item.name, item.checksum))
        return [item.name for item in pending]


def main() -> int:
    parser = argparse.ArgumentParser(description='预览数据库迁移；只有 --apply 才执行写入')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    load_environment()
    try:
        migrations = load_migrations()
        # 管理命令不降级使用池化或运行时连接，避免误用权限与锁语义。
        with psycopg.connect(required_setting('DATABASE_URL_UNPOOLED'), connect_timeout=5,
                             autocommit=True, row_factory=dict_row) as database:
            target = database.execute('SELECT current_database() AS name').fetchone()['name']
            names = migrate(database, migrations, apply=args.apply)
        print(f"数据库：{target}；模式：{'应用' if args.apply else '只读预览'}")
        for name in names:
            print(name)
        print(f'迁移数：{len(names)}')
        return 0
    except (MigrationError, ApiError, psycopg.Error) as error:
        # 数据库异常可能包含连接串或 SQL 数据，不输出原始消息。
        print('迁移未完成：' + type(error).__name__, file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
