import os
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

import psycopg
from fastapi.testclient import TestClient
from psycopg_pool import PoolClosed, PoolTimeout

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from core import database
from core.responses import ApiError


class DatabasePoolTests(unittest.TestCase):
    def setUp(self):
        environment = patch.dict(os.environ, {'DATABASE_URL': 'postgresql://test.invalid/test'})
        environment.start()
        self.addCleanup(environment.stop)
        state = patch.object(database, '_pool', None)
        state.start()
        self.addCleanup(state.stop)
        setup_cursor = patch('core.database.ClientCursor')
        self.setup_cursor = setup_cursor.start().return_value.__enter__.return_value
        self.addCleanup(setup_cursor.stop)

    def test_pool_is_lazy_reused_and_closed_before_recreation(self):
        with patch.object(database, 'ConnectionPool') as factory:
            first = database.get_pool()
            self.assertIs(database.get_pool(), first)
            factory.assert_called_once()
            first.open.assert_called_once()
            self.assertEqual(factory.call_args.kwargs['min_size'], 0)
            self.assertEqual(factory.call_args.kwargs['max_size'], 4)
            self.assertEqual(factory.call_args.kwargs['timeout'], 5)
            self.assertIs(factory.call_args.kwargs['open'], False)
            self.assertIs(factory.call_args.kwargs['kwargs']['autocommit'], True)
            database.close_pool()
            first.close.assert_called_once()
            database.get_pool()
            self.assertEqual(factory.call_count, 2)
            database.close_pool()

    def test_public_docs_do_not_create_pool_and_shutdown_closes_it(self):
        with patch.object(database, 'get_pool') as get_pool, \
                patch('app.close_pool') as close_pool, \
                patch.dict(os.environ, {'DATABASE_URL': '', 'NEON_AUTH_ISSUER': ''}):
            with TestClient(app) as client:
                self.assertEqual(client.get('/docs').status_code, 200)
                self.assertEqual(client.post('/api/activity/days').status_code, 401)
                get_pool.assert_not_called()
            close_pool.assert_called_once()

    def test_pool_wait_or_closed_errors_are_safe_service_errors(self):
        for error in [PoolTimeout('private pool details'), PoolClosed('private pool details')]:
            with patch.object(database, 'get_pool') as get_pool:
                get_pool.return_value.connection.side_effect = error
                with self.assertRaises(ApiError) as raised:
                    with database.connection():
                        self.fail('获取连接失败后不应执行业务')
                self.assertEqual(raised.exception.status, 503)
                self.assertNotIn('private', raised.exception.message)
                get_pool.assert_called_once()

    def test_success_or_error_returns_connection_without_closing_it(self):
        pool = MagicMock()
        borrowed = pool.connection.return_value
        borrowed.__exit__.return_value = False
        with patch.object(database, 'get_pool', return_value=pool):
            for error in [None, ValueError('business error'), psycopg.OperationalError('private')]:
                borrowed.reset_mock()
                try:
                    with database.connection() as connection:
                        if error:
                            raise error
                except (ValueError, ApiError):
                    pass
                borrowed.__exit__.assert_called_once()
                connection.close.assert_not_called()
                if error:
                    self.assertIsNotNone(borrowed.__exit__.call_args.args[0])
                else:
                    self.assertIsNone(borrowed.__exit__.call_args.args[0])

    def test_initialization_failure_prevents_business_and_returns_connection(self):
        pool = MagicMock()
        borrowed = pool.connection.return_value
        borrowed.__exit__.return_value = False
        self.setup_cursor.execute.side_effect = psycopg.OperationalError('private initialization')
        with patch.object(database, 'get_pool', return_value=pool):
            with self.assertRaises(ApiError) as raised:
                with database.connection():
                    self.fail('初始化失败后不应执行业务')
        self.assertEqual(raised.exception.status, 503)
        self.assertNotIn('private', raised.exception.message)
        borrowed.__exit__.assert_called_once()


    def test_startup_warms_once_and_still_closes_pool(self):
        with patch('app.warm_pool') as warm, \
                patch('app.warm_signing_keys') as warm_keys, patch('app.close_pool') as close:
            with TestClient(app) as client:
                self.assertEqual(client.get('/docs').status_code, 200)
            warm.assert_called_once()
            warm_keys.assert_called_once()
            close.assert_called_once()

    def test_warming_borrows_and_returns_without_business_query_and_tolerates_timeout(self):
        pool = MagicMock()
        with patch.object(database, 'get_pool', return_value=pool):
            database.warm_pool()
            pool.connection.assert_called_once()
            pool.connection.return_value.__exit__.assert_called_once()
            pool.connection.return_value.__enter__.return_value.execute.assert_not_called()
            pool.connection.side_effect = PoolTimeout('private detail')
            database.warm_pool()


    def test_read_rows_reuses_existing_transaction_without_committing_it(self):
        connection = MagicMock()
        connection.info.transaction_status = psycopg.pq.TransactionStatus.INTRANS
        connection.execute.return_value.fetchall.return_value = [{'value': 1}]
        self.assertEqual(database.read_rows(connection, psycopg.sql.SQL('SELECT %s AS value'), [1]), [{'value': 1}])
        connection.commit.assert_not_called()
        connection.rollback.assert_not_called()
        self.setup_cursor.execute.assert_not_called()
