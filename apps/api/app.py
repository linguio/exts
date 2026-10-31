import logging
import os
import secrets
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

api_directory = Path(__file__).resolve().parent
environment_file = api_directory / ".env"
load_dotenv(environment_file if environment_file.exists() else api_directory / ".env.local")

app = FastAPI(title="Exts API")
bearer = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)


@app.get("/hello")
def hello(credentials: HTTPAuthorizationCredentials | None = Security(bearer)):
    token = os.getenv("API_ACCESS_TOKEN")
    if not token:
        raise HTTPException(status_code=503, detail="API is not configured")
    if credentials is None or not secrets.compare_digest(credentials.credentials.encode(), token.encode()):
        raise HTTPException(status_code=401, detail="Unauthorized", headers={"WWW-Authenticate": "Bearer"})

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=503, detail="API is not configured")

    try:
        with psycopg.connect(database_url, connect_timeout=10) as connection:
            with connection.transaction():
                # 超时只作用于当前事务，兼容池化连接。
                connection.execute("SET LOCAL statement_timeout = '5s'")
                result = connection.execute("SELECT 1").fetchone()
    except psycopg.Error:
        logger.error("Neon 数据库探针查询失败")
        raise HTTPException(status_code=503, detail="Database unavailable") from None

    if result != (1,):
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"message": "hello", "database": "ok"}
