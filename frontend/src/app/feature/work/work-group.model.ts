export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export const DAYS_OF_WEEK: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export interface WorkGroup {
  id?: number;
  groupName: string;
  groupDescription?: string;
  recurring: boolean;
  daysOfWeek: DayOfWeek[];
  startClockTime: string;
  endClockTime: string;
  scheduledDate?: string | null;
  active?: boolean;
  createdAt?: string;
}
