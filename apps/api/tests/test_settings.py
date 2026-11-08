import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from uuid import UUID

from pydantic import ValidationError
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from modules.settings import service
from modules.settings.schemas import PreferencesPatch
from app import app
from core.auth import CurrentUser, get_token_user, get_user_database


USER_ID = UUID('00000000-0000-4000-8000-000000000001')


class SettingsTests(unittest.TestCase):
    def test_routes_use_authenticated_user_and_standard_response(self):
        database = object()
        app.dependency_overrides[get_token_user] = lambda: CurrentUser(USER_ID)
        app.dependency_overrides[get_user_database] = lambda: database
        try:
            client = TestClient(app)
            with patch('modules.settings.repository.read', return_value=None) as read:
                response = client.post('/api/settings/preferences', json={})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['data']['theme'], 'system')
            read.assert_called_once_with(database, USER_ID)
            invalid = client.post('/api/settings/preferences/update', json={'theme': 'other'})
            self.assertEqual(invalid.status_code, 422)
            self.assertEqual(invalid.json()['error']['code'], 'INVALID_REQUEST')
        finally:
            app.dependency_overrides.clear()

    def test_missing_row_returns_defaults_without_creating_one(self):
        with patch('modules.settings.repository.read', return_value=None) as read:
            result = service.read(USER_ID, None)
        read.assert_called_once_with(None, USER_ID)
        self.assertEqual(result.model_dump(by_alias=True), {
            'theme': 'system', 'mediaDownload': {'enabled': False},
            'historyCleaner': {'enabled': False},
        })

    def test_one_field_update_keeps_other_settings(self):
        row = {'theme': 'dark', 'media_download_enabled': True, 'history_cleaner_enabled': False}
        with patch('modules.settings.repository.save', return_value=row) as save:
            result = service.save(USER_ID, PreferencesPatch.model_validate({'theme': 'dark'}), None)
        save.assert_called_once_with(None, USER_ID, 'theme', 'dark')
        self.assertTrue(result.media_download.enabled)

    def test_rejects_empty_multiple_unknown_or_invalid_fields(self):
        for value in ({}, {'theme': 'dark', 'mediaDownload': {'enabled': True}},
                      {'other': True}, {'theme': None}, {'mediaDownload': {'enabled': 'true'}}):
            with self.subTest(value=value), self.assertRaises(ValidationError):
                PreferencesPatch.model_validate(value)
