import React from 'react';

interface FooterBarProps {
  completedActivities?: number;
  totalActivities?: number;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  completedActivities = 0,
  totalActivities = 0,
}) => {
  const allCompleted = totalActivities > 0 && completedActivities === totalActivities;

  return (
    <footer
      className="shrink-0 w-full border-t border-[#C4C0AB] bg-[#EDE8D0] pt-2.5 text-[11px] font-mono text-[#777567] z-30 select-none"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="w-full max-w-lg mx-auto px-4 flex items-center gap-2">
        {/* Missões Diárias (X/Y) */}
        <div
          className="flex items-center gap-2 text-xs font-mono"
          title={`Missões diárias: ${completedActivities}/${totalActivities}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              allCompleted
                ? 'bg-[#141410] shadow-[0_0_6px_rgba(20,20,16,0.3)]'
                : completedActivities > 0
                ? 'bg-[#545248]'
                : 'bg-[#C4C0AB]'
            }`}
          />
          <span className="text-[#777567]">Missões diárias</span>
          <span className="text-[#141410] font-bold tracking-wider">
            {completedActivities}/{totalActivities}
          </span>
        </div>
      </div>
    </footer>
  );
};
