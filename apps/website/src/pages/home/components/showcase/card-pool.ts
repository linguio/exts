export function getNextCardHead(count: number, head: number, selected: number | null = null): number {
  if (count <= 1) return 0;
  const next = (head + 1) % count;
  if (selected === null) return next;
  const currentWindow = getVisibleCardIndices(count, head, selected);
  const nextWindow = getVisibleCardIndices(count, next);
  // 手动置前可能已经显示自动下一组，跳过同一组合，避免首个周期看似停顿。
  return currentWindow.every((index, position) => index === nextWindow[position]) ? (next + 1) % count : next;
}

export function getVisibleCardIndices(count: number, head: number, selected: number | null = null): number[] {
  const window = Array.from({ length: Math.min(3, count) }, (_, offset) => (head + offset) % count);
  if (selected === null || !window.includes(selected)) return window;
  return [selected, ...window.filter((index) => index !== selected)];
}
