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

    def test_openapi_has_no_business_routes_or_security(self):
        self.assertEqual(self.client.get("/docs").status_code, 200)
        self.assertEqual(self.client.get("/redoc").status_code, 404)
        response = self.client.get("/openapi.json")
        self.assertEqual(response.status_code, 200)
        schema = response.json()
        self.assertEqual(schema["paths"], {})
        self.assertNotIn("securitySchemes", schema.get("components", {}))
        self.assertNotIn("API_ACCESS_TOKEN", schema["info"]["description"])
