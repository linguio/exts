import re
from datetime import date
from decimal import Decimal
from uuid import UUID
from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator, model_validator


UNPAGED_LIMIT = 500

SortField = Literal['date', 'exerciseHours', 'readingHours', 'learningHours', 'creationHours', 'sleepHours']


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


def _normalize_hours_value(value, *, require_half_hour: bool) -> float | None:
    if value is None:
        return None
    if isinstance(value, bool):
        raise ValueError('时长格式无效')
    if isinstance(value, int):
        number = float(value)
    elif isinstance(value, float):
        number = value
    elif isinstance(value, Decimal):
        number = float(value)
    else:
        raise ValueError('时长格式无效')
    if number < 0:
        raise ValueError('时长不能为负数')
    if require_half_hour:
        doubled = number * 2
        if abs(doubled - round(doubled)) > 1e-9:
            raise ValueError('时长必须是 0.5 的倍数')
    return number


class ActivityDay(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: UUID
    user_id: UUID = Field(alias='userId')
    date: date
    exercise_hours: float | None = Field(alias='exerciseHours', ge=0)
    reading_hours: float | None = Field(alias='readingHours', ge=0)
    learning_hours: float | None = Field(alias='learningHours', ge=0)
    creation_hours: float | None = Field(alias='creationHours', ge=0)
    sleep_hours: float | None = Field(alias='sleepHours', ge=0)
    created_at: AwareDatetime = Field(alias='createdAt')
    updated_at: AwareDatetime = Field(alias='updatedAt')

    @field_validator('exercise_hours', 'reading_hours', 'learning_hours', 'creation_hours', 'sleep_hours', mode='before')
    @classmethod
    def normalize_hours(cls, value):
        return _normalize_hours_value(value, require_half_hour=False)


class ActivityDays(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    days: list[ActivityDay]
    total: int = Field(ge=0)
    page_index: int | None = Field(default=None, alias='pageIndex')
    page_size: int | None = Field(default=None, alias='pageSize')


class ActivityDayUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    id: UUID
    exercise_hours: float | None = Field(default=None, alias='exerciseHours', ge=0)
    reading_hours: float | None = Field(default=None, alias='readingHours', ge=0)
    learning_hours: float | None = Field(default=None, alias='learningHours', ge=0)
    creation_hours: float | None = Field(default=None, alias='creationHours', ge=0)
    sleep_hours: float | None = Field(default=None, alias='sleepHours', ge=0)

    @field_validator('exercise_hours', 'reading_hours', 'learning_hours', 'creation_hours', 'sleep_hours', mode='before')
    @classmethod
    def strict_hours(cls, value):
        if value is None:
            return None
        return _normalize_hours_value(value, require_half_hour=True)

    @model_validator(mode='after')
    def at_least_one_duration(self):
        duration_fields = {field for field in self.model_fields_set if field != 'id'}
        if not duration_fields:
            raise ValueError('至少需要一项变更')
        if any(getattr(self, field) is None for field in duration_fields):
            raise ValueError('时长不能为 null')
        return self
