import os
import sys
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from modules.activity import service


class JobTests(unittest.TestCase):
    def test_job_secret_is_separate_and_required(self):
        with patch.dict(os.environ, {'CRON_SECRET': 'test-secret'}), patch('jobs.activity_days.ensure_today') as job:
            client = TestClient(app)
            for value in ('', 'Bearer wrong', 'bearer test-secret'):
                response = client.get('/internal/jobs/activity-days', headers={'Authorization': value})
                self.assertEqual(response.status_code, 401)
            job.assert_not_called()
            job.return_value = 2
            response = client.get('/internal/jobs/activity-days', headers={'Authorization': 'Bearer test-secret'})
            self.assertEqual(response.json(), {'data': {'created': 2}})
            self.assertEqual(response.headers['cache-control'], 'no-store')
            self.assertNotIn('/internal/jobs/activity-days', client.get('/openapi.json').json()['paths'])

    def test_current_day_uses_shanghai_not_host_date(self):
        with patch.object(service, 'connection') as connect, patch.object(service, 'datetime') as clock, patch.object(
            service.repository, 'create_daily_rows', return_value=0,
        ) as create:
            clock.now.return_value = datetime(2026, 11, 7, 0, 5)
            self.assertEqual(service.ensure_today(), 0)
            clock.now.assert_called_once_with(service.BUSINESS_ZONE)
            self.assertEqual(str(create.call_args.args[1]), '2026-11-07')
            connect.assert_called_once_with(readonly=False)
