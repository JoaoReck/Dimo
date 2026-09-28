export type RpgIconId =
  | 'sword'      // Treino, exercícios, desafio (inspirado no icone4/icone2)
  | 'potion'     // Café, elixir, hidratação, pausa revigorante
  | 'book'       // Estudo, leitura, grimório, aprendizado
  | 'scroll'     // Trabalho, projetos, contrato, planejamento
  | 'campfire'   // Descanso, relaxamento, meditação, sono
  | 'meat'       // Refeição, almoço, nutrição de herói
  | 'shield'     // Proteção, rotina essencial, finanças
  | 'torch'      // Início do dia, clareza, exploração, caminhada
  | 'chest'      // Reunião, compras, inventário, tarefas
  | 'gem';       // Foco profundo, marco crucial, conquista

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
  icon?: RpgIconId;
}

export type ViewMode = 'timeline' | 'checklist' | 'calendar';

export type DayOffset = number;

export interface DayInfo {
  offset: DayOffset;
  dateKey: string;
  label: string; // e.g. "HOJE // QUINTA, 24 OUT"
  shortLabel: string; // "Ontem", "Hoje", "Amanhã"
  dateFormatted: string; // "24 de Outubro, 2026"
}
