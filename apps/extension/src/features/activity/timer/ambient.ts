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
