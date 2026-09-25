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
        <div className="rounded-xl bg-[#13161D] border border-[#252A33] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span className="font-semibold text-emerald-400 tracking-wider text-[11px] sm:text-xs">
              JORNADA PRONTA
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#8B919E] text-[11px] sm:text-xs">
            <span>0 ETAPAS</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-400 font-semibold">Adicione para começar</span>
          </div>
        </div>
      </div>
    );
  }

  const currentStepPadded = String(Math.min(currentStepIndex + 1, totalSteps)).padStart(2, '0');
  const totalStepsPadded = String(totalSteps).padStart(2, '0');

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 mb-4">
      <div className="rounded-xl bg-[#13161D] border border-[#252A33] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 text-xs font-mono">
        {/* Left: Active Cycle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22C55E] animate-pulse" />
          <span className="font-semibold text-emerald-400 tracking-wider text-[11px] sm:text-xs">
            JORNADA ATIVA
          </span>
        </div>

        {/* Right: Stage count & Pace */}
        <div className="flex items-center gap-2 sm:gap-4 text-[#8B919E] text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8B919E]">ETAPA:</span>
            <span className="text-white font-semibold">
              {allCompleted ? 'FINALIZADA' : `${currentStepPadded} / ${totalStepsPadded}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#252A33] pl-2.5">
            <span className="hidden xs:inline text-[#8B919E]">FOCO:</span>
            <span className="text-emerald-400 font-bold truncate max-w-[110px] sm:max-w-none">
              {allCompleted ? 'CONCLUÍDO' : nextActivity ? nextActivity.startTime : 'NO HORÁRIO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
