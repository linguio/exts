from datetime import datetime
from uuid import UUID

from psycopg import Connection

from core.auth import unauthenticated
from core.config import BUSINESS_ZONE
from core.database import connection
from modules.activity import repository
from modules.activity.schemas import ActivityDay, ActivityDays, DateRange


def read_days(user_id: UUID, period: DateRange, database: Connection) -> ActivityDays:
    rows = repository.read_user_days(database, user_id, period.start_date, period.end_date)
    if rows is None:
        raise unauthenticated()
    return ActivityDays(days=[ActivityDay.model_validate(row) for row in rows])


def ensure_today() -> int:
    today = datetime.now(BUSINESS_ZONE).date()
    with connection(readonly=False) as database:
        return repository.create_daily_rows(database, today)
