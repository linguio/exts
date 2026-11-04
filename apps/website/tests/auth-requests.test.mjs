import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { authorizationRequest, readLoginStart, readLogoutReturn } from '../src/pages/auth/requests.ts';

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
  let body;
  const fetch = mock.method(globalThis, 'fetch', async (_url, options) => {
    body = JSON.parse(options.body);
    return Response.json({ url: 'javascript:invalid' });
  });
  try {
    await assert.rejects(authorizationRequest('sign-in', 'signed=original', 'https://exts.linguio.dev/auth/sign-in/'), /认证服务返回了无效地址/);
    assert.equal(body.provider, 'github');
    assert.equal(body.oauth_query, 'signed=original');
    assert.deepEqual(body.additionalParams, { prompt: 'select_account' });
  }
  finally { fetch.mock.restore(); }
});

test('Google 登录沿用签名查询与 Cookie，并请求选择 Google 账号', async () => {
  let body;
  const fetch = mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/neondb/auth/sign-in/social');
    assert.equal(options.credentials, 'include');
    body = JSON.parse(options.body);
    return Response.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth' });
  });
  try {
    await authorizationRequest('sign-in', 'signed=a%2Bb&scope=openid%20email', 'https://exts.linguio.dev/auth/sign-in/', undefined, 'google');
    assert.deepEqual(body, {
      provider: 'google', callbackURL: 'https://exts.linguio.dev/auth/sign-in/',
      oauth_query: 'signed=a%2Bb&scope=openid%20email', additionalParams: { prompt: 'select_account' }, disableRedirect: true,
    });
  } finally { fetch.mock.restore(); }
});

test('登录引导读取提供方但不重建授权查询，旧入口没有片段时继续原流程', () => {
  const url = 'https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth/oauth2/authorize?state=a%2Bb&scope=openid%20email';
  for (const provider of ['google', 'github']) {
    assert.deepEqual(readLoginStart('#' + new URLSearchParams({ provider, authorize: url })), { provider, url });
  }
  assert.equal(readLoginStart(''), null);
});

test('登录引导拒绝未知提供方及非受信授权地址', () => {
  const endpoint = 'https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth/oauth2/authorize';
  const fragment = (provider, authorize) => '#' + new URLSearchParams({ provider, authorize });
  assert.throws(() => readLoginStart(fragment('unknown', endpoint)), /登录引导无效/);
  for (const url of [
    'https://example.com/oauth2/authorize',
    endpoint.replace('https:', 'http:'),
    endpoint.replace('/oauth2/authorize', '/sign-in/social'),
    endpoint.replace('https://', 'https://user:password@'),
    endpoint + '#extra',
  ]) assert.throws(() => readLoginStart(fragment('google', url)), /登录引导无效/);
});

test('退出回跳只允许固定插件的 logout 路径', () => {
  const redirect = 'https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org/logout';
  assert.equal(readLogoutReturn('#' + new URLSearchParams({ return: redirect })), redirect);
  for (const target of ['https://example.com/logout', redirect + '?code=secret', redirect.replace('/logout', '/auth')]) {
    assert.throws(() => readLogoutReturn('#' + new URLSearchParams({ return: target })), /退出回跳无效/);
  }
});
