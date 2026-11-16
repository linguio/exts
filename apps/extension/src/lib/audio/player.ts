import { createNoiseSamples, createTone } from './synthesis';
import { presets, type SoundPreset, type Tone } from './presets';

export type AudioStatus = 'idle' | 'ready' | 'paused' | 'unavailable';
/** 每个播放器独立持有音频资源，通知与倒计时互不停止对方。 */
export class AudioPlayer {
  context: AudioContext | null = null;
  private output: GainNode | null = null;
  private sources = new Set<AudioScheduledSourceNode>();
  private background: AudioBufferSourceNode | null = null;
  private status: AudioStatus = 'idle';
  private listeners = new Set<() => void>();
  private sequence = 0;
  private busyUntil = 0;
  getStatus = () => this.status;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private report(status: AudioStatus) {
    if (this.status === status) return;
    this.status = status;
    this.listeners.forEach(listener => listener());
  }
  prepare() {
    try {
      if (!this.context) {
        const context = new AudioContext();
        this.context = context;
        this.output = context.createGain();
        this.output.gain.value = 0.35;
        this.output.connect(context.destination);
        context.onstatechange = () => {
          if (this.context === context) this.report(context.state === 'running' ? 'ready' : 'paused');
        };
      }
      const context = this.context;
      this.report(context.state === 'running' ? 'ready' : 'paused');
      void context.resume().catch(error => {
        if (this.context !== context) return;
        this.report('unavailable');
        console.error('音频启动失败', error);
      });
    } catch (error) { this.report('unavailable'); console.error('音频不可用', error); }
  }
  stop() {
    this.sequence++;
    for (const source of this.sources) source.stop();
    this.sources.clear();
    this.background = null;
    this.busyUntil = 0;
  }
  private connect(source: AudioScheduledSourceNode, gain: GainNode, start: number, duration?: number) {
    source.connect(gain).connect(this.output!);
    this.sources.add(source);
    source.start(start);
    if (duration !== undefined) source.stop(start + duration);
    source.onended = () => { this.sources.delete(source); source.disconnect(); gain.disconnect(); };
  }


  tone(time: number, frequency: number, duration: number, level: number, type: OscillatorType = 'sine', end?: number) {
    const { source, gain } = createTone(this.context!, time, frequency, duration, level, type, end);
    this.connect(source, gain, time, duration + 0.01);
  }
  noise(time: number, duration: number, level: number, frequency: number) {
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


  playNoiseLoop(duration?: number) {
    const context = this.context;
    if (!context || this.background) return;
    const buffer = context.createBuffer(2, context.sampleRate * 8, context.sampleRate);
    for (let channel = 0; channel < 2; channel++) buffer.copyToChannel(createNoiseSamples(context.sampleRate), channel);
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
    filter.frequency.value = 1400;
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


  schedule(preset: SoundPreset, time: number) {
    const definition = presets[preset];
    for (const tone of definition.tones as Tone[]) this.tone(time + tone.delay, tone.frequency, tone.duration, tone.level, tone.type, tone.end);
    if (preset.startsWith('metronome-')) this.noise(time, 0.018, 0.22, 2600);
    return definition.duration;
  }
  play(preset: SoundPreset) {
    this.prepare();
    const context = this.context;
    if (!context || context.state !== 'running' || context.currentTime < this.busyUntil) return false;
    this.busyUntil = context.currentTime + this.schedule(preset, context.currentTime + 0.02) + 0.02;
    return true;
  }
  preview(preset: SoundPreset) {
    this.stop();
    this.prepare();
    const context = this.context;
    if (!context) return;
    const sequence = this.sequence;
    const expires = Date.now() + 1000;
    void context.resume().then(() => {
      if (this.context !== context || sequence !== this.sequence || Date.now() > expires || context.state !== 'running') return;
      this.busyUntil = context.currentTime + this.schedule(preset, context.currentTime + 0.02) + 0.02;
    }).catch(error => { if (this.context === context) { this.report('unavailable'); console.error('音频试听失败', error); } });
  }
  dispose() {
    this.stop();
    const context = this.context;
    this.context = null;
    this.output = null;
    if (context) {
      context.onstatechange = null;
      if (context.state !== 'closed') void context.close().catch(error => console.error('音频释放失败', error));
    }
    this.report('idle');
  }
}
