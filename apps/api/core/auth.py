import logging
import os
from collections.abc import Iterator
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import PyJWKClientConnectionError, PyJWKClientError, PyJWTError
from psycopg import Connection

from core.config import auth_issuer, required_setting
from core.database import borrow_connection
from core.responses import ApiError

bearer = HTTPBearer(auto_error=False)
logger = logging.getLogger('exts.api')


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


def warm_signing_keys() -> None:
    if not os.environ.get('NEON_AUTH_ISSUER', '').strip():
        return
    try:
        # 仅提前获取公开密钥，继续使用既有缓存期限和未知密钥刷新逻辑。
        signing_keys(auth_issuer()).get_signing_keys()
    except (PyJWTError, ApiError, ValueError):
        logger.warning('API 验签公钥预取失败，身份验证将按需重试')


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


def get_token_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> CurrentUser:
    if credentials is None or credentials.scheme.lower() != 'bearer':
        raise unauthenticated()
    return verify_access_token(credentials.credentials)


def get_user_database(user: Annotated[CurrentUser, Depends(get_token_user)]) -> Iterator[Connection]:
    # 先验证令牌，请求内共享借用连接；事务由具体执行入口管理。
    with borrow_connection() as database:
        yield database
