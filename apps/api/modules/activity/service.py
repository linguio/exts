from datetime import datetime
from uuid import UUID

from psycopg import Connection

from core.auth import unauthenticated
from core.responses import ApiError
from core.config import BUSINESS_ZONE
from core.database import connection
from modules.activity import repository
from modules.activity.schemas import ActivityDay, ActivityDayUpdate, ActivityDays, DateRange, UNPAGED_LIMIT


def read_days(user_id: UUID, period: DateRange, database: Connection) -> ActivityDays:
    result = repository.read_user_days(database, user_id, period)
    if result is None:
        raise unauthenticated()
    rows, total = result
    if period.page_index is None and total > UNPAGED_LIMIT:
        raise ApiError(422, 'INVALID_REQUEST', '不分页查询最多 500 条，请缩小日期范围或使用分页')
    return ActivityDays(days=[ActivityDay.model_validate(row) for row in rows], total=total,
                        page_index=period.page_index, page_size=period.page_size)


def ensure_today() -> int:
    today = datetime.now(BUSINESS_ZONE).date()
    with connection(readonly=False) as database:
        return repository.create_daily_rows(database, today)


DURATION_FIELD_COLUMNS = {
    'exercise_hours': 'exercise_hours',
    'reading_hours': 'reading_hours',
    'learning_hours': 'learning_hours',
    'creation_hours': 'creation_hours',
    'sleep_hours': 'sleep_hours',
}


def update_day(user_id: UUID, body: ActivityDayUpdate, database: Connection) -> ActivityDay:
    columns = {column: getattr(body, field)
               for field, column in DURATION_FIELD_COLUMNS.items()
               if field in body.model_fields_set}
    row = repository.update_user_day(database, user_id, body.id, columns)
    if row is None:
        raise ApiError(404, 'NOT_FOUND', '记录不存在')
    return ActivityDay.model_validate(row)
