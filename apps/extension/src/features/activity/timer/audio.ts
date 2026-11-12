import { createNoiseSamples } from './ambient';
import { defaultSounds, type TimerSounds } from './sound-preference';

/** 单卡片音频调度：试听优先，不改变倒计时；所有音源在同一上下文管理。 */
export class TimerAudio {
  private context: AudioContext | null = null;
  private output: GainNode | null = null;
  private sources = new Set<AudioScheduledSourceNode>();
  private background: AudioBufferSourceNode | null = null;
  private nextTick = 0;
  private alternate = false;
  private running = false;
  private previewing = false;
  private sequence = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private sounds: TimerSounds = { ...defaultSounds };

  setSounds(sounds: TimerSounds) {
    const changed = this.sounds.tick !== sounds.tick;
    this.sounds = sounds;
    if (changed) this.stopSounds();
  }

  prepare() {
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.output = this.context.createGain();
        this.output.gain.value = 0.35;
        this.output.connect(this.context.destination);
      }
      void this.context.resume().catch(error => console.error('倒计时声音启动失败', error));
    } catch (error) { console.error('倒计时声音不可用', error); }
  }

  private stopSounds() {
    this.sequence++;
    clearTimeout(this.timeout);
    this.previewing = false;
    for (const source of this.sources) source.stop();
    this.sources.clear();
    this.background = null;
  }

  private connect(source: AudioScheduledSourceNode, gain: GainNode, start: number, duration?: number) {
    source.connect(gain).connect(this.output!);
    this.sources.add(source);
    source.start(start);
    if (duration !== undefined) source.stop(start + duration);
    source.onended = () => { this.sources.delete(source); source.disconnect(); gain.disconnect(); };
  }

  private tone(time: number, frequency: number, duration: number, level: number, type: OscillatorType = 'sine', end?: number) {
    const context = this.context!;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    if (end) oscillator.frequency.exponentialRampToValueAtTime(end, time + duration * 0.8);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    this.connect(oscillator, gain, time, duration + 0.01);
  }

  private noise(time: number, duration: number, level: number, frequency: number) {
    const context = this.context!;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) samples[index] = (Math.random() * 2 - 1) * Math.exp(-index / samples.length * 8);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    gain.gain.value = level;
    source.connect(filter).connect(gain).connect(this.output!);
    this.sources.add(source);
    source.start(time);
    source.onended = () => { this.sources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }

  private tick(time: number, index: number) {
    const odd = index % 2;
    if (this.sounds.tick === 'quartz') {
      this.noise(time, 0.025, 0.38, odd ? 4400 : 5700);
      this.tone(time, odd ? 2300 : 2900, 0.018, 0.035);
    } else if (this.sounds.tick === 'metronome') {
      this.tone(time, odd ? 850 : 1150, 0.035, 0.22, 'triangle', 500);
      this.noise(time, 0.018, 0.22, 2600);
    }
  }

  private isAmbient() { return this.sounds.tick === 'pink' || this.sounds.tick === 'brown'; }

  private playBackground(duration?: number) {
    const context = this.context;
    const kind = this.sounds.tick;
    if (!context || this.background || (kind !== 'pink' && kind !== 'brown')) return;
    const buffer = context.createBuffer(2, context.sampleRate * 8, context.sampleRate);
    for (let channel = 0; channel < 2; channel++) buffer.copyToChannel(createNoiseSamples(kind, context.sampleRate), channel);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    // 末尾已过渡到首段；从50ms处回环以避开拼接跳变。
    source.loopStart = 0.05;
    source.loopEnd = 8;
    filter.type = 'lowpass';
    filter.Q.value = 0.5;
    filter.frequency.value = kind === 'brown' ? 1400 : 11000;
    const start = context.currentTime + 0.02;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(1, start + 0.08);
    if (duration !== undefined) {
      gain.gain.setValueAtTime(1, start + duration - 0.08);
      gain.gain.linearRampToValueAtTime(0, start + duration);
    }
    source.connect(filter).connect(gain).connect(this.output!);
    this.background = source;
    this.sources.add(source);
    source.start(start);
    if (duration !== undefined) source.stop(start + duration);
    source.onended = () => {
      this.sources.delete(source);
      if (this.background === source) this.background = null;
      source.disconnect(); filter.disconnect(); gain.disconnect();
    };
  }

  private ending(time: number) {
    if (this.sounds.end === 'glass') {
      [[1568, 0], [2093, 0.18], [2637, 0.36]].forEach(([frequency, delay]) => {
        this.tone(time + delay!, frequency!, 1.2, 0.14);
        this.tone(time + delay!, frequency! * 2.76, 0.55, 0.025);
      });
      return 1.9;
    }
    const harp = this.sounds.end === 'harp';
    (harp ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99]).forEach((frequency, index) => {
      const at = time + index * (harp ? 0.18 : 0.28);
      this.tone(at, frequency, harp ? 0.8 : 0.65, harp ? 0.16 : 0.18);
      this.tone(at, frequency * 2, harp ? 0.18 : 0.25, harp ? 0.04 : 0.03);
    });
    return 1.6;
  }

  start() {
    this.stopSounds();
    this.prepare();
    this.running = true;
    if (this.context) this.nextTick = this.context.currentTime + 1;
  }

  schedule() {
    const context = this.context;
    if (!this.running || this.previewing || !context || context.state !== 'running') return;
    if (this.isAmbient()) { this.playBackground(); return; }
    if (this.nextTick < context.currentTime - 0.15) this.nextTick = context.currentTime + 0.02;
    if (this.nextTick > context.currentTime + 0.15) return;
    this.tick(this.nextTick, this.alternate ? 1 : 0);
    this.alternate = !this.alternate;
    this.nextTick += 1;
  }

  preview(group: keyof TimerSounds) {
    this.stopSounds();
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
    const context = this.context;
    this.context = null;
    this.output = null;
    this.nextTick = 0;
    if (context && context.state !== 'closed') void context.close().catch(error => console.error('倒计时音频释放失败', error));
  }
}
