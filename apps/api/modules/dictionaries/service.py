from psycopg import Connection

from core.responses import ApiError
from modules.dictionaries import repository
from modules.dictionaries.schemas import DictionaryGroups, DictionaryItems, GroupQuery, ItemQuery

UNPAGED_LIMIT = 500


def list_groups(database: Connection, query: GroupQuery) -> DictionaryGroups:
    groups, total = repository.read_groups(database, query.page_size, query.page_index * query.page_size)
    return DictionaryGroups(groups=groups, total=total, page_index=query.page_index, page_size=query.page_size)


def list_items(database: Connection, query: ItemQuery) -> DictionaryItems:
    items = repository.read_items(database, query.group_id, UNPAGED_LIMIT + 1)
    if items is None:
        raise ApiError(404, 'NOT_FOUND', '字典分组不存在')
    if len(items) > UNPAGED_LIMIT:
        raise ApiError(422, 'INVALID_REQUEST', '当前字典选项超过查询上限')
    return DictionaryItems(items=items)
