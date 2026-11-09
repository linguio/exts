function formatHourAmount(hours: number) {
  return String(Number(hours.toFixed(1)));
}

export function formatActivityDuration(hours: number) {
  return `${formatHourAmount(hours)}h`;
}

export function formatActivityProgress(hours: number, percent: number, goal?: number) {
  return `${Math.round(percent)}% / ${formatActivityDuration(goal ?? hours)}`;
}
