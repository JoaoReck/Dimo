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
  const touchStartRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) onNextDay();
      else onPrevDay();
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-2.5 select-none"
    >
      <div className="flex items-center justify-between gap-1.5 py-1.5 px-2 sm:px-3 rounded-2xl bg-[#C4C0AB]/30 border border-[#C4C0AB]">
        {/* Left Arrow: Previous Day (-1 day) */}
        <button
          type="button"
          onClick={onPrevDay}
          title="Dia anterior (deslize para a direita ou ←)"
          className="p-2 sm:p-2.5 rounded-xl text-[#545248] hover:text-[#141410] hover:bg-[#C4C0AB]/60 active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center: Current Date Label */}
        <button
          type="button"
          onClick={onToday}
          title={currentOffset !== 0 ? 'Voltar para Hoje' : 'Rolar para horário atual'}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono transition-all truncate text-center cursor-pointer text-[#141410] hover:bg-[#C4C0AB]/40 active:scale-98 min-h-[40px]"
        >
          <span className="truncate font-semibold tracking-tight">{dayInfo.label}</span>
          {currentOffset !== 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141410] text-[#EDE8D0] shrink-0 font-bold ml-1.5 font-mono tracking-wider shadow-sm">
              HOJE
            </span>
          )}
        </button>

        {/* Right Arrow: Next Day (+1 day) */}
        <button
          type="button"
          onClick={onNextDay}
          title="Próximo dia (deslize para a esquerda ou →)"
          className="p-2 sm:p-2.5 rounded-xl text-[#545248] hover:text-[#141410] hover:bg-[#C4C0AB]/60 active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Próximo dia"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
