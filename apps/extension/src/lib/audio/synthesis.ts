/** 生成本地连续噪声；归一化响度与峰值，末尾交叉过渡供无缝循环使用。 */
export function createNoiseSamples(sampleRate: number): Float32Array<ArrayBuffer> {
  const samples = new Float32Array(sampleRate * 8);
  let brown = 0;
  let energy = 0;
  let peak = 0;
  for (let index = 0; index < samples.length; index++) {
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.02 * white) / 1.02;
    const value = brown;
    samples[index] = value;
    energy += value * value;
    peak = Math.max(peak, Math.abs(value));
  }
  const scale = Math.min(0.18 / Math.max(0.0001, Math.sqrt(energy / samples.length)), 0.7 / Math.max(0.0001, peak));
  for (let index = 0; index < samples.length; index++) samples[index] = samples[index]! * scale;
  const fade = Math.round(sampleRate * 0.05);
  for (let index = 0; index < fade; index++) {
    const at = samples.length - fade + index;
    const mix = index / (fade - 1);
    samples[at] = samples[at]! * (1 - mix) + samples[index]! * mix;
  }
  return samples;
}

/** 创建带包络的音调；由播放器统一连接、启动和回收。 */
export function createTone(context: AudioContext, time: number, frequency: number, duration: number, level: number, type: OscillatorType = 'sine', end?: number) {
  const source = context.createOscillator();
  const gain = context.createGain();
  source.type = type;
  source.frequency.setValueAtTime(frequency, time);
  if (end) source.frequency.exponentialRampToValueAtTime(end, time + duration * 0.8);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(level, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  return { source, gain };
}
