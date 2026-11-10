from typing import Annotated

from fastapi import APIRouter, Depends
from psycopg import Connection

from core.auth import CurrentUser, get_token_user, get_user_database
from core.responses import ERROR_RESPONSES, Success
from modules.settings import service
from modules.settings.schemas import Preferences, PreferencesPatch

router = APIRouter(prefix='/api/settings', tags=['Settings'])


@router.post('/preferences', response_model=Success[Preferences], responses=ERROR_RESPONSES,
             summary='读取当前用户的设置',
             description='读取当前用户的主题和功能设置；身份取自令牌，不接受 userId。尚未保存设置时返回 system 主题和关闭的功能默认值，不创建记录。')
def read_preferences(user: Annotated[CurrentUser, Depends(get_token_user)],
                     database: Annotated[Connection, Depends(get_user_database, scope='function')]):
    return Success(data=service.read(user.id, database))


@router.post('/preferences/update', response_model=Success[Preferences], responses=ERROR_RESPONSES,
             summary='更新当前用户的一项设置',
             description='仅允许一次更新 theme、mediaDownload 或 historyCleaner 中的一项；身份取自令牌，不接受 userId。theme 仅为 light、dark 或 system，功能项仅接受 enabled 布尔值；更新后返回当前完整设置，其余设置保持不变。')
def update_preferences(patch: PreferencesPatch,
                       user: Annotated[CurrentUser, Depends(get_token_user)],
                       database: Annotated[Connection, Depends(get_user_database, scope='function')]):
    return Success(data=service.save(user.id, patch, database))
