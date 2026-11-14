import { expect, it } from 'vitest';
import { createNoiseSamples } from '../../../../src/features/activity/timer/ambient';

it('棕噪声可生成持续音频，幅度受限且无非法样本', () => {
  const data = createNoiseSamples(8000);
  expect(data.length).toBe(8000 * 8);
  let finite = true;
  let energy = 0;
  let peak = 0;
  for (const value of data) {
    finite = finite && Number.isFinite(value);
    energy += value * value;
    peak = Math.max(peak, Math.abs(value));
  }
  expect(finite).toBe(true);
  expect(Math.sqrt(energy / data.length)).toBeGreaterThan(0.05);
  expect(Math.sqrt(energy / data.length)).toBeLessThanOrEqual(0.181);
  expect(peak).toBeLessThanOrEqual(0.701);
});
