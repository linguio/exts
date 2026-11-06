import logging
from typing import Generic, TypeVar
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.exceptions import HTTPException

T = TypeVar('T')
logger = logging.getLogger('exts.api')


class Success(BaseModel, Generic[T]):
    data: T


class ErrorDetail(BaseModel):
    code: str
    message: str
    requestId: str


class Failure(BaseModel):
    error: ErrorDetail


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str, headers: dict | None = None):
        self.status = status
        self.code = code
        self.message = message
        self.headers = headers or {}


def failure_response(request: Request, error: ApiError) -> JSONResponse:
    request_id = getattr(request.state, 'request_id', None) or str(uuid4())
    return JSONResponse(
        status_code=error.status,
        content=Failure(error=ErrorDetail(
            code=error.code, message=error.message, requestId=request_id,
        )).model_dump(),
        headers={**error.headers, 'X-Request-ID': request_id, 'Cache-Control': 'no-store'},
    )


def install_responses(app: FastAPI) -> None:
    @app.middleware('http')
    async def request_context(request: Request, call_next):
        request.state.request_id = str(uuid4())
        try:
            response = await call_next(request)
        except Exception as error:
            # 原始异常可能含 SQL、令牌或连接串，只记录分类与排错标识。
            logger.error('request_failed category=%s request_id=%s',
                         type(error).__name__, request.state.request_id)
            response = failure_response(request, ApiError(500, 'INTERNAL_ERROR', '服务暂时异常'))
        response.headers['X-Request-ID'] = request.state.request_id
        if request.url.path.startswith(('/api/', '/internal/')):
            response.headers['Cache-Control'] = 'no-store'
        return response

    @app.exception_handler(ApiError)
    async def handle_api_error(request: Request, error: ApiError):
        if error.status >= 500:
            logger.error('service_failed code=%s request_id=%s', error.code,
                         request.state.request_id)
        return failure_response(request, error)

    @app.exception_handler(RequestValidationError)
    async def handle_validation(request: Request, error: RequestValidationError):
        return failure_response(request, ApiError(422, 'INVALID_REQUEST', '请求参数不合法'))

    @app.exception_handler(HTTPException)
    async def handle_http_error(request: Request, error: HTTPException):
        codes = {401: 'UNAUTHENTICATED', 403: 'FORBIDDEN', 404: 'NOT_FOUND',
                 405: 'METHOD_NOT_ALLOWED'}
        messages = {401: '请先登录', 403: '无权执行此操作', 404: '接口不存在',
                    405: '请求方法不支持'}
        return failure_response(request, ApiError(
            error.status_code, codes.get(error.status_code, 'HTTP_ERROR'),
            messages.get(error.status_code, '请求失败'), error.headers,
        ))


ERROR_RESPONSES = {status: {'model': Failure} for status in (401, 403, 422, 500, 503)}
