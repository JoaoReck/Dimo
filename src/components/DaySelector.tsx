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
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 pt-4 pb-3">
      <div className="flex flex-col gap-3 pb-3 border-b border-[#252A33]">
        {/* Navigation arrows & day indicator */}
        <div className="flex items-center justify-between gap-1 w-full">
          <button
            onClick={() => onSelectOffset(-1)}
            disabled={currentOffset === -1}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
              currentOffset === -1
                ? 'opacity-30 cursor-not-allowed text-[#8B919E]'
                : 'text-[#8B919E] hover:text-white hover:bg-[#181C26]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Ontem</span>
          </button>

          <button
            onClick={() => onSelectOffset(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border truncate max-w-[200px] sm:max-w-none text-center ${
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
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
              currentOffset === 1
                ? 'opacity-30 cursor-not-allowed text-[#8B919E]'
                : 'text-[#8B919E] hover:text-white hover:bg-[#181C26]'
            }`}
          >
            <span className="hidden xs:inline">Amanhã</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Counter (Centered & full-width) */}
        <div className="flex items-center justify-between gap-3 w-full bg-[#13161D]/50 p-2.5 rounded-xl border border-[#252A33]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B919E] shrink-0">
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
              {completedActivities} / {totalActivities} ETAPAS
            </span>
            <span className="text-emerald-400 font-bold">({percentage}%)</span>
          </div>

          <div className="flex-1 max-w-[140px] sm:max-w-[180px] h-2 bg-[#181C26] rounded-full overflow-hidden border border-[#252A33] p-[1px]">
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
