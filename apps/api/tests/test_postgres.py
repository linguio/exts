import os
import sys
import unittest
from datetime import date
from pathlib import Path
from uuid import UUID

import psycopg
from psycopg.rows import dict_row

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from modules.activity.schemas import DateRange
from modules.activity.repository import create_daily_rows, read_user_days, update_user_day
from modules.activity.schemas import ActivityDayUpdate
from modules.activity import service
from modules.settings import repository as settings_repository
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
        for migration in load_migrations():
            self.database.execute(migration.sql)

    def test_daily_job_is_idempotent_and_queries_are_isolated(self):
        day = date(2026, 11, 6)
        self.assertEqual(create_daily_rows(self.database, day), 2)
        self.database.execute(
            'UPDATE public.activity_daily_records SET exercise_minutes=30 WHERE user_id=%s', (USER_A,),
        )
        self.assertEqual(create_daily_rows(self.database, day), 0)
        self.assertEqual(read_user_days(self.database, USER_A, DateRange.model_validate({'startDate': str(day), 'endDate': str(day)}))[0][0]['exercise_minutes'], 30)
        self.assertIsNone(read_user_days(self.database, USER_B, DateRange.model_validate({'startDate': str(day), 'endDate': str(day)}))[0][0]['exercise_minutes'])
        self.assertEqual(read_user_days(self.database, USER_A, DateRange.model_validate({'startDate': '2026-11-07', 'endDate': '2026-11-07'})), ([], 0))
        create_daily_rows(self.database, date(2026, 11, 7))
        self.assertEqual(len(read_user_days(self.database, USER_A, DateRange.model_validate({'pageIndex': 0, 'pageSize': 20}))[0]), 2)
        self.assertEqual(len(read_user_days(self.database, USER_A, DateRange.model_validate({'startDate': '2026-11-07', 'pageIndex': 0, 'pageSize': 20}))[0]), 1)
        self.assertEqual(len(read_user_days(self.database, USER_A, DateRange.model_validate({'endDate': str(day), 'pageIndex': 0, 'pageSize': 20}))[0]), 1)
        self.assertIsNone(read_user_days(self.database, UUID('00000000-0000-4000-8000-000000000003'), DateRange.model_validate({'pageIndex': 0, 'pageSize': 20})))

    def test_sort_priority_nulls_totals_and_empty_pages(self):
        for day, exercise, reading in [('2026-11-01', 30, 20), ('2026-11-02', 30, 50),
                                       ('2026-11-03', 60, 0), ('2026-11-04', None, None)]:
            self.database.execute(
                'INSERT INTO public.activity_daily_records (user_id,date,exercise_minutes,reading_minutes) VALUES (%s,%s,%s,%s)',
                (USER_A, day, exercise, reading))
        payload = {'pageIndex': 0, 'pageSize': 2, 'sort': [
            {'field': 'exerciseMinutes', 'order': 'desc'}, {'field': 'readingMinutes', 'order': 'desc'}]}
        rows, total = read_user_days(self.database, USER_A, DateRange.model_validate(payload))
        self.assertEqual(total, 4)
        self.assertEqual([str(row['date']) for row in rows], ['2026-11-03', '2026-11-02'])
        rows, total = read_user_days(self.database, USER_A, DateRange.model_validate({**payload, 'pageIndex': 1}))
        self.assertEqual([str(row['date']) for row in rows], ['2026-11-01', '2026-11-04'])
        self.assertEqual(read_user_days(self.database, USER_A, DateRange.model_validate({**payload, 'pageIndex': 2})), ([], 4))
        rows, _ = read_user_days(self.database, USER_A, DateRange.model_validate({**payload, 'pageSize': 20,
            'sort': [{'field': 'exerciseMinutes', 'order': 'asc'}]}))
        self.assertEqual([str(row['date']) for row in rows], ['2026-11-02', '2026-11-01', '2026-11-03', '2026-11-04'])

    def test_unpaged_500_records_succeed_and_501_are_rejected(self):
        from modules.activity.service import read_days
        from core.responses import ApiError
        self.database.execute(
            "INSERT INTO public.activity_daily_records(user_id,date) SELECT %s, '2020-01-01'::date + n FROM generate_series(0,499) n", (USER_A,))
        query = DateRange.model_validate({'startDate': '2020-01-01', 'endDate': '2026-11-08'})
        self.assertEqual(len(read_days(USER_A, query, self.database).days), 500)
        self.database.execute("INSERT INTO public.activity_daily_records(user_id,date) VALUES (%s,'2026-11-08')", (USER_A,))
        with self.assertRaises(ApiError) as error:
            read_days(USER_A, query, self.database)
        self.assertEqual(error.exception.status, 422)

    def test_constraints_and_update_timestamp(self):
        day = date(2026, 11, 6)
        create_daily_rows(self.database, day)
        with self.assertRaises(psycopg.errors.CheckViolation), self.database.transaction():
            self.database.execute('UPDATE public.activity_daily_records SET sleep_minutes=-1')
        with self.assertRaises(psycopg.errors.ForeignKeyViolation), self.database.transaction():
            self.database.execute('INSERT INTO public.activity_daily_records(user_id,date) VALUES (%s,%s)',
                                  (UUID('00000000-0000-4000-8000-000000000003'), day))
        before = read_user_days(self.database, USER_A, DateRange.model_validate({'startDate': str(day), 'endDate': str(day)}))[0][0]
        self.database.execute("UPDATE public.activity_daily_records SET updated_at='2000-01-01' WHERE user_id=%s",
                              (USER_A,))
        row = self.database.execute(
            'SELECT created_at,updated_at FROM public.activity_daily_records WHERE user_id=%s', (USER_A,),
        ).fetchone()
        self.assertEqual(row['updated_at'], row['created_at'])
        self.assertIsNone(before['sleep_minutes'])

    def test_partial_update_only_touches_requested_columns(self):
        day = date(2026, 11, 10)
        create_daily_rows(self.database, day)
        row = read_user_days(self.database, USER_A, DateRange.model_validate({'startDate': str(day), 'endDate': str(day)}))[0][0]
        record_id = row['id']
        self.assertIsNone(row['reading_minutes'])
        updated = update_user_day(self.database, USER_A, record_id, {'exercise_minutes': 12})
        self.assertEqual(updated['exercise_minutes'], 12)
        self.assertIsNone(updated['reading_minutes'])
        self.assertIsNone(update_user_day(self.database, USER_B, record_id, {'exercise_minutes': 99}))
        self.assertIsNone(update_user_day(self.database, USER_A, UUID('00000000-0000-4000-8000-000000000099'),
                                          {'exercise_minutes': 1}))
        body = ActivityDayUpdate.model_validate({'id': str(record_id), 'changes': {'exerciseMinutes': 20, 'sleepMinutes': 0}})
        saved = service.update_day(USER_A, body, self.database)
        self.assertEqual(saved.exercise_minutes, 20)
        self.assertEqual(saved.sleep_minutes, 0)

    def test_settings_upsert_keeps_single_row_and_stable_id(self):
        first = settings_repository.save(self.database, USER_A, 'theme', 'dark')
        settings_id = first['id']
        second = settings_repository.save(self.database, USER_A, 'media_download_enabled', True)
        self.assertEqual(second['id'], settings_id)
        count = self.database.execute('SELECT count(*) AS count FROM public.user_settings WHERE user_id = %s', (USER_A,)).fetchone()['count']
        self.assertEqual(count, 1)

    def test_migration_failure_rolls_back_schema_and_ledger(self):
        from scripts.migrate import Migration

        broken = Migration('0002_failure.sql', 'test', 'CREATE TABLE public.test_rollback(id INT); SELECT invalid_column;')
        with self.assertRaises(psycopg.Error):
            migrate(self.database, [broken], apply=True)
        self.assertIsNone(self.database.execute("SELECT to_regclass('public.test_rollback') AS name").fetchone()['name'])
        self.assertIsNone(self.database.execute("SELECT to_regclass('public._exts_migrations') AS name").fetchone()['name'])


