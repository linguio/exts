from uuid import UUID

from psycopg import Connection, sql

from core.database import read_rows


def read_groups(database: Connection, limit: int, offset: int) -> tuple[list[dict], int]:
    # 同一条查询返回分页数据与总数，空页也保留总数。
    rows = read_rows(database, sql.SQL('''
        WITH totals AS (SELECT count(*) AS total FROM public.dictionary_groups)
        SELECT page.*, totals.total
        FROM totals
        LEFT JOIN LATERAL (
            SELECT id, key, label, created_at
            FROM public.dictionary_groups
            ORDER BY created_at, key
            LIMIT %s OFFSET %s
        ) AS page ON true
        ORDER BY page.created_at, page.key
    '''), (limit, min(offset, 2**63 - 1)))
    return [row for row in rows if row['id'] is not None], rows[0]['total']


def read_items(database: Connection, group_id: UUID, limit: int) -> list[dict] | None:
    # 缺失分组没有结果行；已有空组保留一行空选项。
    rows = read_rows(database, sql.SQL('''
        SELECT items.id, items.value, items.label, items.sort_order, items.created_at
        FROM public.dictionary_groups AS groups
        LEFT JOIN public.dictionary_items AS items ON items.group_id = groups.id
        WHERE groups.id = %s
        ORDER BY items.sort_order, items.value
        LIMIT %s
    '''), (group_id, limit))
    return [row for row in rows if row['id'] is not None] if rows else None
