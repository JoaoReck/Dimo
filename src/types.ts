export interface Activity {
  id: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime?: string;   // "HH:MM"
  completed: boolean;
  completedAt?: string;
  description?: string;
  duration?: string;  // e.g. "45 min", "1h 30min"
  category?: string;
}

export type ViewMode = 'timeline' | 'checklist' | 'calendar';

export type DayOffset = -1 | 0 | 1;

export interface DayInfo {
  offset: DayOffset;
  dateKey: string;
  label: string; // e.g. "HOJE // QUINTA, 24 OUT"
  shortLabel: string; // "Ontem", "Hoje", "Amanhã"
  dateFormatted: string; // "24 de Outubro, 2026"
}
