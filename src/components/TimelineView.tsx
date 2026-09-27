import React, { useEffect, useRef, useCallback } from 'react';
import { Activity } from '../types';
import { Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  onNewActivity: (suggestedTitle?: string, suggestedTime?: string) => void;
  nextActivityId?: string;
  isToday?: boolean;
  currentOffset?: number;
  centerKey?: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  onNewActivity,
  nextActivityId,
  isToday = false,
  currentOffset = 0,
  centerKey = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentHourRef = useRef<HTMLDivElement | null>(null);
  const currentHour = new Date().getHours();

  // Scroll internally to current hour without moving window or header
  const scrollToCurrentHour = useCallback((smooth: boolean = true) => {
    const container = containerRef.current;
    const target = currentHourRef.current;
    if (container && target) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      const targetHeight = targetRect.height || 48;
      const containerHeight = container.clientHeight;

      const scrollToY = Math.max(
        0,
        relativeTop - (containerHeight / 2) + (targetHeight / 2)
      );

      container.scrollTo({
        top: scrollToY,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // Center on current hour when viewing Today, on mount, or when user taps "Hoje"
  useEffect(() => {
    if (isToday) {
      const timer = setTimeout(() => {
        scrollToCurrentHour(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isToday, centerKey, scrollToCurrentHour]);

  // Reset scroll to top of the 24-hour day when viewing another day
  useEffect(() => {
    if (!isToday && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [isToday, currentOffset]);

  // Hours 0 through 23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Group activities by starting hour
  const getActivitiesForHour = (h: number): Activity[] => {
    return activities
      .filter((a) => {
        const actHour = parseInt(a.startTime.split(':')[0], 10);
        return actHour === h;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain select-none pb-28 pt-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4">
        {/* 24-Hour Vertical Continuous Journey */}
        <div className="relative py-3">
        {/* Continuous central spine line */}
        <div
          className="absolute left-[3.25rem] sm:left-[3.75rem] top-6 bottom-6 w-[2px] bg-[#C4C0AB] pointer-events-none"
          aria-hidden="true"
        />

        {hours.map((hour, index) => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`;
          const hourActivities = getActivitiesForHour(hour);
          const hasActivities = hourActivities.length > 0;
          const isCurrentHour = isToday && hour === currentHour;

          // Check if any activity in this hour is next or completed
          const hasNextActivity = hourActivities.some(
            (a) => a.id === nextActivityId && !a.completed
          );
          const allCompletedInHour =
            hasActivities && hourActivities.every((a) => a.completed);
          const someCompleted =
            hasActivities && hourActivities.some((a) => a.completed);

          return (
            <div
              key={hour}
              ref={isCurrentHour ? currentHourRef : undefined}
              className={`relative flex items-start gap-2.5 sm:gap-3 py-1.5 sm:py-2 transition-colors rounded-xl ${
                isCurrentHour ? 'bg-[#C4C0AB]/25' : ''
              }`}
            >
              {/* 1. Left Time Label (discreet, monospace, structural reference) */}
              <div
                onClick={() => !hasActivities && onNewActivity(undefined, hourStr)}
                className={`w-11 sm:w-13 shrink-0 pt-1 text-right font-mono text-[11px] sm:text-xs transition-colors cursor-pointer select-none ${
                  isCurrentHour
                    ? 'text-[#141410] font-bold'
                    : 'text-[#777567] hover:text-[#33312B]'
                }`}
                title={`Criar atividade às ${hourStr}`}
              >
                <span>{hourStr}</span>
                {isCurrentHour && (
                  <span className="block text-[9px] tracking-wider text-[#141410] font-bold uppercase leading-none mt-0.5">
                    AGORA
                  </span>
                )}
              </div>

              {/* 2. Center Node / Bolinha (24 points along the spine) */}
              <div className="relative z-10 flex items-center justify-center shrink-0 w-6 pt-1">
                {hasActivities ? (
                  /* Active Hour Node */
                  <button
                    onClick={() => {
                      if (hourActivities.length === 1) {
                        onOpenDetail(hourActivities[0]);
                      }
                    }}
                    className={`rounded-full transition-all flex items-center justify-center cursor-pointer ${
                      allCompletedInHour
                        ? 'w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#141410] border border-[#141410] text-[#EDE8D0] shadow-[0_2px_8px_rgba(20,20,16,0.25)]'
                        : hasNextActivity
                        ? 'w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#FAF8F0] border-2 border-[#141410] text-[#141410] ring-4 ring-[#C4C0AB] shadow-[0_2px_10px_rgba(20,20,16,0.12)]'
                        : someCompleted
                        ? 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#545248] border border-[#33312B] text-[#EDE8D0]'
                        : 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#FAF8F0] border-2 border-[#777567] hover:border-[#141410]'
                    }`}
                    title={`${hourActivities.length} atividade(s) às ${hourStr}`}
                  >
                    {allCompletedInHour ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : hasNextActivity ? (
                      <span className="w-2 h-2 rounded-full bg-[#141410] animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    )}
                  </button>
                ) : (
                  /* Empty Hour Node (hollow circle ○, interactive) */
                  <button
                    onClick={() => onNewActivity(undefined, hourStr)}
                    title={`Adicionar atividade às ${hourStr}`}
                    className={`w-3.5 h-3.5 rounded-full border bg-[#EDE8D0] transition-all hover:scale-125 active:scale-95 cursor-pointer group flex items-center justify-center ${
                      isCurrentHour
                        ? 'border-[#141410] bg-[#C4C0AB] ring-2 ring-[#33312B]/20'
                        : 'border-[#9D9988] hover:border-[#141410] hover:bg-[#C4C0AB]'
                    }`}
                    aria-label={`Adicionar atividade às ${hourStr}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#141410] transition-colors" />
                  </button>
                )}
              </div>

              {/* 3. Right Content Area (Activity cards or interactive empty slot) */}
              <div className="flex-1 min-w-0 min-h-[36px] sm:min-h-[40px] flex flex-col justify-center">
                {hasActivities ? (
                  /* Stack of activities in this hour */
                  <div className="space-y-2 w-full">
                    {hourActivities.map((act) => {
                      const isCompleted = act.completed;
                      const isNext = act.id === nextActivityId && !isCompleted;

                      return (
                        <motion.div
                          key={act.id}
                          layout
                          onClick={() => onOpenDetail(act)}
                          className={`group w-full p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                            isCompleted
                              ? 'bg-[#FAF8F0]/70 border-[#C4C0AB] text-[#777567] hover:border-[#9D9988]'
                              : isNext
                              ? 'bg-[#FAF8F0] border-2 border-[#141410] shadow-[0_4px_16px_rgba(20,20,16,0.08)] ring-1 ring-[#141410]/20 text-[#141410]'
                              : 'bg-[#FAF8F0] border border-[#C4C0AB] hover:border-[#9D9988] hover:bg-white text-[#33312B] shadow-[0_2px_6px_rgba(20,20,16,0.03)]'
                          }`}
                        >
                          {/* Left: Check toggle + Title + Time */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(act.id, e);
                              }}
                              title={
                                isCompleted
                                  ? 'Reabrir atividade'
                                  : 'Concluir atividade'
                              }
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                isCompleted
                                  ? 'bg-[#141410] text-[#EDE8D0] shadow-[0_2px_6px_rgba(20,20,16,0.2)]'
                                  : isNext
                                  ? 'border-2 border-[#141410] text-[#141410] bg-[#C4C0AB]/40 hover:bg-[#141410] hover:text-[#EDE8D0]'
                                  : 'border border-[#9D9988] text-transparent hover:border-[#141410] hover:text-[#141410]'
                              }`}
                              aria-label={
                                isCompleted
                                  ? 'Marcar como não concluída'
                                  : 'Marcar como concluída'
                              }
                            >
                              {isCompleted && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </button>

                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isCompleted
                                    ? 'line-through text-[#777567]'
                                    : isNext
                                    ? 'text-[#141410] font-bold'
                                    : 'text-[#33312B]'
                                }`}
                              >
                                {act.title}
                              </span>

                              {isNext && (
                                <span className="hidden xs:inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141410] text-[#EDE8D0] border border-[#141410] font-bold shrink-0">
                                  FOCO
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Exact Time & Duration */}
                          <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono">
                            <span
                              className={`${
                                isNext
                                  ? 'text-[#141410] font-bold'
                                  : isCompleted
                                  ? 'text-[#777567]'
                                  : 'text-[#545248]'
                              }`}
                            >
                              {act.startTime}
                              {act.endTime ? ` – ${act.endTime}` : ''}
                            </span>

                            {act.category && (
                              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#EDE8D0] text-[#545248] border border-[#C4C0AB]">
                                {act.category}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty Hour Slot: clean, subtle, click to add */
                  <div
                    onClick={() => onNewActivity(undefined, hourStr)}
                    className="w-full py-1.5 px-2 rounded-lg hover:bg-[#C4C0AB]/30 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <span className="text-[11px] font-mono text-transparent group-hover:text-[#777567] transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3 text-[#545248]" />
                      <span>Adicionar às {hourStr}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#9D9988] group-hover:text-[#141410] transition-colors">
                      +
                    </span>
                  </div>
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
