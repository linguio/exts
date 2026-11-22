import json
import os
import sys
import unittest
from pathlib import Path
from uuid import uuid4

import psycopg
from psycopg.rows import dict_row

API_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API_ROOT))
from modules.dictionaries import repository
from scripts.migrate import load_migrations, migrate


TEST_URL = os.environ.get('API_TEST_DATABASE_URL')


@unittest.skipUnless(TEST_URL, '未配置显式隔离 PostgreSQL 测试库')
class DictionaryPostgresTests(unittest.TestCase):
    def test_migration_and_queries(self):
        with psycopg.connect(TEST_URL, connect_timeout=5, row_factory=dict_row) as database:
            try:
                existing = database.execute("""
                    SELECT to_regclass('public.dictionary_groups') AS groups,
                        to_regclass('public.activity_daily_records') AS activity,
                        to_regclass('neon_auth.user') AS users
                """).fetchone()
                if any(existing.values()):
                    self.skipTest('测试仅接受隔离空数据库')
                dictionary_migrations = [item for item in load_migrations()
                                         if item.name.startswith(('0006_', '0007_', '0008_'))]
                self.assertEqual(len(migrate(database, dictionary_migrations[:2], apply=True)), 2)
                lookup = """
                    SELECT items.id FROM public.dictionary_items AS items
                    JOIN public.dictionary_groups AS groups ON groups.id = items.group_id
                    WHERE groups.key = 'scope' AND items.value = 'extension'
                """
                old_extension = database.execute(lookup).fetchone()['id']
                self.assertEqual(migrate(database, dictionary_migrations, apply=True),
                                 ['0008_dictionary_scopes.sql'])
                self.assertEqual(database.execute(lookup).fetchone()['id'], old_extension)
                first, total = repository.read_groups(database, 2, 0)
                second, second_total = repository.read_groups(database, 2, 2)
                self.assertEqual([group['key'] for group in first + second], ['scope', 'status', 'type'])
                self.assertEqual((total, second_total), (3, 3))
                applied_at = database.execute("SELECT applied_at FROM public._exts_migrations WHERE name = '0006_dictionaries.sql'").fetchone()['applied_at']
                self.assertTrue(all(group['created_at'] == applied_at for group in first + second))
                self.assertEqual(repository.read_groups(database, 2, 4), ([], 3))
                dictionary = json.loads((API_ROOT.parents[1] /
                    '.agents/skills/ohmy-delivery/assets/issue-dictionaries.json').read_text(encoding='utf-8'))
                for group in first + second:
                    items = repository.read_items(database, group['id'], 501)
                    self.assertEqual([item['value'] for item in items], dictionary[group['key']])
                    self.assertTrue(all(item['created_at'] >= applied_at for item in items))
                self.assertIsNone(repository.read_items(database, uuid4(), 501))
                group_id = database.execute("""
                    INSERT INTO public.dictionary_groups (key, label, created_at)
                    VALUES ('empty', 'Empty', CURRENT_TIMESTAMP + INTERVAL '1 second') RETURNING id
                """).fetchone()['id']
                self.assertEqual(repository.read_items(database, group_id, 501), [])
                self.assertEqual(repository.read_groups(database, 1, 3)[0][0]['id'], group_id)
            finally:
                database.rollback()
