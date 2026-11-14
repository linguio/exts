export const tickSounds = [
  { value: 'metronome', label: 'Metronome' },
  { value: 'brown', label: 'Brown Noise' },
] as const;
export const endSounds = [
  { value: 'harp', label: 'Harp' },
  { value: 'glass', label: 'Glass Chime' },
] as const;
export type TickSound = typeof tickSounds[number]['value'];
export type EndSound = typeof endSounds[number]['value'];
export type TimerSounds = { tick: TickSound | null; end: EndSound | null };
export const defaultSounds: TimerSounds = { tick: 'metronome', end: 'harp' };
export const soundKeys = { tick: 'timer.tickSound', end: 'timer.completionSound' } as const;
let writeTail: Promise<void> = Promise.resolve();

/** 分开保存两类偏好，避免修改一类时覆盖另一类或账号数据。 */
export async function readSounds(storage: Pick<chrome.storage.StorageArea, 'get'> = chrome.storage.local): Promise<TimerSounds> {
  const values = await storage.get(Object.values(soundKeys));
  return {
    tick: values[soundKeys.tick] === null ? null : tickSounds.find(item => item.value === values[soundKeys.tick])?.value ?? defaultSounds.tick,
    end: values[soundKeys.end] === null ? null : endSounds.find(item => item.value === values[soundKeys.end])?.value ?? defaultSounds.end,
  };
}

export function saveSound<K extends keyof TimerSounds>(group: K, value: TimerSounds[K], storage: Pick<chrome.storage.StorageArea, 'set'> = chrome.storage.local): Promise<void> {
  const write = writeTail.catch(() => {}).then(() => storage.set({ [soundKeys[group]]: value }));
  writeTail = write;
  return write;
}
