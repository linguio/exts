import os
import sys
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from uuid import UUID

import jwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from jwt.exceptions import PyJWKClientConnectionError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from core import auth
from core.auth import verify_access_token
from core.responses import ApiError

ISSUER = 'https://auth.example.test/auth'
RESOURCE = 'https://api.exts.linguio.dev'
USER = '00000000-0000-4000-8000-000000000001'


class TokenTests(unittest.TestCase):
    def setUp(self):
        self.private_key = Ed25519PrivateKey.generate()
        self.environment = patch.dict(os.environ, {'NEON_AUTH_ISSUER': ISSUER, 'API_RESOURCE': RESOURCE})
        self.environment.start()
        self.key_client = patch('core.auth.signing_keys')
        self.keys = self.key_client.start().return_value
        self.keys.get_signing_key_from_jwt.return_value = SimpleNamespace(key=self.private_key.public_key())

    def tearDown(self):
        self.key_client.stop()
        self.environment.stop()

    def token(self, **changes):
        claims = dict(iss=ISSUER, aud=[RESOURCE, ISSUER + '/oauth2/userinfo'],
                      sub=USER, exp=int(time.time()) + 300)
        claims.update(changes)
        return jwt.encode(claims, self.private_key, algorithm='EdDSA', headers={'kid': 'test'})

    def test_signed_access_token_maps_to_uuid(self):
        self.assertEqual(verify_access_token(self.token()).id, UUID(USER))

    def test_invalid_identity_or_claims_are_rejected(self):
        for changes in (dict(iss=ISSUER + '-other'), dict(aud='other-api'), dict(exp=0),
                        dict(sub='invalid'), dict(nbf=int(time.time()) + 300), dict(exp=None)):
            with self.subTest(changes=changes), self.assertRaises(ApiError) as raised:
                verify_access_token(self.token(**changes))
            self.assertEqual(raised.exception.status, 401)

    def test_wrong_signature_is_rejected(self):
        self.keys.get_signing_key_from_jwt.return_value = SimpleNamespace(
            key=Ed25519PrivateKey.generate().public_key(),
        )
        with self.assertRaises(ApiError) as raised:
            verify_access_token(self.token())
        self.assertEqual(raised.exception.status, 401)

    def test_symmetric_and_opaque_tokens_are_rejected_without_key_lookup(self):
        for token in (jwt.encode({'sub': USER}, 'test-key-not-production-value-123456', algorithm='HS256'),
                      'opaque-token'):
            with self.subTest(token_type=token[:5]), self.assertRaises(ApiError) as raised:
                verify_access_token(token)
            self.assertEqual(raised.exception.status, 401)
        self.keys.get_signing_key_from_jwt.assert_not_called()

    def test_key_network_failure_is_service_failure(self):
        self.keys.get_signing_key_from_jwt.side_effect = PyJWKClientConnectionError('private upstream')
        with self.assertRaises(ApiError) as raised:
            verify_access_token(self.token())
        self.assertEqual(raised.exception.status, 503)
        self.assertNotIn('private', raised.exception.message)


    def test_warm_public_keys_fetches_without_validating_user(self):
        auth.warm_signing_keys()
        self.keys.get_signing_keys.assert_called_once()
        self.keys.get_signing_key_from_jwt.assert_not_called()

    def test_warm_public_keys_skips_missing_config_and_tolerates_failure(self):
        with patch.dict(os.environ, {'NEON_AUTH_ISSUER': ''}):
            auth.warm_signing_keys()
        self.keys.get_signing_keys.assert_not_called()
        self.keys.get_signing_keys.side_effect = PyJWKClientConnectionError('private detail')
        with self.assertLogs('exts.api', level='WARNING') as captured:
            auth.warm_signing_keys()
        self.assertNotIn('private detail', ' '.join(captured.output))
