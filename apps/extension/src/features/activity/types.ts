export type GrowthKey = 'exercise' | 'reading' | 'learning' | 'creation';
export type GrowthMinutes = Partial<Record<GrowthKey, number>>;
export interface ActivityRecord {
  growth?: GrowthMinutes;
  sleepMinutes?: number;
}
export type ActivityRecords = Readonly<Record<string, ActivityRecord>>;

export interface ActivityDay {
  date: string;
  label: string;
  weekday: number;
  minutes: number;
  growth: GrowthMinutes;
  level: 0 | 1 | 2 | 3 | 4;
  isFuture: boolean;
}
