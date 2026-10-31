import logging
import os
import secrets
from pathlib import Path
from typing import Literal

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from scalar_fastapi import AgentScalarConfig, get_scalar_api_reference

api_directory = Path(__file__).resolve().parent
environment_file = api_directory / ".env"
load_dotenv(environment_file if environment_file.exists() else api_directory / ".env.local")

app = FastAPI(
    title="Exts API",
    docs_url=None,
    redoc_url=None,
    description=(
        "Exts 后端接口。当前提供 API 与 Neon 数据库的只读联通验证。\n\n"
        "文档可公开阅读；调用受保护接口时，在认证栏填写个人 API_ACCESS_TOKEN，"
        "只填令牌内容，不加引号或 Bearer 前缀。令牌请自行保管，不写入源码或官网。"
    ),
)
bearer = HTTPBearer(auto_error=False, description="个人访问令牌；仅填写令牌值。")
logger = logging.getLogger(__name__)


class HelloResponse(BaseModel):
    message: Literal["hello"]
    database: Literal["ok"]


class ErrorResponse(BaseModel):
    detail: str


@app.get("/docs", include_in_schema=False)
def api_documentation():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Exts API 文档",
        scalar_js_url="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js",
        scalar_proxy_url="",
        persist_auth=False,
        telemetry=False,
        agent=AgentScalarConfig(disabled=True),
    )


@app.get(
    "/hello",
    tags=["联通验证"],
    summary="验证 API 与数据库连接",
    description="验证个人 Bearer 令牌后，对 Neon 执行 SELECT 1。不会创建表或写入业务数据。",
    response_model=HelloResponse,
    responses={
        200: {"description": "鉴权与数据库查询成功", "content": {"application/json": {
            "example": {"message": "hello", "database": "ok"},
        }}},
        401: {"model": ErrorResponse, "description": "未提供令牌或令牌错误", "content": {
            "application/json": {"example": {"detail": "Unauthorized"}},
        }},
        503: {"model": ErrorResponse, "description": "服务端配置缺失或数据库暂不可用", "content": {
            "application/json": {"examples": {
                "configuration": {"summary": "配置缺失", "value": {"detail": "API is not configured"}},
                "database": {"summary": "数据库不可用", "value": {"detail": "Database unavailable"}},
            }},
        }},
    },
)
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
