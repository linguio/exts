import { expect, it, vi } from 'vitest';
import { createAccountController } from '../../../src/modules/studio/services/account-controller';

function setup() {
  const user = { expired: false, refresh_token: 'fixture-refresh', access_token: 'fixture-access', profile: { sub: 'user-1', name: 'User', email: 'user@example.com' } };
  const manager = {
    getUser: vi.fn(async () => user),
    signinPopup: vi.fn(async () => user),
    signinSilent: vi.fn(async () => user),
    revokeTokens: vi.fn(async () => {}),
    removeUser: vi.fn(async () => {}),
  };
  return { user, manager, controller: createAccountController(manager) };
}

it('仅返回展示资料，不将访问或刷新令牌交给页面', async () => {
  const { controller, manager } = setup();
  expect(await controller.login()).toEqual({ id: 'user-1', name: 'User', email: 'user@example.com', image: null });
  expect(manager.signinPopup).toHaveBeenCalledWith({ nonce: expect.any(String) });
});

it('恢复过期会话时使用刷新令牌', async () => {
  const { controller, manager, user } = setup();
  manager.getUser.mockResolvedValueOnce({ ...user, expired: true });
  expect((await controller.get())?.id).toBe('user-1');
  expect(manager.signinSilent).toHaveBeenCalledTimes(1);
});

it('多页面同时发起登录时只打开一次授权', async () => {
  const { controller, manager } = setup();
  await Promise.all([controller.login(), controller.login()]);
  expect(manager.signinPopup).toHaveBeenCalledTimes(1);
});

it('撤销失败保留会话，成功后才删除本地认证数据', async () => {
  const { controller, manager } = setup();
  manager.revokeTokens.mockRejectedValueOnce(new Error('network'));
  await expect(controller.logout()).rejects.toThrow();
  expect(manager.removeUser).not.toHaveBeenCalled();
  await controller.logout();
  expect(manager.revokeTokens).toHaveBeenCalledWith(['refresh_token']);
  expect(manager.removeUser).toHaveBeenCalledTimes(1);
});

it('刷新令牌失效后回到未登录，网络错误保留重试机会', async () => {
  const { controller, manager, user } = setup();
  manager.getUser.mockResolvedValue({ ...user, expired: true });
  manager.signinSilent.mockRejectedValueOnce({ error: 'invalid_grant' });
  expect(await controller.get()).toBeNull();
  expect(manager.removeUser).toHaveBeenCalledTimes(1);
  manager.signinSilent.mockRejectedValueOnce(new Error('offline'));
  await expect(controller.get()).rejects.toThrow('offline');
  expect(manager.removeUser).toHaveBeenCalledTimes(1);
});
