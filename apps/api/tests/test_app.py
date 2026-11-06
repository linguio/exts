import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app


class DocumentationTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_redirects_without_credentials_or_database(self):
        with patch.dict(os.environ, {}, clear=True), patch("psycopg.connect") as connect:
            response = self.client.get("/", follow_redirects=False)
            self.assertEqual(response.status_code, 307)
            self.assertEqual(response.headers["location"], "/docs")
            connect.assert_not_called()

    def test_root_redirect_reaches_public_documentation(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.url.path, "/docs")
        self.assertIn("text/html", response.headers["content-type"])

    def test_removed_probe_returns_not_found(self):
        self.assertEqual(self.client.get("/hello").status_code, 404)

    def test_openapi_documents_activity_and_bearer_without_internal_jobs(self):
        self.assertEqual(self.client.get("/docs").status_code, 200)
        self.assertEqual(self.client.get("/redoc").status_code, 404)
        response = self.client.get("/openapi.json")
        self.assertEqual(response.status_code, 200)
        schema = response.json()
        self.assertEqual(set(schema['paths']), {'/api/activity/days'})
        operation = schema['paths']['/api/activity/days']['get']
        self.assertEqual({item['name'] for item in operation['parameters']}, {'startDate', 'endDate'})
        self.assertTrue(all(not item['required'] for item in operation['parameters']))
        self.assertIn('securitySchemes', schema['components'])
        self.assertEqual(operation['security'], [{'HTTPBearer': []}])
        self.assertNotIn("API_ACCESS_TOKEN", schema["info"]["description"])

    def test_documented_example_uses_actual_response_model_and_nullable_values(self):
        from core.responses import Success
        from modules.activity.schemas import ActivityDay, ActivityDays

        schema = self.client.get('/openapi.json').json()
        example = schema['paths']['/api/activity/days']['get']['responses']['200']['content']['application/json'].get('example')
        self.assertIsNotNone(example)
        parsed = Success[ActivityDays].model_validate(example)
        self.assertEqual(parsed.model_dump(mode='json', by_alias=True), example)
        self.assertEqual(set(example['data']['days'][0]),
                         {field.alias or name for name, field in ActivityDay.model_fields.items()})
        empty_day = {**example['data']['days'][0], 'exerciseMinutes': None, 'creationMinutes': None}
        self.assertIsNone(ActivityDay.model_validate(empty_day).exercise_minutes)
