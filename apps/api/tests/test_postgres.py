import os
import sys
import unittest
from datetime import date
from pathlib import Path
from uuid import UUID

import psycopg
from psycopg.rows import dict_row

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from modules.activity.repository import create_daily_rows, list_days
from scripts.migrate import load_migrations, migrate

TEST_URL = os.environ.get('API_TEST_DATABASE_URL')
USER_A = UUID('00000000-0000-4000-8000-000000000001')
USER_B = UUID('00000000-0000-4000-8000-000000000002')


@unittest.skipUnless(TEST_URL, '未配置显式隔离 PostgreSQL 测试库，不写入现有 Neon 数据库')
class PostgresTests(unittest.TestCase):
    def setUp(self):
        self.database = psycopg.connect(TEST_URL, connect_timeout=5, row_factory=dict_row)
        self.addCleanup(self.database.close)
        self.addCleanup(self.database.rollback)
        self.database.execute("SET LOCAL statement_timeout = '10000'")
        existing = self.database.execute(
            "SELECT to_regclass('neon_auth.user') AS users, to_regclass('public.activity_daily_records') AS days",
        ).fetchone()
        if existing['users'] or existing['days']:
            self.skipTest('测试仅接受没有认证表和 Activity 表的隔离空数据库')
        # 只在显式空测试库内创建最小身份夹具，所有 DDL 和数据在测试结束回滚。
        self.database.execute('CREATE SCHEMA neon_auth')
        self.database.execute('CREATE TABLE neon_auth."user" (id UUID PRIMARY KEY)')
        self.database.execute('INSERT INTO neon_auth."user" VALUES (%s), (%s)', (USER_A, USER_B))
        self.database.execute(load_migrations()[0].sql)

    def test_daily_job_is_idempotent_and_queries_are_isolated(self):
        day = date(2026, 11, 6)
        self.assertEqual(create_daily_rows(self.database, day), 2)
        self.database.execute(
            'UPDATE public.activity_daily_records SET exercise_minutes=30 WHERE user_id=%s', (USER_A,),
        )
        self.assertEqual(create_daily_rows(self.database, day), 0)
        self.assertEqual(list_days(self.database, USER_A, day, day)[0]['exercise_minutes'], 30)
        self.assertIsNone(list_days(self.database, USER_B, day, day)[0]['exercise_minutes'])
        self.assertEqual(list_days(self.database, USER_A, date(2026, 11, 7), date(2026, 11, 7)), [])
        create_daily_rows(self.database, date(2026, 11, 7))
        self.assertEqual(len(list_days(self.database, USER_A, None, None)), 2)
        self.assertEqual(len(list_days(self.database, USER_A, date(2026, 11, 7), None)), 1)
        self.assertEqual(len(list_days(self.database, USER_A, None, day)), 1)

    def test_constraints_and_update_timestamp(self):
        day = date(2026, 11, 6)
        create_daily_rows(self.database, day)
        with self.assertRaises(psycopg.errors.CheckViolation), self.database.transaction():
            self.database.execute('UPDATE public.activity_daily_records SET sleep_minutes=-1')
        with self.assertRaises(psycopg.errors.ForeignKeyViolation), self.database.transaction():
            self.database.execute('INSERT INTO public.activity_daily_records(user_id,date) VALUES (%s,%s)',
                                  (UUID('00000000-0000-4000-8000-000000000003'), day))
        before = list_days(self.database, USER_A, day, day)[0]
        self.database.execute("UPDATE public.activity_daily_records SET updated_at='2000-01-01' WHERE user_id=%s",
                              (USER_A,))
        row = self.database.execute(
            'SELECT created_at,updated_at FROM public.activity_daily_records WHERE user_id=%s', (USER_A,),
        ).fetchone()
        self.assertEqual(row['updated_at'], row['created_at'])
        self.assertIsNone(before['sleep_minutes'])

    def test_migration_failure_rolls_back_schema_and_ledger(self):
        from scripts.migrate import Migration

        broken = Migration('0002_failure.sql', 'test', 'CREATE TABLE public.test_rollback(id INT); SELECT invalid_column;')
        with self.assertRaises(psycopg.Error):
            migrate(self.database, [broken], apply=True)
        self.assertIsNone(self.database.execute("SELECT to_regclass('public.test_rollback') AS name").fetchone()['name'])
        self.assertIsNone(self.database.execute("SELECT to_regclass('public._exts_migrations') AS name").fetchone()['name'])
