import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { authorizationRequest } from '../src/pages/auth/requests.ts';

test('授权确认原样传回签名查询，拒绝授权也由认证服务处理', async () => {
  const raw = 'scope=openid%20email&signed=a%2Bb&client_id=example';
  const fetch = mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/neondb/auth/oauth2/consent');
    assert.equal(options.credentials, 'include');
    assert.deepEqual(JSON.parse(options.body), { accept: false, oauth_query: raw });
    return Response.json({ url: 'https://example.chromiumapp.org/auth?error=access_denied' });
  });
  try { assert.match(await authorizationRequest('consent', raw, 'https://exts.linguio.dev/auth/consent/', false), /access_denied/); }
  finally { fetch.mock.restore(); }
});

test('GitHub 登录携带签名请求，拒绝非网页重定向', async () => {
  const fetch = mock.method(globalThis, 'fetch', async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.provider, 'github');
    assert.equal(body.oauth_query, 'signed=original');
    return Response.json({ url: 'javascript:invalid' });
  });
  try { await assert.rejects(authorizationRequest('sign-in', 'signed=original', 'https://exts.linguio.dev/auth/sign-in/')); }
  finally { fetch.mock.restore(); }
});
