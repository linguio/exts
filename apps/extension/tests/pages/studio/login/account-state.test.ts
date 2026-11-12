import { expect, it } from 'vitest';
import { studioAccess, studioSessionKey, selectedStudioPage } from '../../../../src/pages/studio/login/account-state';

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

it('登录不自动选择页面，退出和换会话均不沿用旧选择', () => {
  expect(selectedStudioPage(null, 'account-a:1')).toBeNull();
  const selected = { sessionKey: 'account-a:1', page: 'daily' };
  expect(selectedStudioPage(selected, 'account-a:1')).toBe('daily');
  expect(selectedStudioPage(selected, null)).toBeNull();
  expect(selectedStudioPage(selected, 'account-b:1')).toBeNull();
  expect(selectedStudioPage(selected, 'account-a:2')).toBeNull();
});
