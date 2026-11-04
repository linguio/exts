import { expect, it } from 'vitest';
import { OidcClient, WebStorageStateStore, InMemoryWebStorage } from 'oidc-client-ts';

it('标准库生成 S256 授权请求，并在交换授权码前拒绝不匹配的 state', async () => {
  const authority = 'https://issuer.example.com/auth';
  const client = new OidcClient({
    authority, client_id: 'fixture-public-client', redirect_uri: 'https://extension.chromiumapp.org/auth',
    response_type: 'code', scope: 'openid profile email offline_access', fetchRequestCredentials: 'omit',
    stateStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
    metadata: { issuer: authority, authorization_endpoint: `${authority}/authorize`, token_endpoint: `${authority}/token` },
  });
  const request = await client.createSigninRequest({ nonce: 'fixture-nonce' });
  const url = new URL(request.url);
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('code_challenge_method')).toBe('S256');
  expect(url.searchParams.get('code_challenge')).toBeTruthy();
  expect(url.searchParams.get('nonce')).toBe('fixture-nonce');
  await expect(client.processSigninResponse('https://extension.chromiumapp.org/auth?code=fixture&state=unknown')).rejects.toThrow('No matching state');
});
