import { Activity, DayOffset, DayInfo } from '../types';

const STORAGE_KEY = 'dimo_activities_data_v2';

export const EMPTY_ACTIVITIES_BY_DAY: Record<DayOffset, Activity[]> = {
  [-1]: [],
  [0]: [],
  [1]: [],
};

// Calculate real dynamic dates for any day offset (-1 = ontem, 0 = hoje, 1 = amanhã, etc.)
export function getDynamicDayInfo(offset: DayOffset): DayInfo {
  const d = new Date();
  d.setDate(d.getDate() + offset);

  // Capitalize weekday e.g. "Domingo", "Segunda-feira"
  const rawDayOfWeek = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayOfWeek = rawDayOfWeek.charAt(0).toUpperCase() + rawDayOfWeek.slice(1);

  const dayNum = String(d.getDate()).padStart(2, '0');
  const fullMonth = d.toLocaleDateString('pt-BR', { month: 'long' });
  const monthCap = fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1);

  let prefix = '';
  let shortLabel = dayOfWeek;
  if (offset === 0) {
    prefix = 'Hoje // ';
    shortLabel = 'Hoje';
  } else if (offset === -1) {
    prefix = 'Ontem // ';
    shortLabel = 'Ontem';
  } else if (offset === 1) {
    prefix = 'Amanhã // ';
    shortLabel = 'Amanhã';
  }

  const label = `${prefix}${dayOfWeek}, ${dayNum} de ${fullMonth}`;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const isoKey = `${yyyy}-${mm}-${dd}`;

  return {
    offset,
    dateKey: isoKey,
    label,
    shortLabel,
    dateFormatted: `${dayNum} de ${monthCap}`,
  };
}

// Load activities from localStorage (supports any numeric day offset)
export function loadSavedActivities(): Record<DayOffset, Activity[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { [-1]: [], [0]: [], [1]: [] };
    }
    const parsed = JSON.parse(raw);
    const result: Record<DayOffset, Activity[]> = {};
    for (const key of Object.keys(parsed)) {
      const numKey = Number(key);
      if (!isNaN(numKey) && Array.isArray(parsed[key])) {
        result[numKey] = parsed[key];
      }
    }
    if (!result[0]) result[0] = [];
    return result;
  } catch (err) {
    console.error('Failed to load activities from storage:', err);
    return { [0]: [] };
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
