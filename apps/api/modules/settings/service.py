from uuid import UUID

from psycopg import Connection

from modules.settings import repository
from modules.settings.schemas import FeatureSetting, Preferences, PreferencesPatch


def _preferences(row: dict | None) -> Preferences:
    if row is None:
        return Preferences(id=None)
    return Preferences(
        id=row['id'],
        theme=row['theme'],
        media_download=FeatureSetting(enabled=row['media_download_enabled']),
        history_cleaner=FeatureSetting(enabled=row['history_cleaner_enabled']),
    )


def read(user_id: UUID, database: Connection) -> Preferences:
    return _preferences(repository.read(database, user_id))


def save(user_id: UUID, patch: PreferencesPatch, database: Connection) -> Preferences:
    field = next(iter(patch.model_fields_set))
    value = getattr(patch, field)
    column = {'theme': 'theme', 'media_download': 'media_download_enabled',
              'history_cleaner': 'history_cleaner_enabled'}[field]
    return _preferences(repository.save(database, user_id, column,
                                        value if field == 'theme' else value.enabled))
