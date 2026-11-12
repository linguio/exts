/** 生成本地连续噪声；归一化响度与峰值，末尾交叉过渡供无缝循环使用。 */
export function createNoiseSamples(kind: 'pink' | 'brown', sampleRate: number): Float32Array<ArrayBuffer> {
  const samples = new Float32Array(sampleRate * 8);
  let brown = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let energy = 0;
  let peak = 0;
  for (let index = 0; index < samples.length; index++) {
    const white = Math.random() * 2 - 1;
    let value: number;
    if (kind === 'brown') {
      brown = (brown + 0.02 * white) / 1.02;
      value = brown;
    } else {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      value = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
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
