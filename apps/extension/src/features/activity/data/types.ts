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

/** Daily 列使用现有接口的业务字段；未填写与明确为零保持区分。 */
export interface DailyActivityRow {
  id: string;
  userId: string;
  date: string;
  exerciseMinutes: number | null;
  readingMinutes: number | null;
  learningMinutes: number | null;
  creationMinutes: number | null;
  sleepMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}
