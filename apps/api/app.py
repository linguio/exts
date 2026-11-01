from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from scalar_fastapi import AgentScalarConfig, get_scalar_api_reference

api_directory = Path(__file__).resolve().parent
environment_file = api_directory / ".env"
load_dotenv(environment_file if environment_file.exists() else api_directory / ".env.local")

app = FastAPI(
    title="Exts API",
    docs_url=None,
    redoc_url=None,
    description="Exts 后端接口文档。当前尚未开放业务接口。",
)


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
