export const issuer = 'https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth';
export type LoginProvider = 'github' | 'google';

/** 引导片段只选择提供方；授权目标必须是固定 Neon 端点。 */
export function readLoginStart(hash: string): { provider: LoginProvider; url: string } | null {
  if (!hash) return null;
  const params = new URLSearchParams(hash.slice(1));
  const provider = params.get('provider');
  const raw = params.get('authorize');
  if ((provider !== 'github' && provider !== 'google') || !raw) throw new Error('登录引导无效，请从插件重新发起');
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error('登录引导无效，请从插件重新发起'); }
  const expected = new URL(`${issuer}/oauth2/authorize`);
  if (url.origin !== expected.origin || url.pathname !== expected.pathname || url.username || url.password || url.hash) {
    throw new Error('登录引导无效，请从插件重新发起');
  }
  return { provider, url: raw };
}

/** 签名查询必须原样交回 Neon，不能重新排序、解码或删改。 */
export async function authorizationRequest(path: 'continue' | 'consent' | 'sign-in', rawQuery: string, callbackURL: string, accept?: boolean, provider: LoginProvider = 'github') {
  const endpoint = path === 'sign-in' ? '/sign-in/social' : `/oauth2/${path}`;
  const body = path === 'sign-in'
    ? { provider, callbackURL, oauth_query: rawQuery, additionalParams: { prompt: 'select_account' }, disableRedirect: true }
    : path === 'continue' ? { selected: true, oauth_query: rawQuery } : { accept: accept === true, oauth_query: rawQuery };
  const response = await fetch(`${issuer}${endpoint}`, {
    method: 'POST', credentials: 'include', referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('认证请求失败，请从插件重新发起');
  const data = await response.json();
  if (typeof data.url !== 'string') throw new Error('认证服务未返回下一步地址');
  const next = new URL(data.url);
  if (next.protocol !== 'https:' && !(next.protocol === 'http:' && next.hostname === 'localhost')) throw new Error('认证服务返回了无效地址');
  if (next.username || next.password) throw new Error('认证服务返回了无效地址');
  return next.href;
}
