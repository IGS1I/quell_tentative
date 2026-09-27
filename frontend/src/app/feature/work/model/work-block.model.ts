export interface WorkBlock {
  id: number;
  groupName: string;
  groupDescription?: string;
  recurring: boolean;
  daysOfWeek: string[];
  createdAt?: string;
  startClockTime?: string;
  endClockTime?: string;
  endTime?: string;
  active: boolean;
}
