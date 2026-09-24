import React from 'react';
import { ViewMode } from '../types';
import { Plus, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onNewActivity: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onNewActivity,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full border-b border-[#252A33] bg-[#0B0D12]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Streak */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm tracking-tighter shadow-sm">
              M
            </div>
            <span className="font-bold tracking-wider text-base sm:text-lg text-white font-mono-numbers">
              KINETIC
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181C26] border border-[#252A33] text-xs font-medium text-amber-300">
            <span>🔥</span>
            <span className="font-mono-numbers">14 DIAS SEGUIDOS</span>
          </div>
        </div>

        {/* Center: View Switcher */}
        <nav className="flex items-center gap-1 bg-[#13161D] p-1 rounded-lg border border-[#252A33]">
          <button
            onClick={() => onViewChange('timeline')}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentView === 'timeline'
                ? 'bg-[#181C26] text-white shadow-sm border border-emerald-500/30 text-emerald-400'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span className="hidden sm:inline">Timeline // Home</span>
            <span className="sm:hidden">Timeline</span>
          </button>

          <button
            onClick={() => onViewChange('checklist')}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentView === 'checklist'
                ? 'bg-[#181C26] text-white shadow-sm border border-[#252A33]'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
          >
            Checklist
          </button>

          <button
            onClick={() => onViewChange('calendar')}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentView === 'calendar'
                ? 'bg-[#181C26] text-white shadow-sm border border-[#252A33]'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
          >
            Calendário
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar efeitos táteis' : 'Ativar efeitos táteis'}
            className="p-2 rounded-lg border border-[#252A33] bg-[#13161D] text-[#8B919E] hover:text-white hover:border-[#3B4252] transition-colors"
            aria-label="Alternar som"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* New Activity CTA */}
          <button
            onClick={onNewActivity}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#0B0D12] text-xs sm:text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_22px_rgba(34,197,94,0.5)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline tracking-wider">NOVA ATIVIDADE</span>
            <span className="sm:hidden font-semibold">CRIAR</span>
            <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-emerald-600/30 rounded border border-emerald-900/40 text-emerald-950 font-bold">
              ⌘N
            </span>
          </button>

          {/* Dev Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-[#13161D] border border-[#252A33] text-[#8B919E]">
            <span className="text-emerald-400 font-bold">01</span>
            <span>DEV // 01</span>
          </div>
        </div>
      </div>
    </header>
  );
};
