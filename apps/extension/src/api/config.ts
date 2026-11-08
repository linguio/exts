const allowedOrigins = ['http://127.0.0.1:8000', 'https://api.exts.linguio.dev'];

export function resolveApiBaseUrl(value?: string, development = false) {
  const selected = value?.trim() || (development ? allowedOrigins[0]! : allowedOrigins[1]!);
  const url = new URL(selected);
  if (!allowedOrigins.includes(url.origin) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('API 地址配置无效');
  }
  return url.origin;
}
