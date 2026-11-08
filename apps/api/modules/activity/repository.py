from datetime import date
from uuid import UUID

from psycopg import Connection
from psycopg import sql

from core.database import read_rows
from modules.activity.schemas import DateRange, UNPAGED_LIMIT


SORT_COLUMNS = {
    'date': 'date', 'exerciseMinutes': 'exercise_minutes', 'readingMinutes': 'reading_minutes',
    'learningMinutes': 'learning_minutes', 'creationMinutes': 'creation_minutes', 'sleepMinutes': 'sleep_minutes',
}


def read_user_days(database: Connection, user_id: UUID, query: DateRange) -> tuple[list[dict], int] | None:
    conditions = [sql.SQL('days.user_id = request_user.id')]
    parameters = [user_id]
    if query.start_date is not None:
        conditions.append(sql.SQL('days.date >= %s'))
        parameters.append(query.start_date)
    if query.end_date is not None:
        conditions.append(sql.SQL('days.date <= %s'))
        parameters.append(query.end_date)
    ordering = [(item.field, item.order) for item in query.sort]
    if not any(field == 'date' for field, _ in ordering):
        ordering.append(('date', 'desc'))
    order = sql.SQL(', ').join(
        sql.SQL('{} {} NULLS LAST').format(sql.Identifier(SORT_COLUMNS[field]),
                                         sql.SQL('ASC' if direction == 'asc' else 'DESC'))
        for field, direction in ordering
    )
    limit = query.page_size if query.page_size is not None else UNPAGED_LIMIT + 1
    offset = query.page_index * limit if query.page_index is not None else 0
    parameters.extend([limit, offset])
    rows = read_rows(database, sql.SQL('''WITH request_user AS (
        SELECT id FROM neon_auth."user" WHERE id = %s
    ), filtered AS MATERIALIZED (
        SELECT days.* FROM public.activity_daily_records days
        JOIN request_user ON {}
    ), page AS (
        SELECT * FROM filtered ORDER BY {} LIMIT %s OFFSET %s
    )
    SELECT (SELECT count(*) FROM filtered) AS total, page.*
    FROM request_user LEFT JOIN page ON true
    ORDER BY {}''').format(sql.SQL(' AND ').join(conditions), order, order), parameters)
    # 外连接保留空页与总数；无用户时完全无行，不把删除账号误判为无记录。
    if not rows:
        return None
    return ([row for row in rows if row['date'] is not None], rows[0]['total'])


def create_daily_rows(database: Connection, day: date) -> int:
    return database.execute(
        '''INSERT INTO public.activity_daily_records (user_id, date)
           SELECT id, %s FROM neon_auth."user"
           ON CONFLICT (user_id, date) DO NOTHING''', (day,),
    ).rowcount
