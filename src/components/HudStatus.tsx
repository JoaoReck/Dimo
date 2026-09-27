import React from 'react';
import { Activity } from '../types';

interface HudStatusProps {
  currentStepIndex: number;
  totalSteps: number;
  allCompleted: boolean;
  nextActivity?: Activity;
}

export const HudStatus: React.FC<HudStatusProps> = ({
  currentStepIndex,
  totalSteps,
  allCompleted,
  nextActivity,
}) => {
  if (totalSteps === 0) {
    return (
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4 mb-4">
        <div className="rounded-xl bg-[#FAF8F0] border border-[#C4C0AB] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#141410]" />
            <span className="font-semibold text-[#141410] tracking-wider text-[11px] sm:text-xs">
              JORNADA PRONTA
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#777567] text-[11px] sm:text-xs">
            <span>0 ETAPAS</span>
            <span className="text-[#C4C0AB]">•</span>
            <span className="text-[#141410] font-semibold">Adicione para começar</span>
          </div>
        </div>
      </div>
    );
  }

  const currentStepPadded = String(Math.min(currentStepIndex + 1, totalSteps)).padStart(2, '0');
  const totalStepsPadded = String(totalSteps).padStart(2, '0');

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 mb-4">
      <div className="rounded-xl bg-[#FAF8F0] border border-[#C4C0AB] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 text-xs font-mono">
        {/* Left: Active Cycle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#141410] animate-pulse" />
          <span className="font-semibold text-[#141410] tracking-wider text-[11px] sm:text-xs">
            JORNADA ATIVA
          </span>
        </div>

        {/* Right: Stage count & Pace */}
        <div className="flex items-center gap-2 sm:gap-4 text-[#777567] text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#777567]">ETAPA:</span>
            <span className="text-[#141410] font-semibold">
              {allCompleted ? 'FINALIZADA' : `${currentStepPadded} / ${totalStepsPadded}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#C4C0AB] pl-2.5">
            <span className="hidden xs:inline text-[#777567]">FOCO:</span>
            <span className="text-[#141410] font-bold truncate max-w-[110px] sm:max-w-none">
              {allCompleted ? 'CONCLUÍDO' : nextActivity ? nextActivity.startTime : 'NO HORÁRIO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
