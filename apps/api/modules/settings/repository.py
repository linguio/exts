from uuid import UUID

from psycopg import Connection, sql

from core.database import read_rows


_FIELDS = ('id', 'theme', 'media_download_enabled', 'history_cleaner_enabled')
_SELECT = sql.SQL('SELECT {} FROM public.user_settings WHERE user_id = %s').format(
    sql.SQL(', ').join(sql.Identifier(field) for field in _FIELDS)
)


def read(database: Connection, user_id: UUID) -> dict | None:
    rows = read_rows(database, _SELECT, (user_id,))
    return rows[0] if rows else None


def save(database: Connection, user_id: UUID, field: str, value: str | bool) -> dict:
    if field not in _FIELDS:
        raise ValueError('未知设置字段')
    column = sql.Identifier(field)
    query = sql.SQL('''
        INSERT INTO public.user_settings (user_id, {}) VALUES (%s, %s)
        ON CONFLICT (user_id) DO UPDATE SET {} = EXCLUDED.{}, updated_at = CURRENT_TIMESTAMP
        RETURNING {}
    ''').format(column, column, column, sql.SQL(', ').join(sql.Identifier(name) for name in _FIELDS))
    return database.execute(query, (user_id, value)).fetchone()
