import React from 'react';
import { Activity } from '../types';
import { Check, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  nextActivityId?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
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

  // Helper to match activities to nearest hour slot or check if start time starts with that hour
  const getActivitiesForHour = (hourPrefix: string) => {
    const hourNumber = parseInt(hourPrefix.split(':')[0], 10);
    return activities.filter((act) => {
      const actHour = parseInt(act.startTime.split(':')[0], 10);
      return actHour === hourNumber;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <div className="p-4 sm:p-6 rounded-2xl bg-[#13161D] border border-[#252A33]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#252A33] text-xs font-mono text-[#8B919E]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-semibold">GRADE DIÁRIA // CRONOGRAMA</span>
          </div>
          <span>SLOTS DE 60 MIN</span>
        </div>

        <div className="space-y-4">
          {hours.map((hour) => {
            const slotActivities = getActivitiesForHour(hour);

            return (
              <div key={hour} className="flex items-start gap-4 group">
                {/* Time column */}
                <div className="w-14 sm:w-16 shrink-0 pt-1 text-xs font-mono text-[#8B919E] group-hover:text-white transition-colors">
                  {hour}
                </div>

                {/* Content / Slots */}
                <div className="flex-1 min-h-[44px] pb-3 border-b border-[#252A33]/50">
                  {slotActivities.length > 0 ? (
                    <div className="space-y-2">
                      {slotActivities.map((act) => {
                        const isCompleted = act.completed;
                        const isNext = act.id === nextActivityId && !isCompleted;

                        return (
                          <motion.div
                            key={act.id}
                            layout
                            onClick={() => onOpenDetail(act)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isNext
                                ? 'bg-[#181C26] border-emerald-500/80 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                                : isCompleted
                                ? 'bg-[#13161D] border-[#252A33] opacity-75'
                                : 'bg-[#181C26]/70 border-[#252A33] hover:border-[#3B4252]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(act.id);
                                }}
                                className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-black'
                                    : isNext
                                    ? 'border-2 border-emerald-400 text-emerald-400'
                                    : 'border border-[#3B4252] text-transparent hover:border-neutral-300'
                                }`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                                    {act.startTime}
                                  </span>
                                  <span
                                    className={`text-sm font-medium truncate ${
                                      isCompleted
                                        ? 'line-through text-[#6F7684]'
                                        : 'text-white'
                                    }`}
                                  >
                                    {act.title}
                                  </span>
                                </div>
                                {act.description && (
                                  <p className="text-xs text-[#8B919E] truncate mt-0.5 max-w-md">
                                    {act.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {isNext && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  EM ANDAMENTO
                                </span>
                              )}
                              {act.duration && (
                                <span className="text-[11px] font-mono text-[#8B919E] hidden sm:inline">
                                  {act.duration}
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-[#6F7684]" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-4 border-l border-dashed border-[#252A33] ml-2" />
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
