import { Activity, DayOffset, DayInfo } from '../types';
import { getDynamicDayInfo } from '../utils/storage';

export const getDayInfo = (offset: DayOffset): DayInfo => {
  return getDynamicDayInfo(offset);
};

export const INITIAL_DAYS_INFO: Record<DayOffset, DayInfo> = {
  [-1]: getDynamicDayInfo(-1),
  [0]: getDynamicDayInfo(0),
  [1]: getDynamicDayInfo(1),
};

// Initial default is 100% EMPTY - user creates real activities for their own day!
export const INITIAL_ACTIVITIES_BY_DAY: Record<DayOffset, Activity[]> = {
  [-1]: [],
  [0]: [],
  [1]: [],
};

// Optional sample routine available ONLY if the user explicitly wants to preview
export const DEMO_SAMPLE_ACTIVITIES: Record<DayOffset, Activity[]> = {
  [-1]: [
    {
      id: 'ontem-1',
      title: 'Café',
      startTime: '08:00',
      endTime: '08:45',
      duration: '45 min',
      completed: true,
      completedAt: '08:42',
      description: 'Revisão da semana, preparo do café filtrado e organização das metas críticas.',
      category: 'Rotina',
    },
    {
      id: 'ontem-2',
      title: 'Trabalho',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3h 00min',
      completed: true,
      completedAt: '11:58',
      description: 'Refatoração da camada de dados e estruturação dos componentes reativos.',
      category: 'Foco Profissional',
    },
    {
      id: 'ontem-3',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      duration: '1h 00min',
      completed: true,
      completedAt: '12:55',
      description: 'Pausa nutritiva sem telas. Caminhada de 20 minutos sob luz solar direta.',
      category: 'Recuperação',
    },
    {
      id: 'ontem-4',
      title: 'Treino',
      startTime: '18:30',
      endTime: '19:45',
      duration: '1h 15min',
      completed: true,
      completedAt: '19:40',
      description: 'Levantamento composto, agachamento búlgaro e liberação miofascial.',
      category: 'Saúde & Físico',
    },
    {
      id: 'ontem-5',
      title: 'Estudar',
      startTime: '20:00',
      endTime: '21:15',
      duration: '1h 15min',
      completed: true,
      completedAt: '21:10',
      description: 'Leitura de documentação sobre escalas ópticas e grid proporcional.',
      category: 'Desenvolvimento',
    },
  ],

  [0]: [
    {
      id: 'demo-1',
      title: 'Café',
      startTime: '08:00',
      endTime: '08:45',
      duration: '45 min',
      completed: true,
      completedAt: '08:44',
      description: 'Preparo do café filtrado, hidratação e alinhamento das prioridades cognitivas.',
      category: 'Rotina',
    },
    {
      id: 'demo-2',
      title: 'Trabalho',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3h 00min',
      completed: true,
      completedAt: '11:50',
      description: 'Sprint principal de foco profundo: arquitetura de software e implementação.',
      category: 'Foco Profissional',
    },
    {
      id: 'demo-3',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      duration: '1h 00min',
      completed: true,
      completedAt: '12:50',
      description: 'Pausa nutritiva completa e desconexão das telas para recuperação.',
      category: 'Recuperação',
    },
    {
      id: 'demo-4',
      title: 'Treino',
      startTime: '18:30',
      endTime: '19:45',
      duration: '1h 15min',
      completed: false,
      description: 'Treino funcional de força e resistência. Aceleração metabólica.',
      category: 'Saúde & Físico',
    },
    {
      id: 'demo-5',
      title: 'Estudar',
      startTime: '20:00',
      endTime: '21:15',
      duration: '1h 15min',
      completed: false,
      description: 'Leitura aprofundada, síntese de aprendizados técnicos e expansão de repertório.',
      category: 'Desenvolvimento',
    },
  ],

  [1]: [
    {
      id: 'amanha-1',
      title: 'Café',
      startTime: '08:00',
      endTime: '08:45',
      duration: '45 min',
      completed: false,
      description: 'Rotina matinal, hidratação e definição das prioridades do dia.',
      category: 'Rotina',
    },
    {
      id: 'amanha-2',
      title: 'Trabalho',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3h 00min',
      completed: false,
      description: 'Revisão final de integrações, execução da bateria de testes e entrega.',
      category: 'Foco Profissional',
    },
  ],
};
