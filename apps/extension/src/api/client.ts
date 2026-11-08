import axios from 'axios';

export interface ApiSession { userId: string; accessToken: string }

export class ApiRequestError extends Error {
  constructor(public readonly code: string, message: string,
    public readonly status?: number, public readonly requestId?: string) {
    super(message);
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  expectedUserId: string;
  method?: 'POST';
  json?: unknown;
}

export function createApiClient({ baseUrl, getSession, timeoutMs = 15_000 }: {
  baseUrl: string;
  getSession: () => Promise<ApiSession>;
  timeoutMs?: number;
}) {
  const http = axios.create({
    baseURL: baseUrl, adapter: 'fetch', timeout: timeoutMs, withCredentials: false,
    headers: { Accept: 'application/json' },
    responseType: 'json', transitional: { silentJSONParsing: false },
    fetchOptions: { cache: 'no-store', redirect: 'error' },
    // HTTP 状态由项目统一映射为安全的业务错误。
    validateStatus: () => true,
  });
  async function readSession() {
    try { return await getSession(); }
    catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'session-expired') {
        throw new ApiRequestError('SESSION_EXPIRED', '登录已失效，请重新登录', 401);
      }
      throw new ApiRequestError('AUTH_UNAVAILABLE', '暂时无法读取登录会话');
    }
  }
  return {
    async request<T>(path: string, options: RequestOptions): Promise<T> {
      const url = new URL(path, baseUrl);
      if (!path.startsWith('/') || url.origin !== baseUrl) throw new ApiRequestError('INVALID_REQUEST', '请求地址无效');
      try {
        const session = await readSession();
        if (session.userId !== options.expectedUserId) throw new ApiRequestError('SESSION_CHANGED', '账号已变更');
        options.signal?.throwIfAborted();
        const response = await http.request<unknown>({
          url: path, method: options.method ?? 'POST', data: options.json ?? {}, signal: options.signal,
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const body = response.data;
        if (response.status < 200 || response.status >= 300) {
          const error = body && typeof body === 'object' && 'error' in body ? body.error : null;
          const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
            && /^[A-Z_]{1,64}$/.test(error.code) ? error.code : 'REQUEST_FAILED';
          const requestId = typeof response.headers['x-request-id'] === 'string' ? response.headers['x-request-id'] : undefined;
          throw new ApiRequestError(code, response.status === 401 ? '登录已失效，请重新登录' : '数据加载失败，请稍后重试', response.status, requestId);
        }
        if (!body || typeof body !== 'object' || !('data' in body)) throw new ApiRequestError('INVALID_RESPONSE', '接口返回格式无效');
        if ((await readSession()).userId !== session.userId) throw new ApiRequestError('SESSION_CHANGED', '账号已变更');
        options.signal?.throwIfAborted();
        return body.data as T;
      } catch (error) {
        if (options.signal?.aborted || axios.isCancel(error)) throw new ApiRequestError('CANCELLED', '请求已取消');
        if (axios.isAxiosError(error)) {
          if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new ApiRequestError('TIMEOUT', '请求超时，请稍后重试');
          }
          if (error.code === 'ERR_BAD_RESPONSE') throw new ApiRequestError('INVALID_RESPONSE', '接口返回格式无效', error.response?.status);
        }
        if (error instanceof ApiRequestError) throw error;
        throw new ApiRequestError('NETWORK_ERROR', '无法连接 API，请确认本地服务已启动');
      }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
