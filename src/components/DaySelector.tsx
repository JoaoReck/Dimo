import React from 'react';
import { DayOffset, DayInfo } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  currentOffset: DayOffset;
  dayInfo: DayInfo;
  onSelectOffset: (offset: DayOffset) => void;
  totalActivities: number;
  completedActivities: number;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  currentOffset,
  dayInfo,
  onSelectOffset,
  totalActivities,
  completedActivities,
}) => {
  const percentage =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#252A33]">
        {/* Navigation arrows & day indicator */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectOffset(-1)}
            disabled={currentOffset === -1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              currentOffset === -1
                ? 'opacity-30 cursor-not-allowed text-[#8B919E]'
                : 'text-[#8B919E] hover:text-white hover:bg-[#181C26]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ontem</span>
          </button>

          <button
            onClick={() => onSelectOffset(0)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border ${
              currentOffset === 0
                ? 'bg-[#181C26] text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                : 'text-[#8B919E] border-transparent hover:text-white hover:bg-[#181C26]'
            }`}
          >
            {dayInfo.label}
          </button>

          <button
            onClick={() => onSelectOffset(1)}
            disabled={currentOffset === 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              currentOffset === 1
                ? 'opacity-30 cursor-not-allowed text-[#8B919E]'
                : 'text-[#8B919E] hover:text-white hover:bg-[#181C26]'
            }`}
          >
            <span>Amanhã</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B919E]">
            <span
              className={`w-2 h-2 rounded-full ${
                percentage === 100
                  ? 'bg-emerald-400 shadow-[0_0_8px_#22C55E]'
                  : percentage > 0
                  ? 'bg-emerald-500'
                  : 'bg-neutral-600'
              }`}
            />
            <span className="font-semibold text-white tracking-wider">
              {completedActivities} / {totalActivities} CONCLUÍDAS
            </span>
            <span className="text-emerald-400 font-bold">({percentage}%)</span>
          </div>

          <div className="w-28 sm:w-36 h-2 bg-[#181C26] rounded-full overflow-hidden border border-[#252A33] p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
