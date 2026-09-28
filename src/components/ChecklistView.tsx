import React from 'react';
import { Activity } from '../types';
import { Check, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { RpgIcon, inferRpgIcon } from './RpgIcon';

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
        <div className="p-8 rounded-2xl border border-dashed border-[#C4C0AB] bg-[#FAF8F0] text-[#777567] font-mono text-sm flex flex-col items-center">
          <p className="mb-2 text-[#33312B] font-semibold">Nenhuma atividade no checklist para esta jornada.</p>
          <p className="text-xs text-[#777567] mb-4">Adicione uma atividade para começar o seu dia.</p>
          {onNewActivity && (
            <button
              onClick={onNewActivity}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#141410] hover:bg-[#33312B] text-[#EDE8D0] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_2px_10px_rgba(20,20,16,0.15)] cursor-pointer"
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
      <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#777567] px-1">
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
                  ? 'bg-[#FAF8F0] border-2 border-[#141410] shadow-[0_4px_16px_rgba(20,20,16,0.08)]'
                  : isCompleted
                  ? 'bg-[#FAF8F0]/70 border-[#C4C0AB] hover:border-[#9D9988]'
                  : 'bg-[#FAF8F0] border-[#C4C0AB] hover:border-[#9D9988] shadow-[0_2px_6px_rgba(20,20,16,0.03)]'
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
                      ? 'bg-[#141410] text-[#EDE8D0] shadow-[0_2px_6px_rgba(20,20,16,0.2)]'
                      : isNext
                      ? 'border-2 border-[#141410] text-[#141410] bg-[#C4C0AB]/40'
                      : 'border border-[#9D9988] text-transparent hover:border-[#141410]'
                  }`}
                  aria-label={isCompleted ? 'Desmarcar' : 'Marcar como concluída'}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  {isNext && !isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-[#141410] animate-pulse" />
                  )}
                </button>

                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`font-mono text-xs font-semibold shrink-0 ${
                      isNext
                        ? 'text-[#141410]'
                        : isCompleted
                        ? 'text-[#777567]'
                        : 'text-[#545248]'
                    }`}
                  >
                    {activity.startTime}
                  </span>

                  <span
                    className={`text-sm font-medium truncate ${
                      isCompleted
                        ? 'line-through text-[#777567]'
                        : isNext
                        ? 'text-[#141410] font-semibold'
                        : 'text-[#33312B]'
                    }`}
                  >
                    {activity.title}
                  </span>

                  {isNext && (
                    <span className="hidden xs:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141410] text-[#EDE8D0] border border-[#141410] font-bold shrink-0">
                      PRÓXIMO
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Duration & arrow */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {activity.duration && (
                  <span className="text-[11px] font-mono text-[#777567] hidden sm:inline">
                    {activity.duration}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#777567]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
