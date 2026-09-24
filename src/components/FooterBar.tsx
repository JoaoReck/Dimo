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
    <footer className="w-full border-t border-[#252A33] bg-[#0B0D12] py-3 text-[11px] font-mono text-[#8B919E] fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-semibold">[CICLO:</span>
          <span className="text-[#C5CAD3]">PLANEJAR</span>
          <span className="text-emerald-500">→</span>
          <span className="text-emerald-400 font-bold">EXECUTAR</span>
          <span className="text-emerald-500">→</span>
          <span className="text-[#C5CAD3]">REVISAR</span>
          <span className="text-emerald-500">→</span>
          <span className="text-[#C5CAD3]">AVANÇAR ]</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-neutral-600">
            ESPAÇO: Concluir etapa atual
          </span>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">HORA ATUAL:</span>
            <span className="text-white font-bold">{timeString}</span>
            <span className="text-neutral-600">[BRT]</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
