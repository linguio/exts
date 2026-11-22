import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch
from uuid import UUID

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from core.auth import CurrentUser, get_token_user, get_user_database
from core.responses import ApiError

GROUP = UUID('00000000-0000-4000-8000-000000000010')


class DictionaryApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def authorize(self):
        # 保留真实路由和模型，仅替换用不到的外部身份及数据库连接。
        app.dependency_overrides[get_token_user] = lambda: CurrentUser(GROUP)
        app.dependency_overrides[get_user_database] = lambda: None
        self.addCleanup(app.dependency_overrides.pop, get_token_user)
        self.addCleanup(app.dependency_overrides.pop, get_user_database)

    def test_missing_and_invalid_credentials_do_not_open_database(self):
        with patch('core.auth.borrow_connection') as connection, patch(
            'core.auth.verify_access_token', side_effect=ApiError(401, 'UNAUTHENTICATED', '登录已失效'),
        ):
            for endpoint, payload in (('groups', {'pageIndex': 0, 'pageSize': 20}), ('items', {'groupId': str(GROUP)})):
                for headers in ({}, {'Authorization': 'Bearer invalid'}):
                    with self.subTest(endpoint=endpoint, headers=headers):
                        response = self.client.post(f'/api/dictionaries/{endpoint}', json=payload, headers=headers)
                        self.assertEqual(response.status_code, 401)
            connection.assert_not_called()

    def test_groups_return_requested_page_with_total(self):
        self.authorize()
        created = datetime(2026, 11, 22, tzinfo=timezone.utc)
        group = {'id': GROUP, 'key': 'type', 'label': 'Type', 'created_at': created}
        with patch('modules.dictionaries.repository.read_groups', return_value=([group], 3)) as read:
            response = self.client.post('/api/dictionaries/groups', json={'pageIndex': 1, 'pageSize': 2})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['data'], {
                'groups': [{'id': str(GROUP), 'key': 'type', 'label': 'Type', 'createdAt': '2026-11-22T00:00:00Z'}],
                'total': 3, 'pageIndex': 1, 'pageSize': 2,
            })
            read.assert_called_once_with(None, 2, 2)
            for payload in ({}, {'pageIndex': 0}, {'pageIndex': 0, 'pageSize': 101},
                            {'pageIndex': 0, 'pageSize': '2'}):
                self.assertEqual(self.client.post('/api/dictionaries/groups', json=payload).status_code, 422)

    def test_items_distinguish_empty_missing_and_oversize_groups(self):
        self.authorize()
        for result, status in (([], 200), (None, 404), ([{}] * 501, 422)):
            with self.subTest(status=status), patch('modules.dictionaries.repository.read_items', return_value=result) as read:
                response = self.client.post('/api/dictionaries/items', json={'groupId': str(GROUP)})
                self.assertEqual(response.status_code, status)
                if status == 200:
                    self.assertEqual(response.json()['data'], {'items': []})
                read.assert_called_once_with(None, GROUP, 501)
