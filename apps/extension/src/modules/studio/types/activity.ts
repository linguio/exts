export type ActivityRecords = Readonly<Record<string, number>>;

export interface ActivityDay {
  date: string;
  label: string;
  weekday: number;
  minutes: number;
  level: 0 | 1 | 2 | 3;
  isFuture: boolean;
}
