import { expect, it } from 'vitest';
import { readViewPreference, saveViewPreference, readStudioRoute, saveStudioRoute } from '../../src/app/view-preference';

it('会话位置只接受 Home 或 Studio，缺失或异常数据回到 Home', async () => {
  for (const value of [undefined, null, [], { view: 'unknown' }, { view: 'home' }]) {
    expect(await readViewPreference({ get: async () => ({ 'ui-session': value }) } as never)).toBe('home');
  }
  expect(await readViewPreference({ get: async () => ({ 'ui-session': { view: 'studio' } }) } as never)).toBe('studio');
});
it('快速切换按操作顺序保存，最终恢复最后选择', async () => {
  const values: Record<string, unknown> = {};
  const storage = { get: async () => values, set: async (value: Record<string, unknown>) => { Object.assign(values, value); } };
  await Promise.all([saveViewPreference('studio', storage as never), saveViewPreference('home', storage as never)]);
  expect(await readViewPreference(storage as never)).toBe('home');
});

it('并发保存路由和视图互不覆盖，只恢复所属账号的路由', async () => {
  const values: Record<string, unknown> = {};
  const storage = { get: async () => values, set: async (value: Record<string, unknown>) => { Object.assign(values, value); } };
  await Promise.all([saveViewPreference('studio', storage as never), saveStudioRoute('account-a', '/activity/daily', storage as never)]);
  expect(await readViewPreference(storage as never)).toBe('studio');
  expect(await readStudioRoute('account-a', storage as never)).toBe('/activity/daily');
  expect(await readStudioRoute('account-b', storage as never)).toBeNull();
  await Promise.all([saveStudioRoute('account-b', '/overview', storage as never), saveViewPreference('home', storage as never)]);
  expect(await readViewPreference(storage as never)).toBe('home');
  expect(await readStudioRoute('account-b', storage as never)).toBe('/overview');
  expect(await readStudioRoute('account-a', storage as never)).toBeNull();
});
