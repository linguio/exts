from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import PyJWKClientConnectionError, PyJWKClientError, PyJWTError

from core.config import auth_issuer, required_setting
from core.database import connection
from core.responses import ApiError

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    id: UUID


def unauthenticated() -> ApiError:
    return ApiError(401, 'UNAUTHENTICATED', '登录已失效，请重新登录',
                    {'WWW-Authenticate': 'Bearer'})


@lru_cache(maxsize=4)
def signing_keys(issuer: str) -> PyJWKClient:
    # 仅复用公开验签密钥；未知 kid 由标准库刷新，不保存用户或业务结果。
    return PyJWKClient(issuer + '/.well-known/jwks.json', lifespan=300, timeout=5)


def verify_access_token(token: str) -> CurrentUser:
    issuer = auth_issuer()
    audience = required_setting('API_RESOURCE')
    try:
        if jwt.get_unverified_header(token).get('alg') != 'EdDSA':
            raise unauthenticated()
        key = signing_keys(issuer).get_signing_key_from_jwt(token)
        payload = jwt.decode(token, key.key, algorithms=['EdDSA'], issuer=issuer,
                             audience=audience, options={'require': ['exp', 'iss', 'aud', 'sub']})
        return CurrentUser(UUID(payload['sub']))
    except PyJWKClientConnectionError:
        raise ApiError(503, 'AUTH_UNAVAILABLE', '认证服务暂不可用') from None
    except (PyJWKClientError, PyJWTError, ValueError, TypeError, KeyError):
        raise unauthenticated() from None


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> CurrentUser:
    if credentials is None or credentials.scheme.lower() != 'bearer':
        raise unauthenticated()
    user = verify_access_token(credentials.credentials)
    with connection() as database:
        exists = database.execute('SELECT 1 FROM neon_auth."user" WHERE id = %s',
                                  (user.id,)).fetchone()
    if not exists:
        raise unauthenticated()
    return user
