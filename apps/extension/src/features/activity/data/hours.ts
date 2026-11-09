/** Activity 小时字段校验：非负且为 0.5 的倍数。 */
export function isActivityHourValue(value: number): boolean {
  if (!Number.isFinite(value) || value < 0) return false;
  const doubled = value * 2;
  return Math.abs(doubled - Math.round(doubled)) < 1e-9;
}
