import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock

import psycopg

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


class MigrationTests(unittest.TestCase):
    def test_migration_files_have_stable_checksums(self):
        from scripts import migrate

        migrations = migrate.load_migrations()
        self.assertTrue(migrations)
        self.assertEqual(len(migrations[0].checksum), 64)
        self.assertEqual(migrate.pending_migrations(migrations, {}), migrations)
        self.assertEqual(migrate.pending_migrations(
            migrations, {item.name: item.checksum for item in migrations},
        ), [])

    def test_edited_or_unknown_applied_migration_is_rejected(self):
        from scripts import migrate

        migrations = migrate.load_migrations()
        for applied in ({migrations[0].name: 'changed'}, {'unknown.sql': 'checksum'}):
            with self.subTest(applied=applied), self.assertRaises(migrate.MigrationError):
                migrate.pending_migrations(migrations, applied)

    def test_preview_is_read_only_and_does_not_execute_schema(self):
        from scripts import migrate

        database = MagicMock()
        database.execute.return_value.fetchone.return_value = {'name': None}
        items = migrate.load_migrations()
        self.assertEqual(migrate.migrate(database, items), [items[0].name])
        calls = [call.args[0] for call in database.execute.call_args_list]
        self.assertIn('SET TRANSACTION READ ONLY', calls)
        self.assertFalse(any('CREATE TABLE' in query or 'INSERT INTO' in query for query in calls))

    def test_failed_schema_exits_transaction_without_registering_success(self):
        from scripts import migrate

        database = MagicMock()
        items = migrate.load_migrations()

        def execute(query, *args):
            if query == items[0].sql:
                raise psycopg.ProgrammingError('test SQL failure')
            result = MagicMock()
            result.fetchone.return_value = {'name': None}
            return result

        database.execute.side_effect = execute
        with self.assertRaises(psycopg.ProgrammingError):
            migrate.migrate(database, items, apply=True)
        self.assertFalse(any('INSERT INTO public._exts_migrations' in call.args[0]
                             for call in database.execute.call_args_list))
        self.assertIs(database.transaction.return_value.__exit__.call_args.args[0], psycopg.ProgrammingError)

    def test_migration_lock_is_bounded_before_waiting(self):
        from scripts import migrate

        database = MagicMock()
        database.execute.return_value.fetchone.return_value = {'name': None}
        migrate.migrate(database, migrate.load_migrations(), apply=True)
        calls = [call.args[0] for call in database.execute.call_args_list]
        timeout = calls.index("SELECT set_config('lock_timeout', '5000', true)")
        lock = calls.index('SELECT pg_advisory_xact_lock(%s)')
        self.assertLess(timeout, lock)
