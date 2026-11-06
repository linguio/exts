import os
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

API_DIRECTORY = Path(__file__).resolve().parents[1]
BUSINESS_TIMEZONE = 'Asia/Shanghai'
BUSINESS_ZONE = ZoneInfo(BUSINESS_TIMEZONE)


def load_environment() -> None:
    environment = API_DIRECTORY / '.env'
    load_dotenv(environment if environment.exists() else API_DIRECTORY / '.env.local')


def required_setting(name: str) -> str:
    from core.responses import ApiError

    value = os.environ.get(name, '').strip()
    if not value:
        raise ApiError(503, 'SERVICE_UNAVAILABLE', '服务配置暂不可用')
    return value


def auth_issuer() -> str:
    from core.responses import ApiError

    issuer = required_setting('NEON_AUTH_ISSUER')
    parsed = urlsplit(issuer)
    if (parsed.scheme != 'https' or not parsed.hostname or parsed.username
            or parsed.password or parsed.query or parsed.fragment or issuer.endswith('/')):
        raise ApiError(503, 'SERVICE_UNAVAILABLE', '认证配置暂不可用')
    return issuer
