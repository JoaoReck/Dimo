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
      <div className="flex items-center justify-between gap-1.5 py-1.5 px-2 sm:px-3 rounded-2xl bg-[#C4C0AB]/30 border border-[#C4C0AB]">
        {/* Left Arrow: Previous Day (-1 day) */}
        <button
          onClick={onPrevDay}
          title="Dia anterior"
          className="p-1.5 sm:p-2 rounded-xl text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/60 active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Center: Current Date Label */}
        <button
          onClick={onToday}
          title={currentOffset !== 0 ? 'Voltar para Hoje' : 'Rolar para horário atual'}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono transition-all truncate text-center cursor-pointer text-[#141410] hover:text-[#545248]"
        >
          <span className="truncate font-semibold">{dayInfo.label}</span>
          {currentOffset !== 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#33312B] text-[#EDE8D0] shrink-0 font-bold ml-1 font-mono tracking-wider">
              HOJE
            </span>
          )}
        </button>

        {/* Right Arrow: Next Day (+1 day) */}
        <button
          onClick={onNextDay}
          title="Próximo dia"
          className="p-1.5 sm:p-2 rounded-xl text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/60 active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Próximo dia"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
