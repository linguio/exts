import sys
import unittest
from unittest.mock import MagicMock, patch
from uuid import UUID
from pathlib import Path

import psycopg
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from core.auth import CurrentUser, get_token_user, get_user_database
from core.responses import ApiError
from modules.activity import service
from modules.activity.schemas import ActivityDays


class ActivityAccessTests(unittest.TestCase):
    def test_query_requires_login_and_disables_caching(self):
        response = TestClient(app).post(
            '/api/activity/days',
            json={'startDate': '2026-11-01', 'endDate': '2026-11-06'},
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.headers['cache-control'], 'no-store')
        self.assertEqual(response.headers['www-authenticate'], 'Bearer')
        self.assertEqual(response.json()['error']['code'], 'UNAUTHENTICATED')
        self.assertEqual(response.json()['error']['requestId'], response.headers['x-request-id'])

    def test_unknown_api_path_has_standard_error(self):
        response = TestClient(app).post('/api/not-found')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error']['code'], 'NOT_FOUND')


class ActivityQueryTests(unittest.TestCase):
    def setUp(self):
        self.user_id = UUID('00000000-0000-4000-8000-000000000001')
        app.dependency_overrides[get_token_user] = lambda: CurrentUser(self.user_id)
        app.dependency_overrides[get_user_database] = lambda: object()
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()

    def test_query_passes_current_user_and_returns_daily_data_with_metadata(self):
        row = dict(user_id=self.user_id, date='2026-11-01', exercise_minutes=0, reading_minutes=None,
                   learning_minutes=60, creation_minutes=None, sleep_minutes=330,
                   created_at='2026-11-06T08:00:00+08:00', updated_at='2026-11-06T09:00:00+08:00')
        with patch.object(
            service.repository, 'read_user_days', return_value=[row],
        ) as query:
            response = self.client.post('/api/activity/days', json={'startDate': '2026-11-01', 'endDate': '2026-11-06'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(query.call_args.args[1], self.user_id)
        self.assertEqual(str(query.call_args.args[2]), '2026-11-01')
        self.assertEqual(str(query.call_args.args[3]), '2026-11-06')
        self.assertEqual(response.json(), {'data': {'days': [{
            'date': '2026-11-01', 'exerciseMinutes': 0, 'readingMinutes': None,
            'learningMinutes': 60, 'creationMinutes': None, 'sleepMinutes': 330,
            'userId': str(self.user_id), 'createdAt': '2026-11-06T08:00:00+08:00',
            'updatedAt': '2026-11-06T09:00:00+08:00',
        }]}})

    def test_invalid_ranges_never_query_database(self):
        with patch.object(service.repository, 'read_user_days') as query_database:
            for query in ({'startDate': '2026-11-02', 'endDate': '2026-11-01'},
                          {'startDate': '2026-02-30', 'endDate': '2026-11-01'},
                          {'startDate': '2026-11-01T00:00:00', 'endDate': '2026-11-01'}):
                with self.subTest(query=query):
                    response = self.client.post('/api/activity/days', json=query)
                    self.assertEqual(response.status_code, 422)
                    self.assertEqual(response.json()['error']['code'], 'INVALID_REQUEST')
            query_database.assert_not_called()

    def test_dates_are_optional_without_implicit_boundaries(self):
        cases = [(None, None, None), ({}, None, None),
                 ({'startDate': '2026-11-01'}, '2026-11-01', None),
                 ({'endDate': '2026-11-06'}, None, '2026-11-06')]
        with patch.object(
            service.repository, 'read_user_days', return_value=[],
        ) as query:
            for suffix, start, end in cases:
                with self.subTest(query=suffix):
                    response = self.client.post('/api/activity/days', **({'json': suffix} if suffix is not None else {}))
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(response.json(), {'data': {'days': []}})
                    self.assertEqual(query.call_args.args[1], self.user_id)
                    self.assertEqual(str(query.call_args.args[2]) if start else query.call_args.args[2], start)
                    self.assertEqual(str(query.call_args.args[3]) if end else query.call_args.args[3], end)

    def test_empty_data_is_success_and_database_failure_is_not_empty(self):
        with patch.object(service, 'read_days', return_value=ActivityDays(days=[])):
            response = self.client.post('/api/activity/days', json={'startDate': '2026-11-01', 'endDate': '2026-11-06'})
        self.assertEqual(response.json(), {'data': {'days': []}})
        with patch.object(service, 'read_days', side_effect=ApiError(503, 'DATABASE_UNAVAILABLE', '数据服务暂不可用')):
            response = self.client.post('/api/activity/days', json={'startDate': '2026-11-01', 'endDate': '2026-11-06'})
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()['error']['code'], 'DATABASE_UNAVAILABLE')

    def test_service_failure_is_not_empty_data_or_sensitive_error(self):
        with patch.object(service, 'read_days', side_effect=RuntimeError('private SQL connection token')):
            response = self.client.post('/api/activity/days', json={'startDate': '2026-11-01', 'endDate': '2026-11-06'})
        self.assertEqual(response.status_code, 500)
        self.assertNotIn('private', response.text)
        self.assertNotIn('data', response.json())
        self.assertEqual(response.json()['error']['requestId'], response.headers['x-request-id'])


class ActivityRepositoryTests(unittest.TestCase):
    def test_missing_user_empty_dates_and_real_rows_remain_distinct(self):
        user_id = UUID('00000000-0000-4000-8000-000000000001')
        record = {'date': '2026-11-01', 'exercise_minutes': 0, 'reading_minutes': None}
        for raw, expected in [([], None), ([{'date': None}], []), ([record], [record])]:
            with self.subTest(rows=raw):
                database = MagicMock()
                database.info.transaction_status = psycopg.pq.TransactionStatus.INTRANS
                database.execute.return_value.fetchall.return_value = raw
                self.assertEqual(service.repository.read_user_days(database, user_id, None, None), expected)
