import React from 'react';
import { Activity } from '../types';
import { Check, Square, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ChecklistViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  nextActivityId?: string;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  nextActivityId,
}) => {
  if (activities.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-xl border border-dashed border-[#252A33] bg-[#13161D]/50 text-[#8B919E] font-mono text-sm">
          Nenhuma atividade no checklist para esta jornada.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-20">
      <div className="mb-4 flex items-center justify-between text-xs font-mono text-[#8B919E] px-2">
        <span>ESTADO & HORÁRIO</span>
        <span>ATIVIDADE // DETALHES</span>
      </div>

      <div className="space-y-2.5">
        {activities.map((activity) => {
          const isCompleted = activity.completed;
          const isNext = activity.id === nextActivityId && !isCompleted;

          return (
            <motion.div
              key={activity.id}
              layout
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isNext
                  ? 'bg-[#13161D] border-emerald-500/70 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
                  : isCompleted
                  ? 'bg-[#13161D]/70 border-[#252A33] hover:border-[#3B4252]'
                  : 'bg-[#13161D]/40 border-[#252A33] hover:border-[#3B4252]'
              }`}
              onClick={() => onOpenDetail(activity)}
            >
              {/* Left: Checkbox & Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(activity.id);
                  }}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-[#0B0D12] shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                      : isNext
                      ? 'border-2 border-emerald-400 text-emerald-400 bg-emerald-500/10'
                      : 'border border-[#3B4252] text-transparent hover:border-neutral-400'
                  }`}
                  aria-label={isCompleted ? 'Desmarcar' : 'Marcar como concluída'}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  {isNext && !isCompleted && (
                    <span className="w-2 h-2 rounded-sm bg-emerald-400 animate-pulse" />
                  )}
                </button>

                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isNext
                        ? 'text-emerald-400'
                        : isCompleted
                        ? 'text-[#8B919E]'
                        : 'text-[#8B919E]'
                    }`}
                  >
                    {activity.startTime}
                  </span>

                  <span
                    className={`text-sm sm:text-base font-medium truncate ${
                      isCompleted
                        ? 'line-through text-[#6F7684]'
                        : isNext
                        ? 'text-white font-semibold'
                        : 'text-[#E0E0E0]'
                    }`}
                  >
                    {activity.title}
                  </span>

                  {isNext && (
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      PRÓXIMO
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Category & arrow */}
              <div className="flex items-center gap-3 shrink-0 ml-3">
                {activity.duration && (
                  <span className="text-xs font-mono text-[#8B919E] hidden md:inline">
                    {activity.duration}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#6F7684]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
