import React from 'react';
import { X, Share2, PlusSquare, CheckCircle2, Smartphone, ArrowDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdded: () => void;
  isIOS: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onConfirmAdded,
  isIOS,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#141410]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FAF8F0] border border-[#C4C0AB] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Top Bar / Drag Handle for Mobile */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-12 h-1.5 rounded-full bg-[#C4C0AB]" />
          </div>

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#C4C0AB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] flex items-center justify-center text-[#141410]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#777567] font-semibold tracking-wider uppercase">
                  DIMO // WEB APP
                </span>
                <span className="text-sm font-bold text-[#141410] tracking-tight">
                  Adicionar à Tela de Início
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 transition-colors cursor-pointer"
              aria-label="Fechar guia"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#545248] leading-relaxed">
              {isIOS ? (
                <>
                  No iPhone, você pode transformar o Dimo em um aplicativo direto na sua tela inicial em 3 toques rápidos:
                </>
              ) : (
                <>
                  Adicione o Dimo à sua tela inicial para acessá-lo como um aplicativo, sem barras de navegação:
                </>
              )}
            </p>

            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EDE8D0] border border-[#C4C0AB]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F0] border border-[#C4C0AB] flex items-center justify-center shrink-0 text-[#141410]">
                {isIOS ? (
                  /* Safari Share Icon representation: box with arrow up */
                  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                ) : (
                  <span className="text-xs font-mono font-bold">1</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#141410] uppercase tracking-wider">
                    PASSO 1
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#141410] mt-0.5">
                  {isIOS ? 'Toque em Compartilhar' : 'Abra o menu do navegador'}
                </h4>
                <p className="text-xs text-[#777567] mt-1 leading-normal">
                  {isIOS ? (
                    <>
                      Na barra inferior do Safari, toque no ícone{' '}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FAF8F0] text-[#141410] border border-[#C4C0AB] font-mono text-[11px]">
                        Compartilhar <Share2 className="w-3 h-3 ml-1 inline text-[#141410]" />
                      </span>
                    </>
                  ) : (
                    'Toque nos três pontos [ ⋮ ] no canto do navegador.'
                  )}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EDE8D0] border border-[#C4C0AB]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F0] border border-[#C4C0AB] flex items-center justify-center shrink-0 text-[#141410]">
                {isIOS ? (
                  /* Plus Square icon representation */
                  <PlusSquare className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-mono font-bold">2</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#141410] uppercase tracking-wider">
                    PASSO 2
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#141410] mt-0.5">
                  Escolha "Adicionar à Tela de Início"
                </h4>
                <p className="text-xs text-[#777567] mt-1 leading-normal">
                  Role o menu de opções para baixo e selecione{' '}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FAF8F0] text-[#141410] border border-[#C4C0AB] font-mono text-[11px]">
                    + Adicionar à Tela de Início
                  </span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EDE8D0] border border-[#C4C0AB]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F0] border border-[#C4C0AB] flex items-center justify-center shrink-0 text-[#141410]">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#141410] uppercase tracking-wider">
                    PASSO 3
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#141410] mt-0.5">
                  Toque em "Adicionar"
                </h4>
                <p className="text-xs text-[#777567] mt-1 leading-normal">
                  No canto superior direito. O ícone do Dimo será criado na sua tela inicial e abrirá diretamente em modo aplicativo.
                </p>
              </div>
            </div>

            {/* Visual Indicator of Safari Toolbar */}
            {isIOS && (
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#EDE8D0] border border-[#C4C0AB] text-[#141410] text-xs font-mono text-center">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce shrink-0 text-[#141410]" />
                <span>Procure pelo botão de compartilhar na barra do Safari</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            className="p-4 sm:p-5 border-t border-[#C4C0AB] bg-[#EDE8D0] flex flex-col gap-2"
            style={{ paddingBottom: 'max(1.25rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))' }}
          >
            <button
              onClick={onConfirmAdded}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141410] hover:bg-[#33312B] text-[#EDE8D0] font-mono font-bold text-xs sm:text-sm tracking-wider transition-all shadow-[0_2px_10px_rgba(20,20,16,0.15)] cursor-pointer"
            >
              <span>ADICIONEI NA TELA INICIAL</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-mono text-[#777567] hover:text-[#141410] transition-colors cursor-pointer"
            >
              Voltar para o Dimo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
