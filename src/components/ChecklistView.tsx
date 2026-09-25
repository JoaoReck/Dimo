import React from 'react';
import { Activity } from '../types';
import { Check, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface ChecklistViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  onNewActivity?: () => void;
  nextActivityId?: string;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  onNewActivity,
  nextActivityId,
}) => {
  if (activities.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl border border-dashed border-[#252A33] bg-[#13161D]/50 text-[#8B919E] font-mono text-sm flex flex-col items-center">
          <p className="mb-2">Nenhuma atividade no checklist para esta jornada.</p>
          <p className="text-xs text-neutral-500 mb-4">Adicione uma atividade para começar o seu dia.</p>
          {onNewActivity && (
            <button
              onClick={onNewActivity}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ NOVA ATIVIDADE</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-20">
      <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#8B919E] px-1">
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
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isNext
                  ? 'bg-[#13161D] border-emerald-500/70 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
                  : isCompleted
                  ? 'bg-[#13161D]/60 border-[#252A33] hover:border-[#3B4252]'
                  : 'bg-[#13161D]/40 border-[#252A33] hover:border-[#3B4252]'
              }`}
              onClick={() => onOpenDetail(activity)}
            >
              {/* Left: Checkbox & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(activity.id);
                  }}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0 cursor-pointer ${
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
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`font-mono text-xs font-semibold shrink-0 ${
                      isNext
                        ? 'text-emerald-400'
                        : isCompleted
                        ? 'text-emerald-500/70'
                        : 'text-[#8B919E]'
                    }`}
                  >
                    {activity.startTime}
                  </span>

                  <span
                    className={`text-sm font-medium truncate ${
                      isCompleted
                        ? 'line-through text-[#6F7684]'
                        : isNext
                        ? 'text-white font-semibold'
                        : 'text-[#D0D4DC]'
                    }`}
                  >
                    {activity.title}
                  </span>

                  {isNext && (
                    <span className="hidden xs:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                      PRÓXIMO
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Duration & arrow */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {activity.duration && (
                  <span className="text-[11px] font-mono text-[#8B919E] hidden sm:inline">
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
