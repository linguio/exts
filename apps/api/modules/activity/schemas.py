import re
from datetime import date
from uuid import UUID
from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator, model_validator


UNPAGED_LIMIT = 500

SortField = Literal['date', 'exerciseMinutes', 'readingMinutes', 'learningMinutes', 'creationMinutes', 'sleepMinutes']


class ActivitySort(BaseModel):
    model_config = ConfigDict(extra='forbid')
    field: SortField
    order: Literal['asc', 'desc']


class DateRange(BaseModel):
    model_config = ConfigDict(extra='forbid')
    page_index: int | None = Field(default=None, alias='pageIndex', ge=0, strict=True)
    page_size: int | None = Field(default=None, alias='pageSize', ge=1, le=100, strict=True)
    sort: list[ActivitySort] = Field(default_factory=list, max_length=6)
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
    def ordered(self):
        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValueError('开始日期不能晚于结束日期')
        if (self.page_index is None) != (self.page_size is None):
            raise ValueError('分页参数必须同时传入')
        if self.page_index is None and (self.start_date is None or self.end_date is None):
            raise ValueError('不分页查询必须提供完整日期范围')
        if len({item.field for item in self.sort}) != len(self.sort):
            raise ValueError('排序字段不能重复')
        return self


class ActivityDay(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    user_id: UUID = Field(alias='userId')
    date: date
    exercise_minutes: int | None = Field(alias='exerciseMinutes', ge=0)
    reading_minutes: int | None = Field(alias='readingMinutes', ge=0)
    learning_minutes: int | None = Field(alias='learningMinutes', ge=0)
    creation_minutes: int | None = Field(alias='creationMinutes', ge=0)
    sleep_minutes: int | None = Field(alias='sleepMinutes', ge=0)
    created_at: AwareDatetime = Field(alias='createdAt')
    updated_at: AwareDatetime = Field(alias='updatedAt')


class ActivityDays(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    days: list[ActivityDay]
    total: int = Field(ge=0)
    page_index: int | None = Field(default=None, alias='pageIndex')
    page_size: int | None = Field(default=None, alias='pageSize')
