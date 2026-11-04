interface Profile { sub?: string; name?: unknown; email?: unknown; picture?: unknown }

/** 只并入展示所需字段。用户信息里的主体与身份令牌不一致时保持原资料。 */
export function mergeUserInfo(profile: Profile, claims: unknown): Profile {
  if (!claims || typeof claims !== 'object') return profile;
  const record = claims as Record<string, unknown>;
  if (typeof record.sub === 'string' && typeof profile.sub === 'string' && profile.sub && record.sub !== profile.sub) return profile;
  const picture = typeof record.picture === 'string' ? record.picture : typeof record.image === 'string' ? record.image : profile.picture;
  return {
    ...profile,
    sub: typeof profile.sub === 'string' && profile.sub ? profile.sub : typeof record.sub === 'string' ? record.sub : profile.sub,
    name: typeof record.name === 'string' ? record.name : profile.name,
    email: typeof record.email === 'string' ? record.email : profile.email,
    picture,
  };
}

/** 用访问令牌读取用户信息，不附带网页 Cookie，也不把令牌写入错误。 */
export async function readUserInfo(endpoint: string, accessToken: string, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(endpoint, {
    credentials: 'omit',
    headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('无法读取用户信息');
  return response.json() as Promise<unknown>;
}
