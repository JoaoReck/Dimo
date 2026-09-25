import React from 'react';
import { X, Plus, Smartphone, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface InstallBannerProps {
  isIOS: boolean;
  canInstallNative: boolean;
  onOpenGuide: () => void;
  onNativeInstall: () => void;
  onDismiss: () => void;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  isIOS,
  canInstallNative,
  onOpenGuide,
  onNativeInstall,
  onDismiss,
}) => {
  const handleAction = () => {
    if (canInstallNative) {
      onNativeInstall();
    } else {
      onOpenGuide();
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      aria-label="Convite para adicionar à tela inicial"
      className="fixed left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40"
      style={{ bottom: 'calc(3.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="rounded-2xl bg-[#13161D]/95 backdrop-blur-md border border-emerald-500/40 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(34,197,94,0.15)] flex flex-col gap-3">
        {/* Top row: Icon + Text + Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* App Icon Mark */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#181C26] to-[#0B0D12] border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight leading-tight">
                Tenha o Dimo sempre com você
              </span>
              <span className="text-xs text-[#8B919E] mt-0.5 leading-snug">
                Adicione o Dimo à tela inicial para abrir sua rotina como um aplicativo.
              </span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-[#6A7280] hover:text-white hover:bg-[#181C26] transition-colors cursor-pointer shrink-0"
            title="Fechar convite"
            aria-label="Fechar convite"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#252A33]/80">
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-xl text-xs font-mono text-[#8B919E] hover:text-white transition-colors cursor-pointer"
          >
            Depois
          </button>

          <button
            onClick={handleAction}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-[#0B0D12] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_16px_rgba(34,197,94,0.3)] cursor-pointer"
          >
            {canInstallNative ? (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>INSTALAR DIMO</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>ADICIONAR À TELA INICIAL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
