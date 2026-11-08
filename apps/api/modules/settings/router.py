from typing import Annotated

from fastapi import APIRouter, Depends
from psycopg import Connection

from core.auth import CurrentUser, get_token_user, get_user_database
from core.responses import ERROR_RESPONSES, Success
from modules.settings import service
from modules.settings.schemas import Preferences, PreferencesPatch

router = APIRouter(prefix='/api/settings', tags=['Settings'])


@router.post('/preferences', response_model=Success[Preferences], responses=ERROR_RESPONSES,
             summary='读取当前用户的设置')
def read_preferences(user: Annotated[CurrentUser, Depends(get_token_user)],
                     database: Annotated[Connection, Depends(get_user_database, scope='function')]):
    return Success(data=service.read(user.id, database))


@router.post('/preferences/update', response_model=Success[Preferences], responses=ERROR_RESPONSES,
             summary='更新当前用户的一项设置')
def update_preferences(patch: PreferencesPatch,
                       user: Annotated[CurrentUser, Depends(get_token_user)],
                       database: Annotated[Connection, Depends(get_user_database, scope='function')]):
    return Success(data=service.save(user.id, patch, database))
