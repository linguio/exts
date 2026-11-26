from typing import Annotated

from fastapi import APIRouter, Depends
from psycopg import Connection

from core.auth import get_user_database
from core.responses import ERROR_RESPONSES, Success
from modules.accounts import service
from modules.accounts.schemas import Accounts, AccountsQuery

router = APIRouter(prefix='/api/accounts', tags=['Accounts'])


@router.post('/list', response_model=Success[Accounts], responses=ERROR_RESPONSES,
             summary='分页读取注册账户',
             description='登录后可读取全部注册账户，支持按名称、邮箱和注册日期范围筛选。')
def accounts_list(query: AccountsQuery,
                  database: Annotated[Connection, Depends(get_user_database, scope='function')]):
    return Success(data=service.list_accounts(database, query))
