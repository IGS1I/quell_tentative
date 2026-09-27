export type PomodoroState = 'WORK' | 'BREAK';

export interface PomodoroSession {
  id: number;
  workGroupId: number;
  startedAt: string;
  state: PomodoroState;
  workMinutes: number;
  breakMinutes: number;
}

export interface PomodoroStart {
  workGroupId: number;
  workMinutes: number;
  breakMinutes: number;
}
