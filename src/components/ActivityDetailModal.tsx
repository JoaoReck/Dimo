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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#141410]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-[#FAF8F0] border border-[#C4C0AB] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#C4C0AB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activity.completed
                    ? 'bg-[#141410]'
                    : 'bg-[#545248] animate-pulse'
                }`}
              />
              <span className="text-xs font-mono text-[#777567] tracking-wider uppercase">
                ATIVIDADE // {dayInfo.shortLabel}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    activity.completed
                      ? 'bg-[#141410] text-[#EDE8D0] border-[#141410] font-semibold'
                      : 'bg-[#C4C0AB]/40 text-[#545248] border-[#C4C0AB]'
                  }`}
                >
                  {activity.completed ? '● CONCLUÍDA' : '○ EM ABERTO'}
                </span>
                {activity.category && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C4C0AB]/40 text-[#545248] border border-[#C4C0AB]">
                    {activity.category}
                  </span>
                )}
                {activity.duration && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDE8D0] text-[#141410] border border-[#C4C0AB]">
                    {activity.duration}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#141410] tracking-tight uppercase break-words">
                {activity.title}
              </h2>
            </div>

            {/* Time & Date Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#EDE8D0] border border-[#C4C0AB]">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-[#141410] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#777567]">HORÁRIO</div>
                  <div className="text-xs font-mono font-bold text-[#141410] truncate">
                    {activity.startTime}
                    {activity.endTime ? ` — ${activity.endTime}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <CalendarIcon className="w-4 h-4 text-[#141410] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#777567]">DATA</div>
                  <div className="text-xs font-mono font-medium text-[#141410] truncate">
                    {dayInfo.dateFormatted}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {activity.description && (
              <div>
                <div className="text-[10px] font-mono text-[#777567] mb-1">NOTAS / DIRETRIZES</div>
                <p className="text-xs sm:text-sm text-[#33312B] leading-relaxed p-3 rounded-xl bg-[#EDE8D0]/60 border border-[#C4C0AB] break-words">
                  {activity.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 sm:p-4 border-t border-[#C4C0AB] bg-[#EDE8D0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(activity)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F0] border border-[#C4C0AB] text-xs font-mono text-[#33312B] hover:bg-[#C4C0AB]/40 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDITAR</span>
              </button>

              <button
                onClick={() => onDelete(activity.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F0] border border-[#C4C0AB] text-xs font-mono text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>EXCLUIR</span>
              </button>
            </div>

            <button
              onClick={() => onToggleComplete(activity.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
                activity.completed
                  ? 'bg-[#FAF8F0] hover:bg-[#C4C0AB]/40 text-[#141410] border border-[#9D9988]'
                  : 'bg-[#141410] hover:bg-[#33312B] text-[#EDE8D0]'
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
