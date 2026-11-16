import { AudioPlayer, type AudioStatus } from './player';
import type { SoundPreset } from './presets';

type Notification = { id: string | number; type?: string };
type NotificationPlayer = Pick<AudioPlayer, 'play' | 'stop' | 'preview' | 'dispose'>;
/** 通知只映射错误音；Default 包含其余所有类型，不引入调用方声音参数。 */
export const notificationPresets: Record<string, SoundPreset | undefined> = { error: 'error' };
export class NotificationSounds {
  private enabled = false;
  private seen = new Set<string | number>();
  private lastAttempt = -Infinity;
  constructor(private player: NotificationPlayer, private now: () => number = () => performance.now()) {}
  seed(toasts: Notification[]) { for (const toast of toasts) if (toast.type === 'error') this.seen.add(toast.id); }
  setEnabled(enabled: boolean) {
    if (this.enabled && !enabled) this.player.stop();
    this.enabled = enabled;
  }
  observe(toasts: Notification[]) {
    if (toasts.length === 0) return;
    const current = new Set(toasts.map(toast => toast.id));
    this.seen = new Set([...this.seen].filter(id => current.has(id)));
    for (const toast of [...toasts].reverse()) {
      const preset = notificationPresets[toast.type ?? 'default'];
      if (!preset || this.seen.has(toast.id)) continue;
      this.seen.add(toast.id);
      const now = this.now();
      if (!this.enabled || now - this.lastAttempt < 1000) continue;
      this.lastAttempt = now;
      this.player.play(preset);
    }
  }
  preview() { this.player.preview('error'); }
  dispose() { this.enabled = false; this.seen.clear(); this.lastAttempt = -Infinity; this.player.dispose(); }
}
const player = new AudioPlayer();
export const notificationSounds = new NotificationSounds(player);
export const subscribeNotificationAudio = player.subscribe;
export const readNotificationAudioStatus: () => AudioStatus = player.getStatus;
