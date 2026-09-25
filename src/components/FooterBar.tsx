import React, { useState, useEffect } from 'react';

export const FooterBar: React.FC = () => {
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
      className="w-full border-t border-[#252A33] bg-[#0B0D12]/95 backdrop-blur-md pt-2.5 text-[11px] font-mono text-[#8B919E] fixed bottom-0 left-0 right-0 z-30 select-none"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs">
          <span className="text-emerald-400 font-semibold">[</span>
          <span className="text-[#C5CAD3]">FASE</span>
          <span className="text-emerald-500">→</span>
          <span className="text-emerald-400 font-bold">ETAPA</span>
          <span className="text-emerald-500">→</span>
          <span className="text-[#C5CAD3]">AVANÇO</span>
          <span className="text-emerald-400 font-semibold">]</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 font-mono">
            <span className="text-neutral-500 hidden xs:inline">HORA:</span>
            <span className="text-white font-bold">{timeString}</span>
            <span className="text-neutral-600">[BRT]</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
