import io
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stderr
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.check_environment import main


class EnvironmentTests(unittest.TestCase):
    def test_missing_configuration_reports_names_without_values(self):
        output = io.StringIO()
        with patch.dict(os.environ, {'DATABASE_URL': 'private-value', 'API_RESOURCE': ' '}, clear=True), \
                patch('scripts.check_environment.load_environment'), redirect_stderr(output):
            self.assertEqual(main(), 1)
        self.assertIn('NEON_AUTH_ISSUER', output.getvalue())
        self.assertIn('API_RESOURCE', output.getvalue())
        self.assertNotIn('private-value', output.getvalue())
        self.assertNotIn('DATABASE_URL', output.getvalue())

    def test_environment_files_follow_api_precedence(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            (folder / '.env.local').write_text('DATABASE_URL=local\nNEON_AUTH_ISSUER=local\nAPI_RESOURCE=local\n', encoding='utf-8')
            with patch('core.config.API_DIRECTORY', folder), patch.dict(os.environ, {}, clear=True):
                self.assertEqual(main(), 0)
                self.assertEqual(os.environ['DATABASE_URL'], 'local')
            (folder / '.env').write_text('DATABASE_URL=dotenv\nNEON_AUTH_ISSUER=dotenv\nAPI_RESOURCE=dotenv\n', encoding='utf-8')
            with patch('core.config.API_DIRECTORY', folder), patch.dict(os.environ, {'DATABASE_URL': 'process'}, clear=True):
                self.assertEqual(main(), 0)
                self.assertEqual(os.environ['DATABASE_URL'], 'process')
                self.assertEqual(os.environ['NEON_AUTH_ISSUER'], 'dotenv')
