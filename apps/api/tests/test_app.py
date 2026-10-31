import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import psycopg
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app


class HelloTests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(os.environ, {
            "API_ACCESS_TOKEN": "test-token",
            "DATABASE_URL": "postgresql://test.invalid/test?sslmode=require",
        })
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.client = TestClient(app)

    def test_rejects_missing_or_wrong_token_before_query(self):
        with patch("psycopg.connect") as connect:
            for headers in ({}, {"Authorization": "Bearer wrong"}):
                with self.subTest(headers=headers):
                    response = self.client.get("/hello", headers=headers)
                    self.assertEqual(response.status_code, 401)
                    self.assertEqual(response.headers["www-authenticate"], "Bearer")
            connect.assert_not_called()

    def test_valid_token_returns_database_probe(self):
        with patch("psycopg.connect") as connect:
            connection = connect.return_value.__enter__.return_value
            connection.execute.return_value.fetchone.return_value = (1,)
            response = self.client.get("/hello", headers={"Authorization": "Bearer test-token"})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"message": "hello", "database": "ok"})
            connection.execute.assert_any_call("SELECT 1")

    def test_database_failure_returns_generic_error(self):
        with patch("psycopg.connect", side_effect=psycopg.OperationalError("private details")):
            response = self.client.get("/hello", headers={"Authorization": "Bearer test-token"})
            self.assertEqual(response.status_code, 503)
            self.assertNotIn("private details", response.text)

    def test_missing_server_configuration_fails_closed(self):
        for name in ("API_ACCESS_TOKEN", "DATABASE_URL"):
            with self.subTest(name=name), patch.dict(os.environ), patch("psycopg.connect") as connect:
                os.environ.pop(name, None)
                response = self.client.get("/hello", headers={"Authorization": "Bearer test-token"})
                self.assertEqual(response.status_code, 503)
                connect.assert_not_called()
