from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class GroupQuery(BaseModel):
    model_config = ConfigDict(extra='forbid')
    page_index: int = Field(alias='pageIndex', ge=0, strict=True)
    page_size: int = Field(alias='pageSize', ge=1, le=100, strict=True)
    search: str = Field(default='', max_length=128)


class ItemQuery(BaseModel):
    model_config = ConfigDict(extra='forbid')
    group_id: UUID = Field(alias='groupId')


class DictionaryEntry(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: UUID
    label: str
    created_at: AwareDatetime = Field(alias='createdAt')


class DictionaryNamespace(BaseModel):
    id: UUID
    key: str
    label: str


class DictionaryGroup(DictionaryEntry):
    key: str
    namespace: DictionaryNamespace
    description: str | None = None


class DictionaryItem(DictionaryEntry):
    value: str
    sort_order: int = Field(alias='sortOrder', ge=0)


class DictionaryGroups(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    groups: list[DictionaryGroup]
    total: int
    page_index: int = Field(alias='pageIndex')
    page_size: int = Field(alias='pageSize')


class DictionaryItems(BaseModel):
    items: list[DictionaryItem]
