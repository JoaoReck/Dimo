import React from 'react';
import { DayOffset, DayInfo } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  currentOffset: DayOffset;
  dayInfo: DayInfo;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday?: () => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  currentOffset,
  dayInfo,
  onPrevDay,
  onNextDay,
  onToday,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-2.5 select-none">
      <div className="flex items-center justify-between gap-1.5 py-1.5 px-2 sm:px-3 rounded-2xl bg-[#13161D]/80 border border-[#252A33]">
        {/* Left Arrow: Previous Day (-1 day) */}
        <button
          onClick={onPrevDay}
          title="Dia anterior"
          className="p-1.5 sm:p-2 rounded-xl text-[#8B919E] hover:text-white hover:bg-[#181C26] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Center: Current Date Label */}
        <button
          onClick={onToday}
          title={currentOffset !== 0 ? 'Voltar para Hoje' : 'Rolar para horário atual'}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono transition-all truncate text-center cursor-pointer ${
            currentOffset === 0
              ? 'text-white font-medium hover:text-emerald-400'
              : 'text-[#C5CAD3] hover:text-emerald-400'
          }`}
        >
          <span className="truncate">{dayInfo.label}</span>
          {currentOffset !== 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 font-bold ml-1">
              HOJE
            </span>
          )}
        </button>

        {/* Right Arrow: Next Day (+1 day) */}
        <button
          onClick={onNextDay}
          title="Próximo dia"
          className="p-1.5 sm:p-2 rounded-xl text-[#8B919E] hover:text-white hover:bg-[#181C26] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Próximo dia"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
