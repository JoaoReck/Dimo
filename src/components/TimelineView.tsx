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
          className="absolute left-[3.25rem] sm:left-[3.75rem] top-6 bottom-6 w-[2px] bg-[#1F242E] pointer-events-none"
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
                isCurrentHour ? 'bg-emerald-500/[0.03]' : ''
              }`}
            >
              {/* 1. Left Time Label (discreet, monospace, structural reference) */}
              <div
                onClick={() => !hasActivities && onNewActivity(undefined, hourStr)}
                className={`w-11 sm:w-13 shrink-0 pt-1 text-right font-mono text-[11px] sm:text-xs transition-colors cursor-pointer select-none ${
                  isCurrentHour
                    ? 'text-emerald-400 font-bold'
                    : 'text-[#6F7684] hover:text-[#9EA4B0]'
                }`}
                title={`Criar atividade às ${hourStr}`}
              >
                <span>{hourStr}</span>
                {isCurrentHour && (
                  <span className="block text-[9px] tracking-wider text-emerald-400 font-bold uppercase leading-none mt-0.5">
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
                        ? 'w-5 h-5 sm:w-5.5 sm:h-5.5 bg-emerald-500 border border-emerald-400 text-[#0B0D12] shadow-[0_0_12px_rgba(34,197,94,0.45)]'
                        : hasNextActivity
                        ? 'w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#13161D] border-2 border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/25 shadow-[0_0_16px_rgba(34,197,94,0.35)]'
                        : someCompleted
                        ? 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-emerald-500/80 border border-emerald-400 text-[#0B0D12]'
                        : 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#13161D] border-2 border-[#4A5263] hover:border-emerald-400'
                    }`}
                    title={`${hourActivities.length} atividade(s) às ${hourStr}`}
                  >
                    {allCompletedInHour ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : hasNextActivity ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    )}
                  </button>
                ) : (
                  /* Empty Hour Node (hollow circle ○, interactive) */
                  <button
                    onClick={() => onNewActivity(undefined, hourStr)}
                    title={`Adicionar atividade às ${hourStr}`}
                    className={`w-3.5 h-3.5 rounded-full border bg-[#0B0D12] transition-all hover:scale-130 active:scale-95 cursor-pointer group flex items-center justify-center ${
                      isCurrentHour
                        ? 'border-emerald-400/80 bg-emerald-500/20 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                        : 'border-[#2D333F] hover:border-emerald-400 hover:bg-[#181C26]'
                    }`}
                    aria-label={`Adicionar atividade às ${hourStr}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-emerald-400 transition-colors" />
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
                              ? 'bg-[#0f1713]/80 border-emerald-900/60 text-[#A0A8B8] hover:border-emerald-700/60'
                              : isNext
                              ? 'bg-[#13161D] border-emerald-500/80 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-emerald-500/30 text-white'
                              : 'bg-[#13161D] border-[#252A33] hover:border-[#3B4252] hover:bg-[#181C26] text-[#E2E6EE]'
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
                                  ? 'bg-emerald-500 text-[#0B0D12] shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                                  : isNext
                                  ? 'border-2 border-emerald-400 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-[#0B0D12]'
                                  : 'border border-[#3B4252] text-transparent hover:border-emerald-400 hover:text-emerald-400'
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
                                    ? 'line-through text-[#6F7684]'
                                    : isNext
                                    ? 'text-white'
                                    : 'text-[#E2E6EE]'
                                }`}
                              >
                                {act.title}
                              </span>

                              {isNext && (
                                <span className="hidden xs:inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
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
                                  ? 'text-emerald-400 font-bold'
                                  : isCompleted
                                  ? 'text-[#6F7684]'
                                  : 'text-[#8B919E]'
                              }`}
                            >
                              {act.startTime}
                              {act.endTime ? ` – ${act.endTime}` : ''}
                            </span>

                            {act.category && (
                              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#181C26] text-[#8B919E] border border-[#252A33]">
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
                    className="w-full py-1.5 px-2 rounded-lg hover:bg-[#13161D]/60 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <span className="text-[11px] font-mono text-transparent group-hover:text-[#6F7684] transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3 text-emerald-400/80" />
                      <span>Adicionar às {hourStr}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#252A33] group-hover:text-emerald-500/60 transition-colors">
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
