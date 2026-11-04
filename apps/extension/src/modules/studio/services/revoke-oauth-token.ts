/** 公开客户端撤销只提交令牌与 Client ID，不附带网页 Cookie。失败文案固定，避免回显令牌。 */
export async function revokeOAuthToken(input: {
  endpoint: string;
  clientId: string;
  token: string;
  tokenType: 'refresh_token' | 'access_token';
  fetchImpl?: typeof fetch;
}) {
  const response = await (input.fetchImpl ?? fetch)(input.endpoint, {
    method: 'POST',
    credentials: 'omit',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token: input.token, token_type_hint: input.tokenType, client_id: input.clientId }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('撤销刷新令牌失败');
}
