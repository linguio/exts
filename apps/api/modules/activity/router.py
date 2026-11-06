from typing import Annotated

from fastapi import APIRouter, Depends, Query

from core.auth import CurrentUser, get_current_user
from core.responses import ERROR_RESPONSES, Success
from modules.activity import service
from modules.activity.schemas import ActivityDay, ActivityDays, DateRange

router = APIRouter(prefix='/api/activity', tags=['Activity'])

example_response = Success[ActivityDays](data=ActivityDays(days=[ActivityDay(
    user_id='00000000-0000-4000-8000-000000000001', date='2026-11-06',
    exercise_minutes=30, reading_minutes=0, learning_minutes=60,
    creation_minutes=0, sleep_minutes=330,
    created_at='2026-11-06T00:00:00+08:00', updated_at='2026-11-06T09:00:00+08:00',
)])).model_dump(mode='json', by_alias=True)


@router.get('/days', response_model=Success[ActivityDays], responses={
                **ERROR_RESPONSES,
                200: {'description': '实际响应结构；示例用于展示字段，真实数据请执行请求',
                      'content': {'application/json': {'example': example_response}}},
            },
            summary='读取当前用户的每日活动',
            description='日期可选，不传时查询本人全部历史；单独传入时按对应下限或上限筛选，含起止日期。只返回已有记录，升序；NULL 表示未填写，0 表示明确为零。')
def activity_days(user: Annotated[CurrentUser, Depends(get_current_user)],
                  period: Annotated[DateRange, Query()]):
    return Success(data=service.read_days(user.id, period))
