import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { Check, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineViewProps {
  activities: activitiesType[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  nextActivityId?: string;
}

// Type alias
type activitiesType = Activity;

export const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  nextActivityId,
}) => {
  // Live elapsed timer for the active next step to give a live ticking presence
  const [secondsElapsed, setSecondsElapsed] = useState<number>(2535); // starts at ~42min like the screenshot

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (activities.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-xl border border-dashed border-[#252A33] bg-[#13161D]/50">
          <p className="text-[#8B919E] mb-2 font-mono text-sm">
            Nenhuma etapa cadastrada para esta jornada.
          </p>
          <p className="text-xs text-neutral-500">
            Clique em "+ NOVA ATIVIDADE" para traçar o seu caminho pelo dia.
          </p>
        </div>
      </div>
    );
  }

  // Find index of next activity for line styling
  const nextIndex = activities.findIndex((a) => a.id === nextActivityId);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <div className="relative">
        {activities.map((activity, index) => {
          const isCompleted = activity.completed;
          const isNext = activity.id === nextActivityId && !isCompleted;
          const isLast = index === activities.length - 1;

          // Determine line color leading from this item to the next
          // If this item is completed and next item is also completed or is the active next item: green line!
          const nextItem = activities[index + 1];
          const isLineActive = isCompleted && nextItem && (nextItem.completed || nextItem.id === nextActivityId);

          return (
            <div key={activity.id} className="relative flex items-stretch group">
              {/* Left Column: Vertical Track & Node */}
              <div className="relative flex flex-col items-center mr-4 sm:mr-8 shrink-0">
                {/* Node Button (Clickable to mark/unmark) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => onToggleComplete(activity.id, e)}
                  title={isCompleted ? 'Reabrir etapa' : 'Concluir etapa'}
                  className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(34,197,94,0.6)] cursor-pointer'
                      : isNext
                      ? 'bg-[#0B0D12] border-2 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.35)] ring-4 ring-emerald-500/20 cursor-pointer'
                      : 'bg-[#0B0D12] border-2 border-[#252A33] text-[#8B919E] hover:border-[#3B4252] cursor-pointer'
                  }`}
                  aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3] text-[#0B0D12]" />
                  ) : isNext ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22C55E] animate-pulse" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#252A33] group-hover:bg-[#3B4252] transition-colors" />
                  )}
                </motion.button>

                {/* Connecting Line to next node */}
                {!isLast && (
                  <div
                    className={`w-[3px] flex-1 my-1 transition-all duration-500 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                        : 'bg-[#252A33]'
                    }`}
                  />
                )}
              </div>

              {/* Right Column: Activity Card */}
              <div className="flex-1 pb-6 w-full min-w-0">
                <motion.div
                  layout
                  onClick={() => onOpenDetail(activity)}
                  className={`relative rounded-xl p-4 sm:p-5 transition-all duration-300 cursor-pointer border ${
                    isNext
                      ? 'bg-[#13161D] border-emerald-500/80 shadow-[0_0_30px_rgba(34,197,94,0.12)] ring-1 ring-emerald-500/30'
                      : isCompleted
                      ? 'bg-[#13161D]/70 border-[#252A33] hover:border-[#3B4252] hover:bg-[#181C26]'
                      : 'bg-[#13161D]/50 border-[#252A33] hover:border-[#3B4252] hover:bg-[#181C26]'
                  }`}
                >
                  {/* Card Header: Time, Title, Status & Duration */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                      {/* Time */}
                      <span
                        className={`text-sm sm:text-base font-mono font-bold tracking-tight ${
                          isNext
                            ? 'text-emerald-400'
                            : isCompleted
                            ? 'text-emerald-500/90'
                            : 'text-[#8B919E]'
                        }`}
                      >
                        {activity.startTime}
                        {activity.endTime ? ` - ${activity.endTime}` : ''}
                      </span>

                      {/* Title */}
                      <h3
                        className={`text-base sm:text-lg font-semibold truncate tracking-tight ${
                          isNext
                            ? 'text-white'
                            : isCompleted
                            ? 'text-[#E0E0E0]'
                            : 'text-[#C5CAD3]'
                        }`}
                      >
                        {activity.title}
                      </h3>

                      {/* Badge */}
                      {isCompleted && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          CONCLUÍDA
                        </span>
                      )}

                      {isNext && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-bold tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          VOCÊ ESTÁ AQUI // PRÓXIMO PASSO
                        </span>
                      )}

                      {!isCompleted && !isNext && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181C26] text-[#8B919E] border border-[#252A33]">
                          PENDENTE
                        </span>
                      )}
                    </div>

                    {/* Duration */}
                    {activity.duration && (
                      <span className="text-xs font-mono text-[#8B919E] shrink-0">
                        {activity.duration}
                      </span>
                    )}
                  </div>

                  {/* Active Step Extras: Chronometer timer & Special info */}
                  {isNext && (
                    <div className="my-3 flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B0D12] border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{formatTimer(secondsElapsed)}</span>
                      </div>
                      <span className="text-[11px] text-[#8B919E] font-mono hidden sm:inline">
                        ETAPA EM PROGRESSO
                      </span>
                    </div>
                  )}

                  {/* Description / Notes */}
                  {activity.description && (
                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                        isNext
                          ? 'text-[#C5CAD3]'
                          : isCompleted
                          ? 'text-[#8B919E]'
                          : 'text-[#6F7684]'
                      }`}
                    >
                      {activity.description}
                    </p>
                  )}

                  {/* Footer of card */}
                  {isNext ? (
                    <div className="pt-3 border-t border-[#252A33]/80 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] font-mono text-[#8B919E]">
                        DURAÇÃO ESTIMADA: <strong className="text-white font-mono">{activity.duration || '01:00:00'}</strong>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(activity.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#0B0D12] text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.35)]"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>[ CONCLUIR PASSO (ESPAÇO) ]</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 flex items-center justify-between text-xs text-[#8B919E]">
                      <span className="text-[11px] font-mono">
                        {isCompleted && activity.completedAt
                          ? `Concluído às ${activity.completedAt}`
                          : activity.category || 'Atividade'}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-[#8B919E] group-hover:text-white transition-colors">
                        Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
