import { expect, it, vi } from 'vitest';
import { readViewPreference, saveViewPreference, clearAccountLocalState } from '../../src/app/view-preference';

it('本机位置读取只接受 Home 或 Studio，缺失或异常数据回到 Home', async () => {
  for (const value of [undefined, null, [], { view: 'unknown' }, { view: 'home' }]) {
    expect(await readViewPreference({ get: async () => ({ ui: value }) } as never)).toBe('home');
  }
  expect(await readViewPreference({ get: async () => ({ ui: { view: 'studio' } }) } as never)).toBe('studio');
});
it('快速切换按操作顺序保存，最终恢复最后选择', async () => {
  const values: Record<string, unknown> = {};
  const storage = { get: async () => values, set: vi.fn(async (value: Record<string, unknown>) => { Object.assign(values, value); }) };
  await Promise.all([saveViewPreference('studio', storage as never), saveViewPreference('home', storage as never)]);
  expect(storage.set.mock.calls.map(([value]) => value.ui)).toEqual([{ view: 'studio' }, { view: 'home' }]);
  expect(await readViewPreference(storage as never)).toBe('home');
});
it('账号重置只保留账号无关 ui，新业务键自动清理且不重写偏好', async () => {
  const values: Record<string, unknown> = { ui: { view: 'studio' }, settings: {}, downloads: {}, futureAccountData: {} };
  const storage = { get: async () => ({ ...values }), remove: async (keys: string[]) => { for (const key of keys) delete values[key]; } };
  await clearAccountLocalState(storage as never);
  expect(values).toEqual({ ui: { view: 'studio' } });
});
