import React from 'react';
import { Activity, DayInfo } from '../types';
import { X, Check, RotateCcw, Edit3, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  dayInfo: DayInfo;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  dayInfo,
  onClose,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  if (!activity) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-[#13161D] border border-[#252A33] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#252A33] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activity.completed
                    ? 'bg-emerald-500 shadow-[0_0_8px_#22C55E]'
                    : 'bg-neutral-500'
                }`}
              />
              <span className="text-xs font-mono text-[#8B919E] tracking-wider uppercase">
                DETALHE DA ETAPA
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8B919E] hover:text-white hover:bg-[#181C26] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    activity.completed
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-[#181C26] text-[#8B919E] border-[#252A33]'
                  }`}
                >
                  {activity.completed ? '● CONCLUÍDA' : '○ PENDENTE'}
                </span>
                {activity.category && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181C26] text-[#8B919E] border border-[#252A33]">
                    {activity.category}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">
                {activity.title}
              </h2>
            </div>

            {/* Time & Date Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#0B0D12] border border-[#252A33]">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#8B919E]">HORÁRIO</div>
                  <div className="text-xs font-mono font-bold text-white truncate">
                    {activity.startTime}
                    {activity.endTime ? ` — ${activity.endTime}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <CalendarIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#8B919E]">DATA</div>
                  <div className="text-xs font-mono font-medium text-white truncate">
                    {dayInfo.dateFormatted}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {activity.description && (
              <div>
                <div className="text-[10px] font-mono text-[#8B919E] mb-1">NOTAS / DIRETRIZES</div>
                <p className="text-xs sm:text-sm text-[#C5CAD3] leading-relaxed p-3 rounded-xl bg-[#181C26]/50 border border-[#252A33] break-words">
                  {activity.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 sm:p-4 border-t border-[#252A33] bg-[#0B0D12]/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(activity)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181C26] border border-[#252A33] text-xs font-mono text-white hover:bg-[#252A33] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDITAR</span>
              </button>

              <button
                onClick={() => onDelete(activity.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181C26] border border-[#252A33] text-xs font-mono text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>EXCLUIR</span>
              </button>
            </div>

            <button
              onClick={() => onToggleComplete(activity.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
                activity.completed
                  ? 'bg-[#181C26] hover:bg-[#252A33] text-white border border-[#3B4252]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              }`}
            >
              {activity.completed ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>REABRIR ETAPA</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>CONCLUIR</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
