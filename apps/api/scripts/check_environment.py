import os
import sys

from core.config import load_environment

REQUIRED_SETTINGS = ('DATABASE_URL', 'NEON_AUTH_ISSUER', 'API_RESOURCE')


def main() -> int:
    load_environment()
    missing = [name for name in REQUIRED_SETTINGS if not os.environ.get(name, '').strip()]
    if missing:
        print('API 缺少必要环境变量：' + '、'.join(missing), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
