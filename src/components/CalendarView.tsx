import React from 'react';
import { Activity } from '../types';
import { Check, Clock, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  onNewActivity?: (time?: string) => void;
  nextActivityId?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  onNewActivity,
  nextActivityId,
}) => {
  // Common time markers for a day
  const hours = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
  ];

  const getActivitiesForHour = (hourPrefix: string) => {
    const hourNumber = parseInt(hourPrefix.split(':')[0], 10);
    return activities.filter((act) => {
      const actHour = parseInt(act.startTime.split(':')[0], 10);
      return actHour === hourNumber;
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-20">
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#13161D] border border-[#252A33]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A33] text-xs font-mono text-[#8B919E]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-semibold">GRADE DIÁRIA</span>
          </div>
          <span className="text-[11px]">TOQUE NO HORÁRIO PARA AGENDAR</span>
        </div>

        <div className="space-y-3">
          {hours.map((hour) => {
            const slotActivities = getActivitiesForHour(hour);

            return (
              <div key={hour} className="flex items-start gap-2.5 sm:gap-3 group">
                {/* Time column */}
                <button
                  type="button"
                  onClick={() => onNewActivity && onNewActivity(hour)}
                  className="w-12 sm:w-14 shrink-0 pt-1 text-xs font-mono text-[#8B919E] group-hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  title={`Criar atividade às ${hour}`}
                >
                  {hour}
                </button>

                {/* Content / Slots */}
                <div className="flex-1 min-h-[40px] pb-2 border-b border-[#252A33]/40 min-w-0">
                  {slotActivities.length > 0 ? (
                    <div className="space-y-1.5">
                      {slotActivities.map((act) => {
                        const isCompleted = act.completed;
                        const isNext = act.id === nextActivityId && !isCompleted;

                        return (
                          <motion.div
                            key={act.id}
                            layout
                            onClick={() => onOpenDetail(act)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isNext
                                ? 'bg-[#181C26] border-emerald-500/80 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                                : isCompleted
                                ? 'bg-[#13161D] border-[#252A33] opacity-75'
                                : 'bg-[#181C26]/70 border-[#252A33] hover:border-[#3B4252]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(act.id);
                                }}
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-black'
                                    : isNext
                                    ? 'border-2 border-emerald-400 text-emerald-400'
                                    : 'border border-[#3B4252] text-transparent hover:border-neutral-300'
                                }`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-mono text-xs text-emerald-400 font-semibold shrink-0">
                                    {act.startTime}
                                  </span>
                                  <span
                                    className={`text-xs sm:text-sm font-medium truncate ${
                                      isCompleted
                                        ? 'line-through text-[#6F7684]'
                                        : 'text-white'
                                    }`}
                                  >
                                    {act.title}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isNext && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  PRÓXIMO
                                </span>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 text-[#6F7684]" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      onClick={() => onNewActivity && onNewActivity(hour)}
                      className="w-full text-left py-1 text-[11px] font-mono text-[#6A7280]/40 group-hover:text-emerald-400/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        + Adicionar atividade às {hour}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
