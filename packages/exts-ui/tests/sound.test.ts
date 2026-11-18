import { expect, it, vi } from 'vitest';
import { NotificationSounds } from '../src/plus/toast/sound';

function setup() {
  let time = 0;
  const player = { play: vi.fn(() => true), stop: vi.fn(), preview: vi.fn(), dispose: vi.fn() };
  const sounds = new NotificationSounds(player, () => time);
  return { player, sounds, advance: (ms: number) => { time += ms; } };
}
it('默认关闭，只有启用后的新错误发声，不重放旧通知', () => {
  const { sounds, player } = setup();
  sounds.observe([{ id: 1, type: 'error' }]);
  sounds.setEnabled(true);
  sounds.observe([{ id: 1, type: 'error' }, { id: 2, type: 'success' }, { id: 3, type: 'warning' }, { id: 5, type: 'info' }, { id: 6, type: 'default' }, { id: 7, type: 'loading' }]);
  expect(player.play).not.toHaveBeenCalled();
  sounds.observe([{ id: 4, type: 'error' }]);
  expect(player.play).toHaveBeenCalledTimes(1);
});
it('首条立即播放，1秒内不排队，同一错误更新不重复响，Loading失败只响一次', () => {
  const { sounds, player, advance } = setup();
  sounds.setEnabled(true);
  sounds.observe([{ id: 1, type: 'error' }]);
  advance(300);
  sounds.observe([{ id: 1, type: 'error' }, { id: 2, type: 'error' }]);
  advance(700);
  sounds.observe([{ id: 1, type: 'error' }, { id: 2, type: 'error' }, { id: 3, type: 'loading' }]);
  expect(player.play).toHaveBeenCalledTimes(1);
  sounds.observe([{ id: 1, type: 'error' }, { id: 2, type: 'error' }, { id: 3, type: 'error' }]);
  expect(player.play).toHaveBeenCalledTimes(2);
});
it('关闭立即停止通知音但仍可试听，播放受阻不补播', () => {
  const { sounds, player, advance } = setup();
  sounds.setEnabled(true);
  player.play.mockReturnValue(false);
  sounds.observe([{ id: 1, type: 'error' }]);
  advance(2000);
  player.play.mockReturnValue(true);
  sounds.observe([{ id: 1, type: 'error' }]);
  expect(player.play).toHaveBeenCalledTimes(1);
  sounds.setEnabled(false);
  expect(player.stop).toHaveBeenCalledTimes(1);
  sounds.preview();
  expect(player.preview).toHaveBeenCalledTimes(1);
});

it('宿主恢复时标记已有错误，释放资源后不会重播恢复前通知', () => {
  const { sounds, player } = setup();
  sounds.setEnabled(true);
  sounds.observe([{ id: 1, type: 'error' }]);
  sounds.dispose();
  expect(player.dispose).toHaveBeenCalledTimes(1);
  sounds.seed([{ id: 1, type: 'error' }]);
  sounds.setEnabled(true);
  sounds.observe([{ id: 1, type: 'error' }]);
  expect(player.play).toHaveBeenCalledTimes(1);
  sounds.observe([{ id: 2, type: 'error' }]);
  expect(player.play).toHaveBeenCalledTimes(2);
});
