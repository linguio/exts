import re
from datetime import date
from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator, model_validator


class AccountsQuery(BaseModel):
    model_config = ConfigDict(extra='forbid')
    page_index: int = Field(alias='pageIndex', ge=0, strict=True)
    page_size: int = Field(alias='pageSize', ge=1, le=100, strict=True)
    email: str = Field(default='', max_length=254, pattern=r'^[^\x00]*$')
    name: str = Field(default='', max_length=254, pattern=r'^[^\x00]*$')
    start_date: date | None = Field(default=None, alias='startDate')
    end_date: date | None = Field(default=None, alias='endDate')

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def date_only(cls, value):
        if value is None:
            return None
        if not isinstance(value, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            raise ValueError('日期必须使用 YYYY-MM-DD')
        return date.fromisoformat(value)

    @model_validator(mode='after')
    def ordered_dates(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError('开始日期不能晚于结束日期')
        return self


class Account(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: UUID
    name: str | None
    email: str
    created_at: AwareDatetime = Field(alias='createdAt')


class Accounts(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    accounts: list[Account]
    total: int
    page_index: int = Field(alias='pageIndex')
    page_size: int = Field(alias='pageSize')
