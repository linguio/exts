export type ToastAudioStatus = 'idle' | 'ready' | 'paused' | 'unavailable';

/** 仅合成原有错误双音；每个展示宿主独立持有资源，不影响应用倒计时。 */
export class ToastAudioPlayer {
  private context: AudioContext | null = null;
  private output: GainNode | null = null;
  private sources = new Set<OscillatorNode>();
  private sequence = 0;
  private busyUntil = 0;
  private status: ToastAudioStatus = 'idle';
  private listeners = new Set<() => void>();
  getStatus = () => this.status;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private report(value: ToastAudioStatus) {
    if (this.status === value) return;
    this.status = value;
    this.listeners.forEach(listener => listener());
  }
  private prepare() {
    try {
      if (!this.context) {
        const context = new AudioContext();
        this.context = context;
        this.output = context.createGain();
        this.output.gain.value = 0.35;
        this.output.connect(context.destination);
        context.onstatechange = () => { if (this.context === context) this.report(context.state === 'running' ? 'ready' : 'paused'); };
      }
      const context = this.context;
      this.report(context.state === 'running' ? 'ready' : 'paused');
      void context.resume().catch(error => {
        if (this.context === context) { this.report('unavailable'); console.error('通知音频启动失败', error); }
      });
    } catch (error) { this.report('unavailable'); console.error('通知音频不可用', error); }
  }
  stop() {
    this.sequence++;
    for (const source of this.sources) source.stop();
    this.sources.clear();
    this.busyUntil = 0;
  }
  private schedule(context: AudioContext) {
    const start = context.currentTime + 0.02;
    for (const [frequency, delay, duration] of [[440, 0, 0.18], [330, 0.23, 0.22]] as const) {
      const time = start + delay;
      const source = context.createOscillator();
      const gain = context.createGain();
      source.type = 'sine';
      source.frequency.setValueAtTime(frequency, time);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.16, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      source.connect(gain).connect(this.output!);
      this.sources.add(source);
      source.start(time);
      source.stop(time + duration + 0.01);
      source.onended = () => { this.sources.delete(source); source.disconnect(); gain.disconnect(); };
    }
    this.busyUntil = context.currentTime + 0.57;
  }
  play(_preset: 'error') {
    this.prepare();
    const context = this.context;
    if (!context || context.state !== 'running' || context.currentTime < this.busyUntil) return false;
    this.schedule(context);
    return true;
  }
  preview(_preset: 'error') {
    this.stop();
    this.prepare();
    const context = this.context;
    if (!context) return;
    const sequence = this.sequence;
    const expires = Date.now() + 1000;
    void context.resume().then(() => {
      if (this.context !== context || sequence !== this.sequence || Date.now() > expires || context.state !== 'running') return;
      this.schedule(context);
    }).catch(error => { if (this.context === context) { this.report('unavailable'); console.error('通知音频试听失败', error); } });
  }
  dispose() {
    this.stop();
    const context = this.context;
    this.context = null;
    this.output = null;
    if (context) {
      context.onstatechange = null;
      if (context.state !== 'closed') void context.close().catch(error => console.error('通知音频释放失败', error));
    }
    this.report('idle');
  }
}
