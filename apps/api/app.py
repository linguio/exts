import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from scalar_fastapi import AgentScalarConfig, get_scalar_api_reference

from core.auth import warm_signing_keys
from core.config import load_environment
from core.database import close_pool, warm_pool
from core.responses import install_responses
from jobs.activity_days import router as jobs_router
from modules.activity.router import router as activity_router

load_environment()


@asynccontextmanager
async def lifespan(app: FastAPI):
    preparation = asyncio.gather(
        asyncio.to_thread(warm_pool),
        asyncio.to_thread(warm_signing_keys),
    )
    try:
        yield
    finally:
        try:
            await preparation
        finally:
            close_pool()


app = FastAPI(
    title="Exts API",
    docs_url=None,
    redoc_url=None,
    description="Exts 后端接口文档。业务接口使用 Bearer 认证，数据仅属于当前用户。",
    lifespan=lifespan,
)

install_responses(app)
app.include_router(activity_router)
app.include_router(jobs_router)


@app.get("/", include_in_schema=False)
def documentation_entry():
    return RedirectResponse(url="/docs", status_code=307)


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
