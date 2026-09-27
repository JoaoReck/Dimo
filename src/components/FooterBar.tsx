import React, { useState, useEffect } from 'react';

interface FooterBarProps {
  missionsCompleted?: number;
  totalMissions?: number;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  missionsCompleted = 0,
  totalMissions = 3,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="shrink-0 w-full border-t border-[#C4C0AB] bg-[#EDE8D0]/95 backdrop-blur-md pt-2.5 text-[11px] font-mono text-[#777567] z-30 select-none"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="w-full max-w-lg mx-auto px-4 flex items-center justify-between gap-2">
        {/* Missões Diárias (X/3) */}
        <div
          className="flex items-center gap-2 text-xs font-mono"
          title={`Missões diárias: ${missionsCompleted}/${totalMissions}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              missionsCompleted > 0
                ? 'bg-[#141410] shadow-[0_0_6px_rgba(20,20,16,0.3)]'
                : 'bg-[#C4C0AB]'
            }`}
          />
          <span className="text-[#777567]">Missões diárias</span>
          <span className="text-[#141410] font-bold tracking-wider">
            {missionsCompleted}/{totalMissions}
          </span>
        </div>

        {/* Relógio do sistema */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 font-mono">
            <span className="text-[#9D9988] hidden xs:inline">HORA:</span>
            <span className="text-[#141410] font-bold">{timeString}</span>
            <span className="text-[#777567]">[BRT]</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
