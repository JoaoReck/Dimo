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
  const currentStepPadded = String(Math.min(currentStepIndex + 1, totalSteps)).padStart(2, '0');
  const totalStepsPadded = String(totalSteps).padStart(2, '0');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-8">
      <div className="rounded-lg bg-[#13161D] border border-[#252A33] px-4 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Active Cycle */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22C55E] animate-pulse" />
          <span className="font-semibold text-emerald-400 tracking-wider">
            JORNADA ATIVA // CICLO 24.10
          </span>
        </div>

        {/* Center: Philosophy Quote */}
        <div className="hidden md:flex items-center text-[#8B919E] tracking-tight">
          <span className="text-white font-medium">O Dia é a Fase</span>
          <span className="mx-2 text-[#3B4252]">•</span>
          <span className="text-emerald-400/90 font-medium">O Passo ganha o Foco</span>
        </div>

        {/* Right: Stage count & Pace */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#8B919E]">
          <div className="flex items-center gap-2">
            <span>ETAPA:</span>
            <span className="text-white font-semibold">
              {allCompleted ? 'FINALIZADA' : `${currentStepPadded} DE ${totalStepsPadded}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#252A33] pl-4">
            <span>RITMO:</span>
            <span className="text-emerald-400 font-bold">
              {allCompleted ? 'FASE CONCLUÍDA' : nextActivity ? `FOCO EM ${nextActivity.startTime}` : 'NO HORÁRIO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
