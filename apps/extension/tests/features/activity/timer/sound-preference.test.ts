import { expect, it } from 'vitest';
import { defaultSounds, readSounds, saveSound, soundKeys } from '../../../../src/features/activity/timer/sound-preference';

it('无偏好或非法偏好使用已确认的默认音色', async () => {
  expect(await readSounds({ get: async () => ({}) })).toEqual(defaultSounds);
  expect(await readSounds({ get: async () => ({ [soundKeys.tick]: 'water', [soundKeys.end]: 42 }) })).toEqual(defaultSounds);
});

it('读取两类已保存的合法偏好，不需要账号或计时状态', async () => {
  expect(await readSounds({ get: async () => ({ [soundKeys.tick]: 'pink', [soundKeys.end]: 'harp' }) })).toEqual({ tick: 'pink', end: 'harp' });
});

it('分别保存音色，不覆盖其他分组或本地业务键', async () => {
  const values: Record<string, unknown> = { [soundKeys.end]: 'warm', unrelated: true };
  const storage = { set: async (patch: Record<string, unknown>) => { Object.assign(values, patch); } };
  await saveSound('tick', 'metronome', storage);
  expect(values).toEqual({ [soundKeys.tick]: 'metronome', [soundKeys.end]: 'warm', unrelated: true });
});

it('旧Rain Tap偏好回退为默认计时音，保留已选完成音', async () => {
  expect(await readSounds({ get: async () => ({ [soundKeys.tick]: 'rain', [soundKeys.end]: 'harp' }) })).toEqual({ tick: 'quartz', end: 'harp' });
});

it('两组静音可独立保存并在重新读取后保持关闭', async () => {
  const values: Record<string, unknown> = { [soundKeys.tick]: 'pink', [soundKeys.end]: 'harp' };
  const storage = { get: async () => values, set: async (patch: Record<string, unknown>) => { Object.assign(values, patch); } };
  await saveSound('tick', null, storage);
  expect(await readSounds(storage)).toEqual({ tick: null, end: 'harp' });
  await saveSound('end', null, storage);
  expect(await readSounds(storage)).toEqual({ tick: null, end: null });
});
