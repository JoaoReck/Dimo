import { Activity, DayOffset, DayInfo } from '../types';

const STORAGE_KEY = 'dimo_activities_data_v2';

export const EMPTY_ACTIVITIES_BY_DAY: Record<DayOffset, Activity[]> = {
  [-1]: [],
  [0]: [],
  [1]: [],
};

// Calculate real dynamic dates for any day offset (-1 = ontem, 0 = hoje, 1 = amanhã)
export function getDynamicDayInfo(offset: DayOffset): DayInfo {
  const d = new Date();
  d.setDate(d.getDate() + offset);

  // e.g. "qui", "sex", "sáb"
  const rawDayOfWeek = d.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayOfWeek = rawDayOfWeek.replace('.', '').toUpperCase();

  const dayNum = String(d.getDate()).padStart(2, '0');
  const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  const fullMonth = d.toLocaleDateString('pt-BR', { month: 'long' });

  const labelPrefix = offset === 0 ? 'HOJE' : offset === -1 ? 'ONTEM' : 'AMANHÃ';
  const shortLabel = offset === 0 ? 'Hoje' : offset === -1 ? 'Ontem' : 'Amanhã';

  return {
    offset,
    dateKey: offset === 0 ? 'hoje' : offset === -1 ? 'ontem' : 'amanha',
    label: `${labelPrefix} // ${dayOfWeek}, ${dayNum} ${monthShort}`,
    shortLabel,
    dateFormatted: `${dayNum} de ${fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1)}`,
  };
}

// Load activities from localStorage
export function loadSavedActivities(): Record<DayOffset, Activity[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // New user or empty start: zero fake activities
      return { [-1]: [], [0]: [], [1]: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      [-1]: Array.isArray(parsed[-1]) ? parsed[-1] : [],
      [0]: Array.isArray(parsed[0]) ? parsed[0] : [],
      [1]: Array.isArray(parsed[1]) ? parsed[1] : [],
    };
  } catch (err) {
    console.error('Failed to load activities from storage:', err);
    return { [-1]: [], [0]: [], [1]: [] };
  }
}

// Save activities to localStorage
export function saveActivitiesToStorage(data: Record<DayOffset, Activity[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save activities to storage:', err);
  }
}
