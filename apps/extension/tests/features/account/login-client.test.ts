import { afterEach, expect, it, vi } from 'vitest';
import { loginAccount } from '../../../src/features/account/auth-client';
import { rememberSessionGeneration } from '../../../src/features/account/session-client';

vi.mock('../../../src/features/settings/store-client', () => ({ refreshSettings: vi.fn(async () => {}) }));
afterEach(() => vi.unstubAllGlobals());

it('主动登录重新核验账号并使用后台当前会话，拒绝复用页面旧标识', async () => {
  rememberSessionGeneration('old-worker');
  const user = { id: 'user-1', name: 'User', email: '', image: null };
  const sendMessage = vi.fn(async (message: { type: string; action?: string; generation?: string }) => {
    if (message.action === 'get') return { ok: true, user: null, generation: 'current-worker' };
    if (message.type === 'exts:session:generation') return { ok: true, generation: 'current-worker' };
    return message.generation === 'current-worker' ? { ok: true, user, generation: 'after-login' }
      : { ok: false, error: 'Session changed. Please try again.' };
  });
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  await expect(loginAccount('github')).resolves.toEqual(user);
  expect(sendMessage.mock.calls.map(([message]) => message.action ?? message.type)).toEqual(['get', 'exts:session:generation', 'login']);
});

it('核验期间会话再次改变时停止登录，不拿新标识绕过账号核验', async () => {
  const sendMessage = vi.fn().mockResolvedValueOnce({ ok: true, user: null, generation: 'verified' })
    .mockResolvedValueOnce({ ok: true, generation: 'changed' });
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  await expect(loginAccount('github')).rejects.toThrow('Session changed');
  expect(sendMessage).toHaveBeenCalledTimes(2);
});

it('核验发现已有账号或核验失败时不发起登录', async () => {
  const sendMessage = vi.fn().mockResolvedValueOnce({ ok: true, user: { id: 'other-user' }, generation: 'current' })
    .mockResolvedValueOnce({ ok: false, code: 'state-unavailable', error: 'Unable to verify account status.' });
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  await expect(loginAccount('google')).rejects.toThrow();
  await expect(loginAccount('google')).rejects.toThrow();
  expect(sendMessage.mock.calls.every(([message]) => message.action === 'get')).toBe(true);
});

it('过期账号允许重新登录，但后台重置拒绝时不自动重试', async () => {
  const sendMessage = vi.fn().mockResolvedValueOnce({ ok: false, code: 'session-expired', error: 'Session expired.' })
    .mockResolvedValueOnce({ ok: true, generation: 'fresh' })
    .mockResolvedValueOnce({ ok: false, error: 'Session changed. Please try again.' });
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  await expect(loginAccount('github')).rejects.toThrow('Session changed');
  expect(sendMessage).toHaveBeenCalledTimes(3);
  expect(sendMessage.mock.calls[2]![0]).toMatchObject({ action: 'login', generation: 'fresh' });
});
