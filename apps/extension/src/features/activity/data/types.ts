export type GrowthKey = 'exercise' | 'reading' | 'learning' | 'creation';
export type GrowthHours = Partial<Record<GrowthKey, number>>;
export interface ActivityRecord {
  growth?: GrowthHours;
  sleepHours?: number;
}
export type ActivityRecords = Readonly<Record<string, ActivityRecord>>;

export interface ActivityDay {
  date: string;
  label: string;
  weekday: number;
  hours: number;
  growth: GrowthHours;
  level: 0 | 1 | 2 | 3 | 4;
  isFuture: boolean;
}

/** Daily 列使用现有接口的业务字段；未填写与明确为零保持区分。 */
export interface DailyActivityRow {
  id: string;
  userId: string;
  date: string;
  exerciseHours: number | null;
  readingHours: number | null;
  learningHours: number | null;
  creationHours: number | null;
  sleepHours: number | null;
  createdAt: string;
  updatedAt: string;
}
