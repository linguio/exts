from datetime import datetime
from uuid import UUID

from core.config import BUSINESS_ZONE
from core.database import connection
from modules.activity import repository
from modules.activity.schemas import ActivityDay, ActivityDays, DateRange


def read_days(user_id: UUID, period: DateRange) -> ActivityDays:
    with connection() as database:
        rows = repository.list_days(database, user_id, period.start_date, period.end_date)
    return ActivityDays(days=[ActivityDay.model_validate(row) for row in rows])


def ensure_today() -> int:
    today = datetime.now(BUSINESS_ZONE).date()
    with connection(readonly=False) as database:
        return repository.create_daily_rows(database, today)
