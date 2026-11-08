from typing import Annotated

from fastapi import APIRouter, Body, Depends
from psycopg import Connection

from core.auth import CurrentUser, get_token_user, get_user_database
from core.responses import ERROR_RESPONSES, Success
from modules.activity import service
from modules.activity.schemas import ActivityDay, ActivityDays, DateRange

router = APIRouter(prefix='/api/activity', tags=['Activity'])

example_response = Success[ActivityDays](data=ActivityDays(total=1, page_index=0, page_size=20, days=[ActivityDay(
    user_id='00000000-0000-4000-8000-000000000001', date='2026-11-06',
    exercise_minutes=30, reading_minutes=0, learning_minutes=60,
    creation_minutes=0, sleep_minutes=330,
    created_at='2026-11-06T00:00:00+08:00', updated_at='2026-11-06T09:00:00+08:00',
)])).model_dump(mode='json', by_alias=True)


@router.post('/days', response_model=Success[ActivityDays], responses={
                **ERROR_RESPONSES,
                200: {'description': '实际响应结构；示例用于展示字段，真实数据请执行请求',
                      'content': {'application/json': {'example': example_response}}},
            },
            summary='读取当前用户的每日活动',
            description='支持可选分页及多字段排序，默认日期倒序。分页查询日期可选；不分页必须提供完整日期范围，最多 500 条，超出返回 422。日期含首尾，NULL 始终排最后，0 表示明确为零。')
def activity_days(user: Annotated[CurrentUser, Depends(get_token_user)],
                  database: Annotated[Connection, Depends(get_user_database, scope='function')],
                  period: Annotated[DateRange, Body()]):
    return Success(data=service.read_days(user.id, period, database))
