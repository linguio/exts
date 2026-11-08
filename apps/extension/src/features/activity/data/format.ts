function activityHours(minutes: number) {
  return String(Number((minutes / 60).toFixed(1)));
}

export function formatActivityDuration(minutes: number) {
  return `${activityHours(minutes)}h`;
}

export function formatActivityProgress(minutes: number, percent: number, goal?: number) {
  return `${Math.round(percent)}% / ${formatActivityDuration(goal ?? minutes)}`;
}
