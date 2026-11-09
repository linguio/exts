from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StrictBool, model_validator


Theme = Literal['light', 'dark', 'system']


class FeatureSetting(BaseModel):
    model_config = ConfigDict(extra='forbid')

    enabled: StrictBool


class Preferences(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: UUID | None = None
    theme: Theme = 'system'
    media_download: FeatureSetting = Field(default_factory=lambda: FeatureSetting(enabled=False), alias='mediaDownload')
    history_cleaner: FeatureSetting = Field(default_factory=lambda: FeatureSetting(enabled=False), alias='historyCleaner')


class PreferencesPatch(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    theme: Theme | None = None
    media_download: FeatureSetting | None = Field(default=None, alias='mediaDownload')
    history_cleaner: FeatureSetting | None = Field(default=None, alias='historyCleaner')

    @model_validator(mode='after')
    def one_field(self):
        if len(self.model_fields_set) != 1 or any(getattr(self, field) is None for field in self.model_fields_set):
            raise ValueError('每次只允许更新一个有效设置')
        return self
