from datetime import date
from uuid import UUID

from psycopg import Connection
from psycopg import sql


def list_days(database: Connection, user_id: UUID, start: date | None, end: date | None) -> list[dict]:
    conditions = [sql.SQL('user_id = %s')]
    parameters = [user_id]
    if start is not None:
        conditions.append(sql.SQL('date >= %s'))
        parameters.append(start)
    if end is not None:
        conditions.append(sql.SQL('date <= %s'))
        parameters.append(end)
    return database.execute(
        sql.SQL('''SELECT user_id, date, exercise_minutes, reading_minutes, learning_minutes,
                  creation_minutes, sleep_minutes, created_at, updated_at
           FROM public.activity_daily_records
           WHERE {} ORDER BY date ASC''').format(sql.SQL(' AND ').join(conditions)),
        parameters,
    ).fetchall()


def create_daily_rows(database: Connection, day: date) -> int:
    return database.execute(
        '''INSERT INTO public.activity_daily_records (user_id, date)
           SELECT id, %s FROM neon_auth."user"
           ON CONFLICT (user_id, date) DO NOTHING''', (day,),
    ).rowcount
