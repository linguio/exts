from datetime import date

from psycopg import Connection, sql

from core.database import read_rows


def read_accounts(database: Connection, limit: int, offset: int, email: str, name: str,
                  start_date: date | None, end_date: date | None) -> tuple[list[dict], int]:
    # 分页和总数使用同一查询快照，空页保留总数。
    rows = read_rows(database, sql.SQL('''
        WITH matching AS (
            SELECT id, name, email, "createdAt" AS created_at
            FROM neon_auth."user"
            CROSS JOIN (SELECT %s::date AS start_date, %s::date AS end_date) AS dates
            WHERE strpos(lower(email), lower(%s::text)) > 0
              AND strpos(lower(coalesce(name, '')), lower(%s::text)) > 0
              AND (dates.start_date IS NULL OR "createdAt" >= dates.start_date::timestamptz)
              AND (dates.end_date IS NULL OR "createdAt" < (dates.end_date + 1)::timestamptz)
        ),
        totals AS (SELECT count(*) AS total FROM matching)
        SELECT page.*, totals.total
        FROM totals
        LEFT JOIN LATERAL (
            SELECT id, name, email, created_at
            FROM matching
            ORDER BY created_at DESC, id DESC
            LIMIT %s OFFSET %s
        ) AS page ON true
        ORDER BY page.created_at DESC, page.id DESC
    '''), (start_date, end_date, email, name, limit, min(offset, 2**63 - 1)))
    return [row for row in rows if row['id'] is not None], rows[0]['total']

