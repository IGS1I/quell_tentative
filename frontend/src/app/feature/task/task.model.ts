export interface CompletableItem {
  label: string;
  done: boolean;
}

export interface Task {
  uuid?: string;
  timestampCreated?: string;
  workGroupId: number;
  taskTitle: string;
  taskDetails?: string;
  completableItems: CompletableItem[];
  pomodoroMinutes: number;
  breakMinutes: number;
  isActive?: boolean;
  isCompleted?: boolean;
  completedAt?: string;
  /** Higher number = higher priority. */
  priority: number;
}
