import { AudioPlayer } from '../../../lib/audio/player';
import { defaultSounds, type TimerSounds } from './sound-preference';

/** 单卡片音频调度：试听优先，不改变倒计时；所有音源在同一上下文管理。 */
export class TimerAudio {
  private audio = new AudioPlayer();
  private get context() { return this.audio.context; }
  private nextTick = 0;
  private alternate = false;
  private running = false;
  private previewing = false;
  private sequence = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private sounds: TimerSounds = { ...defaultSounds };

  setSounds(sounds: TimerSounds) {
    const changed = this.sounds.tick !== sounds.tick || this.sounds.end !== sounds.end;
    this.sounds = sounds;
    if (changed) this.stopSounds();
  }

  prepare() { this.audio.prepare(); }

  private stopSounds() {
    this.sequence++;
    clearTimeout(this.timeout);
    this.previewing = false;
    this.audio.stop();
  }

  private tick(time: number, index: number) {
    const odd = index % 2;
    if (this.sounds.tick === 'metronome') {
      this.audio.schedule(odd ? 'metronome-low' : 'metronome-high', time);
    }
  }

  private isAmbient() { return this.sounds.tick === 'brown'; }

  private playBackground(duration?: number) {
    if (this.isAmbient() && this.context?.state === 'running') this.audio.playNoiseLoop(duration);
  }

  private ending(time: number) {
    return this.sounds.end === null ? 0 : this.audio.schedule(this.sounds.end, time);
  }

  start() {
    this.stopSounds();
    this.prepare();
    this.running = true;
    if (this.context) this.nextTick = this.context.currentTime + 1;
  }

  schedule() {
    const context = this.context;
    if (!this.running || this.previewing || this.sounds.tick === null || !context || context.state !== 'running') return;
    if (this.isAmbient()) { this.playBackground(); return; }
    if (this.nextTick < context.currentTime - 0.15) this.nextTick = context.currentTime + 0.02;
    if (this.nextTick > context.currentTime + 0.15) return;
    this.tick(this.nextTick, this.alternate ? 1 : 0);
    this.alternate = !this.alternate;
    this.nextTick += 1;
  }

  preview(group: keyof TimerSounds) {
    this.stopSounds();
    if (this.sounds[group] === null) return;
    this.prepare();
    const context = this.context;
    if (!context) return;
    this.previewing = true;
    const sequence = this.sequence;
    void context.resume().then(() => {
      if (sequence !== this.sequence || context !== this.context) return;
      const start = context.currentTime + 0.02;
      let duration = 2.3;
      if (group === 'tick') {
        if (this.isAmbient()) { duration = 3; this.playBackground(duration); }
        else for (let index = 0; index < 3; index++) this.tick(start + index, index);
      } else duration = this.ending(start);
      this.timeout = setTimeout(() => {
        if (sequence !== this.sequence) return;
        this.stopSounds();
        if (this.running) { this.nextTick = context.currentTime + 1; this.schedule(); }
        else this.dispose();
      }, (duration + 0.1) * 1000);
    }).catch(error => {
      if (sequence !== this.sequence) return;
      this.previewing = false;
      console.error('声音试听启动失败', error);
    });
  }

  finish() {
    this.running = false;
    this.stopSounds();
    if (!this.context || this.context.state !== 'running') { this.dispose(); return; }
    const duration = this.ending(this.context.currentTime + 0.02);
    this.timeout = setTimeout(() => this.dispose(), (duration + 0.1) * 1000);
  }

  dispose() {
    this.running = false;
    this.stopSounds();
    this.nextTick = 0;
    this.audio.dispose();
  }
}