@unittest.skipUnless(TEST_URL, '未配置显式隔离 PostgreSQL 测试库，不写入现有 Neon 数据库')
class PostgresMigrationFourTests(unittest.TestCase):
    """在应用 0004 之前写入旧形数据，验证回填与约束。"""

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
        self.database.execute('CREATE SCHEMA neon_auth')
        self.database.execute('CREATE TABLE neon_auth."user" (id UUID PRIMARY KEY)')
        self.database.execute('INSERT INTO neon_auth."user" VALUES (%s), (%s)', (USER_A, USER_B))
        for migration in load_migrations():
            if migration.name.startswith('0004_'):
                self.migration_four = migration
                break
            self.database.execute(migration.sql)
        self.database.execute(
            'INSERT INTO public.activity_daily_records (user_id, date, exercise_minutes) VALUES (%s, %s, %s)',
            (USER_A, date(2026, 11, 5), 5),
        )
        self.database.execute(
            '''INSERT INTO public.user_settings (user_id, theme, media_download_enabled, history_cleaner_enabled)
               VALUES (%s, %s, %s, %s)''',
            (USER_A, 'light', False, False),
        )

    def test_backfill_ids_primary_key_and_unique_constraints(self):
        before = self.database.execute(
            'SELECT user_id, date, exercise_minutes FROM public.activity_daily_records WHERE user_id = %s', (USER_A,),
        ).fetchone()
        self.assertEqual(before['exercise_minutes'], 5)
        self.assertEqual(self.database.execute(
            'SELECT count(*) AS count FROM public.user_settings WHERE user_id = %s', (USER_A,),
        ).fetchone()['count'], 1)
        self.database.execute(self.migration_four.sql)
        day = self.database.execute(
            'SELECT id, user_id, date, exercise_minutes FROM public.activity_daily_records WHERE user_id = %s', (USER_A,),
        ).fetchone()
        self.assertIsNotNone(day['id'])
        self.assertEqual(day['exercise_minutes'], 5)
        settings = settings_repository.read(self.database, USER_A)
        self.assertIsNotNone(settings['id'])
        with self.assertRaises(psycopg.errors.UniqueViolation), self.database.transaction():
            self.database.execute(
                'INSERT INTO public.activity_daily_records (user_id, date) VALUES (%s, %s)',
                (USER_A, day['date']),
            )
        create_daily_rows(self.database, day['date'])
        updated = update_user_day(self.database, USER_A, day['id'], {'reading_minutes': 10})
        self.assertEqual(updated['reading_minutes'], 10)
        self.assertEqual(updated['exercise_minutes'], 5)
        upsert = settings_repository.save(self.database, USER_A, 'theme', 'system')
        self.assertEqual(upsert['id'], settings['id'])
