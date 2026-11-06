from datetime import date
from uuid import UUID

from psycopg import Connection
from psycopg import sql

from core.database import read_rows


def read_user_days(
    database: Connection, user_id: UUID, start: date | None, end: date | None,
) -> list[dict] | None:
    conditions = [sql.SQL('days.user_id = request_user.id')]
    parameters = [user_id]
    if start is not None:
        conditions.append(sql.SQL('days.date >= %s'))
        parameters.append(start)
    if end is not None:
        conditions.append(sql.SQL('days.date <= %s'))
        parameters.append(end)
    rows = read_rows(
        database,
        sql.SQL('''WITH request_user AS (
               SELECT id FROM neon_auth."user" WHERE id = %s
           )
           SELECT days.user_id, days.date, days.exercise_minutes, days.reading_minutes,
                  days.learning_minutes, days.creation_minutes, days.sleep_minutes,
                  days.created_at, days.updated_at
           FROM request_user
           LEFT JOIN public.activity_daily_records AS days ON {}
           ORDER BY days.date ASC''').format(sql.SQL(' AND ').join(conditions)),
        parameters,
    )
    # 没有用户时无行；用户存在但没有日期记录时，外连接保留一行空日期。
    if not rows:
        return None
    return [] if rows[0]['date'] is None else rows


def create_daily_rows(database: Connection, day: date) -> int:
    return database.execute(
        '''INSERT INTO public.activity_daily_records (user_id, date)
           SELECT id, %s FROM neon_auth."user"
           ON CONFLICT (user_id, date) DO NOTHING''', (day,),
    ).rowcount
