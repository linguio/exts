const sessionCookieName = '__Secure-neonauth.session_token';

/** 仅清除当前 Neon Auth 来源的会话 Cookie，不读取或记录 Cookie 值。 */
export async function removeNeonSessionCookie(cookies: Pick<typeof chrome.cookies, 'getAll' | 'remove'>, issuer: string) {
  const { origin, hostname } = new URL(issuer);
  const matches = await cookies.getAll({ domain: hostname, name: sessionCookieName });
  for (const cookie of matches) {
    if (cookie.domain.replace(/^\./, '') !== hostname) continue;
    const removed = await cookies.remove({
      url: `${origin}${cookie.path}`,
      name: sessionCookieName,
      storeId: cookie.storeId,
      ...(cookie.partitionKey ? { partitionKey: cookie.partitionKey } : {}),
    });
    if (!removed) throw new Error('无法清除登录会话');
  }
}
