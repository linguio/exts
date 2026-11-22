from typing import Annotated

from fastapi import APIRouter, Depends
from psycopg import Connection

from core.auth import get_user_database
from core.responses import ERROR_RESPONSES, Failure, Success
from modules.dictionaries import service
from modules.dictionaries.schemas import DictionaryGroups, DictionaryItems, GroupQuery, ItemQuery

router = APIRouter(prefix='/api/dictionaries', tags=['Dictionaries'])
AuthenticatedDatabase = Annotated[Connection, Depends(get_user_database, scope='function')]


@router.post('/groups', response_model=Success[DictionaryGroups], responses=ERROR_RESPONSES,
             summary='分页读取字典分组')
def dictionary_groups(query: GroupQuery, database: AuthenticatedDatabase):
    return Success(data=service.list_groups(database, query))


@router.post('/items', response_model=Success[DictionaryItems],
             responses={**ERROR_RESPONSES, 404: {'model': Failure}},
             summary='读取指定分组的全部字典选项')
def dictionary_items(query: ItemQuery, database: AuthenticatedDatabase):
    return Success(data=service.list_items(database, query))
