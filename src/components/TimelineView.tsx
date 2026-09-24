import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { Check, Clock, ChevronRight, Sparkles, RotateCcw, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  nextActivityId?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  nextActivityId,
}) => {
  // Live elapsed timer for the active next step to give a live ticking presence
  const [secondsElapsed, setSecondsElapsed] = useState<number>(2535); // starts at ~42min

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
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl border border-dashed border-[#252A33] bg-[#13161D]/50">
          <p className="text-[#8B919E] mb-2 font-mono text-sm">
            Nenhuma etapa cadastrada para esta jornada.
          </p>
          <p className="text-xs text-neutral-500">
            Clique em "+ NOVA" para traçar o seu caminho pelo dia.
          </p>
        </div>
      </div>
    );
  }

  const allCompleted = activities.length > 0 && activities.every((a) => a.completed);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-20">
      {/* Journey Start Marker (Centered) */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#13161D] border border-[#252A33] text-[10px] font-mono text-[#8B919E] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>INÍCIO DA JORNADA</span>
        </div>
      </div>

      {/* Centralized Timeline Journey */}
      <div className="relative flex flex-col items-center w-full">
        {activities.map((activity, index) => {
          const isCompleted = activity.completed;
          const isNext = activity.id === nextActivityId && !isCompleted;
          const isLast = index === activities.length - 1;

          // Line styling leading from previous node:
          // If previous activity was completed, the line is active green
          const prevItem = index > 0 ? activities[index - 1] : null;
          const isLineActiveFromPrev = prevItem?.completed;

          return (
            <div key={activity.id} className="w-full flex flex-col items-center">
              {/* Connector Line above node (Centered) */}
              <div className="flex flex-col items-center h-6 sm:h-7 w-full justify-center">
                <div
                  className={`w-[3px] h-full rounded-full transition-all duration-500 ${
                    index === 0
                      ? isCompleted
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                        : 'bg-[#252A33]'
                      : isLineActiveFromPrev
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                      : 'bg-[#252A33]'
                  }`}
                />
              </div>

              {/* Central Node Checkpoint */}
              <div className="relative z-20 flex items-center justify-center">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => onToggleComplete(activity.id, e)}
                  title={isCompleted ? 'Reabrir etapa (desfazer conclusão)' : 'Concluir esta etapa'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 text-[#0B0D12] shadow-[0_0_18px_rgba(34,197,94,0.6)] hover:bg-emerald-400'
                      : isNext
                      ? 'bg-[#0B0D12] border-2 border-emerald-400 text-emerald-400 shadow-[0_0_22px_rgba(34,197,94,0.4)] ring-4 ring-emerald-500/20'
                      : 'bg-[#0B0D12] border-2 border-[#252A33] text-[#8B919E] hover:border-[#3B4252]'
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
              </div>

              {/* Connector line between node and card */}
              <div className="w-[3px] h-2.5 sm:h-3 rounded-full bg-[#252A33]" />

              {/* Activity Card (Perfect symmetry & centered in the column) */}
              <div className="w-full min-w-0 px-0 sm:px-1">
                <motion.div
                  layout
                  onClick={() => onOpenDetail(activity)}
                  className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer border ${
                    isNext
                      ? 'bg-[#13161D] border-emerald-500/80 shadow-[0_0_30px_rgba(34,197,94,0.14)] ring-1 ring-emerald-500/30'
                      : isCompleted
                      ? 'bg-[#13161D]/60 border-[#252A33] hover:border-[#3B4252] hover:bg-[#181C26]/70'
                      : 'bg-[#13161D]/40 border-[#252A33] hover:border-[#3B4252] hover:bg-[#181C26]/50'
                  }`}
                >
                  {/* Card Header: Time, Title, Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                    <div className="flex-1 min-w-0">
                      {/* Status Tag */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isNext && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            PRÓXIMO PASSO
                          </span>
                        )}

                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
                            <Check className="w-3 h-3 stroke-[3]" />
                            CONCLUÍDA
                          </span>
                        )}

                        {!isCompleted && !isNext && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#181C26] text-[#8B919E] border border-[#252A33]">
                            PENDENTE
                          </span>
                        )}

                        {activity.category && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#181C26] text-[#8B919E] border border-[#252A33]">
                            {activity.category}
                          </span>
                        )}
                      </div>

                      {/* Time & Title */}
                      <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                        <span
                          className={`font-mono text-xs sm:text-sm font-bold tracking-tight shrink-0 ${
                            isNext
                              ? 'text-emerald-400'
                              : isCompleted
                              ? 'text-emerald-500/80'
                              : 'text-[#8B919E]'
                          }`}
                        >
                          {activity.startTime}
                          {activity.endTime ? ` — ${activity.endTime}` : ''}
                        </span>

                        <h3
                          className={`text-base sm:text-lg font-bold tracking-tight break-words min-w-0 ${
                            isNext
                              ? 'text-white'
                              : isCompleted
                              ? 'text-[#C5CAD3] line-through decoration-[#252A33]'
                              : 'text-[#D0D4DC]'
                          }`}
                        >
                          {activity.title}
                        </h3>
                      </div>
                    </div>

                    {/* Duration badge */}
                    {activity.duration && (
                      <span className="text-[11px] font-mono text-[#8B919E] shrink-0 bg-[#0B0D12] px-2 py-1 rounded border border-[#252A33]">
                        {activity.duration}
                      </span>
                    )}
                  </div>

                  {/* Active Step Extras: Live stopwatch */}
                  {isNext && (
                    <div className="my-3 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0B0D12] border border-emerald-500/25">
                      <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{formatTimer(secondsElapsed)}</span>
                        <span className="text-[10px] text-[#8B919E]">EM ANDAMENTO</span>
                      </div>
                      <span className="text-[10px] text-[#8B919E] font-mono">
                        ETAPA ATUAL
                      </span>
                    </div>
                  )}

                  {/* Description / Directives */}
                  {activity.description && (
                    <p
                      className={`text-xs sm:text-sm leading-relaxed my-2.5 line-clamp-2 ${
                        isNext
                          ? 'text-[#C5CAD3]'
                          : isCompleted
                          ? 'text-[#8B919E]'
                          : 'text-[#8B919E]'
                      }`}
                    >
                      {activity.description}
                    </p>
                  )}

                  {/* Card Footer / Action Button */}
                  {isNext ? (
                    <div className="pt-3 border-t border-[#252A33]/80">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(activity.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#0B0D12] text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_16px_rgba(34,197,94,0.35)] cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>CONCLUIR PASSO</span>
                        <span className="hidden sm:inline opacity-70 text-[10px] font-normal">
                          (ESPAÇO)
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2.5 border-t border-[#252A33]/40 flex items-center justify-between text-xs text-[#8B919E]">
                      <span className="text-[10px] font-mono">
                        {isCompleted && activity.completedAt
                          ? `Concluído às ${activity.completedAt}`
                          : 'Toque para detalhes'}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] hover:text-white transition-colors">
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Bottom connector line leading to next step (or to final marker) */}
              {!isLast && (
                <div className="w-[3px] h-4 sm:h-5 rounded-full bg-[#252A33]" />
              )}
            </div>
          );
        })}

        {/* Final Journey Marker */}
        <div className="w-full flex flex-col items-center pt-3">
          <div className="w-[3px] h-6 rounded-full bg-[#252A33]" />
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all ${
              allCompleted
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                : 'bg-[#13161D] border-[#252A33] text-[#8B919E]'
            }`}
          >
            {allCompleted ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold tracking-wider">FASE COMPLETA // PARABÉNS!</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#252A33]" />
                <span>FIM DO CICLO DIÁRIO</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
