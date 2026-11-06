import os
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch
from uuid import UUID

import psycopg
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from core.auth import CurrentUser, unauthenticated
from core.database import connection


class RequestConnectionTests(unittest.TestCase):
    def setUp(self):
        environment = patch.dict(os.environ, {'DATABASE_URL': 'postgresql://test.invalid/test'})
        environment.start()
        self.addCleanup(environment.stop)
        setup_cursor = patch('core.database.ClientCursor')
        self.setup_cursor = setup_cursor.start().return_value.__enter__.return_value
        self.addCleanup(setup_cursor.stop)
        self.user = CurrentUser(UUID('00000000-0000-4000-8000-000000000001'))
        self.database = MagicMock()
        self.database.__enter__.return_value = self.database
        self.database.__exit__.return_value = False
        self.database.info.transaction_status = psycopg.pq.TransactionStatus.IDLE
        self.exists = True
        self.failure = False
        self.parameters = []

        def execute(query, parameters=None):
            if 'activity_daily_records' in str(query):
                self.parameters.append(parameters[3:])
                if self.failure:
                    raise psycopg.OperationalError('private database error')
                self.setup_cursor.fetchall.return_value = [{'date': None}] if self.exists else []
        self.setup_cursor.execute.side_effect = execute
        self.connect = patch('core.database.get_pool')
        self.mock_connect = self.connect.start()
        self.mock_connect.return_value.connection.return_value = self.database
        self.addCleanup(self.connect.stop)
        self.verify = patch('core.auth.verify_access_token', return_value=self.user)
        self.mock_verify = self.verify.start()
        self.addCleanup(self.verify.stop)

    def request(self, token='test'):
        return TestClient(app).post('/api/activity/days', headers={'Authorization': f'Bearer {token}'} if token else {},
                                   json={'startDate': '2026-11-01', 'endDate': '2026-11-06'})

    def test_valid_user_shares_one_connection_and_keeps_user_filter(self):
        response = self.request()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'data': {'days': []}})
        self.mock_connect.assert_called_once()
        self.mock_verify.assert_called_once_with('test')
        self.assertEqual(len(self.parameters), 1)
        self.assertEqual(self.parameters[0][0], self.user.id)
        self.database.__exit__.assert_called_once()

    def test_missing_or_invalid_token_never_opens_database(self):
        self.assertEqual(self.request(token='').status_code, 401)
        self.mock_verify.side_effect = unauthenticated()
        self.assertEqual(self.request().status_code, 401)
        self.mock_connect.assert_not_called()

    def test_deleted_user_is_rejected_without_data_and_returns_connection(self):
        self.exists = False
        response = self.request()
        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(self.parameters), 1)
        self.database.__exit__.assert_called_once()
        self.assertIsNotNone(self.database.__exit__.call_args.args[0])

    def test_database_failure_is_safe_and_returns_shared_connection(self):
        self.failure = True
        response = self.request()
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()['error']['code'], 'DATABASE_UNAVAILABLE')
        self.assertNotIn('private', response.text)
        self.mock_connect.assert_called_once()
        self.database.__exit__.assert_called_once()
        self.assertIsNotNone(self.database.__exit__.call_args.args[0])

    def test_transaction_modes_and_local_settings_are_preserved(self):
        for readonly in [True, False]:
            self.database.reset_mock()
            self.setup_cursor.reset_mock()
            with connection(readonly=readonly):
                pass
            self.setup_cursor.execute.assert_called_once()
            query, parameters = self.setup_cursor.execute.call_args.args
            self.assertTrue(query.startswith('BEGIN READ ONLY;' if readonly else 'BEGIN READ WRITE;'))
            for name in ['TimeZone', 'statement_timeout', 'lock_timeout']:
                self.assertIn(name, query)
            self.assertEqual(parameters, ('Asia/Shanghai', '10000', '5000'))
            self.database.__exit__.assert_called_once()
