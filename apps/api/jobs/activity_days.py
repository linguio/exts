import logging
import secrets
from typing import Annotated

from fastapi import APIRouter, Header

from core.config import required_setting
from core.responses import ApiError, Success
from modules.activity.service import ensure_today

router = APIRouter(prefix='/internal/jobs', include_in_schema=False)
logger = logging.getLogger('exts.api.jobs')


@router.get('/activity-days')
def create_activity_days(authorization: Annotated[str | None, Header()] = None):
    expected = 'Bearer ' + required_setting('CRON_SECRET')
    if not secrets.compare_digest((authorization or '').encode(), expected.encode()):
        raise ApiError(401, 'UNAUTHENTICATED', '任务认证失败', {'WWW-Authenticate': 'Bearer'})
    count = ensure_today()
    logger.info('activity_days_created count=%d', count)
    return Success(data={'created': count})
