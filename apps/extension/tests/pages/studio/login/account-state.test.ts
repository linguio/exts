import { expect, it } from 'vitest';
import { studioAccess, studioSessionKey } from '../../../../src/pages/studio/login/account-state';
import { resolveStudioRoute } from '../../../../src/pages/studio/routes';

it('身份未确认时等待，不提前显示登录或业务内容', () => {
  expect(studioAccess({ user: null, isPending: true, error: null })).toBe('loading');
});
it('区分访客、读取失败、会话过期和已登录，错误时不展示遗留用户内容', () => {
  const user = { id: 'account-a' };
  expect(studioAccess({ user: null, isPending: false, error: null })).toBe('signed-out');
  expect(studioAccess({ user, isPending: false, error: new Error('读取失败') })).toBe('error');
  expect(studioAccess({ user, isPending: false, error: Object.assign(new Error('过期'), { code: 'session-expired' }) })).toBe('signed-out');
  expect(studioAccess({ user, isPending: false, error: null })).toBe('ready');
});
it('换账号和同一账号重置都更换内容生命周期，普通重渲染保持不变', () => {
  expect(studioSessionKey('account-a', 1)).toBe(studioSessionKey('account-a', 1));
  expect(studioSessionKey('account-a', 1)).not.toBe(studioSessionKey('account-b', 1));
  expect(studioSessionKey('account-a', 1)).not.toBe(studioSessionKey('account-a', 2));
});

it('恢复已注册路由，缺失或未知路由回到 Overview', () => {
  expect(resolveStudioRoute('/activity/daily').page.route).toBe('/activity/daily');
  for (const route of [null, '/unknown', '/overview']) {
    expect(resolveStudioRoute(route).page.route).toBe('/overview');
  }
});
