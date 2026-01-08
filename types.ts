export enum AppStatus {
  INACTIVE = 'INACTIVE', // Before day starts
  PAUSED = 'PAUSED',     // Day started, not focusing
  FOCUS = 'FOCUS',       // Currently working
  TAGGING = 'TAGGING',   // Just stopped, selecting reason
  REVIEWING = 'REVIEWING' // End of day review
}

export enum TagType {
  REST = 'REST',
  BLOCKED = 'BLOCKED',
  DISTRACTION = 'DISTRACTION',
  DONE = 'DONE',
  WORK = 'WORK' // Default fallback
}

export interface DayLog {
  id?: number;
  date: string; // ISO Date string YYYY-MM-DD
  startTime: number;
  endTime?: number;
  inputRating?: number; // 1-10
  outputRating?: number; // 1-10
}

export interface Session {
  id?: number;
  dayId: number;
  startTime: number;
  endTime: number;
  duration: number; // in milliseconds
  tag: TagType;
}

export interface AppState {
  status: AppStatus;
  currentDayId: number | null;
  currentSessionStart: number | null;
  pendingSessionEnd: number | null;
}
