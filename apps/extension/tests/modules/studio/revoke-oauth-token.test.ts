import { expect, it, vi } from 'vitest';
import { revokeOAuthToken } from '../../../src/modules/studio/services/revoke-oauth-token';

const input = {
  endpoint: 'https://auth.example/oauth2/revoke',
  clientId: 'public-client',
  token: 'refresh-token-value',
  tokenType: 'refresh_token' as const,
};

it('撤销请求省略网页 Cookie，只提交令牌与客户端标识', async () => {
  const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 200 }));
  await revokeOAuthToken({ ...input, fetchImpl });
  const call = fetchImpl.mock.calls[0];
  expect(call?.[0]).toBe(input.endpoint);
  const init = call?.[1];
  expect(init?.credentials).toBe('omit');
  expect(init?.method).toBe('POST');
  const body = init?.body;
  expect(body).toBeInstanceOf(URLSearchParams);
  expect((body as URLSearchParams).get('token')).toBe(input.token);
  expect((body as URLSearchParams).get('token_type_hint')).toBe('refresh_token');
  expect((body as URLSearchParams).get('client_id')).toBe(input.clientId);
});

it('撤销被拒绝时使用固定错误，不回显令牌', async () => {
  const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ code: 'INVALID_ORIGIN' }), { status: 403 }));
  const failure = revokeOAuthToken({ ...input, fetchImpl });
  await expect(failure).rejects.toThrow('撤销刷新令牌失败');
  await expect(failure).rejects.not.toThrow(/refresh-token-value/);
});

it('远端报告令牌不存在时视为已撤销，允许继续本地退出', async () => {
  const fetchImpl = vi.fn(async () => Response.json({ error: 'invalid_request', error_description: 'token not found' }, { status: 400 }));
  await expect(revokeOAuthToken({ ...input, fetchImpl })).resolves.toBeUndefined();
});
