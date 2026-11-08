import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from uuid import UUID

from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from core.responses import ApiError
from modules.activity import service
from modules.activity.schemas import DateRange


class ActivityPaginationTests(unittest.TestCase):
    def test_invalid_queries_are_rejected(self):
        for payload in [{}, {'startDate': '2026-01-01'}, {'pageIndex': 0},
                        {'pageSize': 20}, {'pageIndex': -1, 'pageSize': 20},
                        {'pageIndex': 0, 'pageSize': 101}, {'pageIndex': True, 'pageSize': 20},
                        {'pageIndex': '0', 'pageSize': 20},
                        {'pageIndex': 0, 'pageSize': 20, 'sort': [{'field': 'userId', 'order': 'asc'}]},
                        {'pageIndex': 0, 'pageSize': 20, 'sort': [{'field': 'date', 'order': 'invalid'}]},
                        {'pageIndex': 0, 'pageSize': 20, 'sort': [
                            {'field': 'date', 'order': 'asc'}, {'field': 'date', 'order': 'desc'}]}]:
            with self.subTest(payload=payload), self.assertRaises(ValidationError):
                DateRange.model_validate(payload)

    def test_range_and_unbounded_paged_query_are_supported(self):
        self.assertIsNone(DateRange.model_validate({'startDate': '2026-01-01', 'endDate': '2026-11-08'}).page_index)
        query = DateRange.model_validate({'pageIndex': 0, 'pageSize': 20, 'sort': [
            {'field': 'readingMinutes', 'order': 'desc'}, {'field': 'date', 'order': 'asc'}]})
        self.assertEqual([item.field for item in query.sort], ['readingMinutes', 'date'])

    def test_empty_out_of_range_page_retains_total(self):
        query = DateRange.model_validate({'pageIndex': 9, 'pageSize': 20})
        with patch.object(service.repository, 'read_user_days', return_value=([], 87)):
            result = service.read_days(UUID(int=1), query, object()).model_dump(by_alias=True)
        self.assertEqual(result, {'days': [], 'total': 87, 'pageIndex': 9, 'pageSize': 20})

    def test_unpaged_limit_is_not_silent_truncation(self):
        query = DateRange.model_validate({'startDate': '2020-01-01', 'endDate': '2026-11-08'})
        with patch.object(service.repository, 'read_user_days', return_value=([], 501)):
            with self.assertRaises(ApiError) as error:
                service.read_days(UUID(int=1), query, object())
        self.assertEqual(error.exception.status, 422)

    def test_missing_body_and_unbounded_query_return_422(self):
        from fastapi.testclient import TestClient
        from app import app
        from core.auth import CurrentUser, get_token_user, get_user_database
        app.dependency_overrides[get_token_user] = lambda: CurrentUser(UUID(int=1))
        app.dependency_overrides[get_user_database] = lambda: object()
        try:
            client = TestClient(app)
            self.assertEqual(client.post('/api/activity/days').status_code, 422)
            self.assertEqual(client.post('/api/activity/days', json={}).status_code, 422)
        finally:
            app.dependency_overrides.clear()
