export type Tone = { frequency: number; delay: number; duration: number; level: number; type?: OscillatorType; end?: number };
const harp = [523.25, 659.25, 783.99, 1046.5].flatMap((frequency, index) => [
  { frequency, delay: index * 0.18, duration: 0.8, level: 0.16 },
  { frequency: frequency * 2, delay: index * 0.18, duration: 0.18, level: 0.04 },
]);
const glass = [[1568, 0], [2093, 0.18], [2637, 0.36]].flatMap(([frequency, delay]) => [
  { frequency: frequency!, delay: delay!, duration: 1.2, level: 0.14 },
  { frequency: frequency! * 2.76, delay: delay!, duration: 0.55, level: 0.025 },
]);
/** 这里只维护倒计时音色；通知错误音已归入 exts-ui 包。 */
export const presets = {
  harp: { duration: 1.6, tones: harp },
  glass: { duration: 1.9, tones: glass },
  'metronome-high': { duration: 0.05, tones: [{ frequency: 1150, delay: 0, duration: 0.035, level: 0.22, type: 'triangle', end: 500 }] },
  'metronome-low': { duration: 0.05, tones: [{ frequency: 850, delay: 0, duration: 0.035, level: 0.22, type: 'triangle', end: 500 }] },
} satisfies Record<string, { duration: number; tones: Tone[] }>;
export type SoundPreset = keyof typeof presets;
