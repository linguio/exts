import { expect, it, vi } from 'vitest';
import { removeNeonSessionCookie } from '../../../src/features/account/remove-session-cookie';

const issuer = 'https://auth.example/neondb/auth';

it('只删除 Neon 会话 Cookie，不清理其他 Cookie', async () => {
  const cookies = {
    getAll: vi.fn(async () => [{ name: '__Secure-neonauth.session_token', domain: 'auth.example', path: '/neondb/auth', storeId: '0' }]),
    remove: vi.fn(async () => ({ name: '__Secure-neonauth.session_token' })),
  };
  await removeNeonSessionCookie(cookies as never, issuer);
  expect(cookies.getAll).toHaveBeenCalledWith({ domain: 'auth.example', name: '__Secure-neonauth.session_token' });
  expect(cookies.remove).toHaveBeenCalledWith({ url: 'https://auth.example/neondb/auth', name: '__Secure-neonauth.session_token', storeId: '0' });
});

it('没有会话 Cookie 视为已退出，删除失败则阻止清除插件身份', async () => {
  const cookies = { getAll: vi.fn(async () => []), remove: vi.fn() };
  await expect(removeNeonSessionCookie(cookies as never, issuer)).resolves.toBeUndefined();
  expect(cookies.remove).not.toHaveBeenCalled();
  cookies.getAll.mockResolvedValueOnce([{ name: '__Secure-neonauth.session_token', domain: 'auth.example', path: '/', storeId: '0' }] as never);
  cookies.remove.mockResolvedValueOnce(undefined as never);
  await expect(removeNeonSessionCookie(cookies as never, issuer)).rejects.toThrow();
});
