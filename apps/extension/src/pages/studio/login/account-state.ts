/** 账号状态统一决定 Studio 内容，不与具体业务页面耦合。 */
export function studioAccess({ user, isPending, error }: {
  user: { id: string } | null;
  isPending: boolean;
  error: (Error & { code?: string }) | null;
}): 'loading' | 'signed-out' | 'error' | 'ready' {
  if (isPending) return 'loading';
  if (error?.code === 'session-expired') return 'signed-out';
  if (error) return 'error';
  return user ? 'ready' : 'signed-out';
}

export const studioSessionKey = (userId: string, resetVersion: number) => `${userId}:${resetVersion}`;

/** 页面选择只属于产生它的已确认会话，不回退到第一个菜单。 */
export function selectedStudioPage<T>(selection: { sessionKey: string; page: T } | null, sessionKey: string | null): T | null {
  return sessionKey && selection?.sessionKey === sessionKey ? selection.page : null;
}
