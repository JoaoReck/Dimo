import React from 'react';
import { ViewMode } from '../types';
import { Plus, Volume2, VolumeX, GitCommitVertical, CheckSquare, CalendarDays } from 'lucide-react';
import { DimoLogo } from './DimoLogo';

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
    <header className="w-full border-b border-[#252A33] bg-[#0B0D12]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="shrink-0">
          <DimoLogo />
        </div>

        {/* Center: View Switcher (Sleek, responsive & fits mobile comfortably) */}
        <nav className="flex items-center gap-1 bg-[#13161D] p-1 rounded-lg border border-[#252A33] shrink-0">
          <button
            onClick={() => onViewChange('timeline')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'timeline'
                ? 'bg-[#181C26] text-white shadow-sm border border-emerald-500/30 text-emerald-400'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
            title="Timeline / Jornada"
          >
            <GitCommitVertical className={`w-3.5 h-3.5 ${currentView === 'timeline' ? 'text-emerald-400' : ''}`} />
            <span className="text-xs">Timeline</span>
          </button>

          <button
            onClick={() => onViewChange('checklist')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'checklist'
                ? 'bg-[#181C26] text-white shadow-sm border border-[#252A33]'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
            title="Checklist"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-xs">Lista</span>
            <span className="xs:hidden text-xs">Lista</span>
          </button>

          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'calendar'
                ? 'bg-[#181C26] text-white shadow-sm border border-[#252A33]'
                : 'text-[#8B919E] hover:text-[#F5F5F5]'
            }`}
            title="Calendário / Grade Diária"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Grade</span>
          </button>
        </nav>

        {/* Right: Sound toggle & New Activity CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio feedback toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar efeitos sonoros táteis' : 'Ativar efeitos táteis'}
            className="p-1.5 sm:p-2 rounded-lg border border-[#252A33] bg-[#13161D] text-[#8B919E] hover:text-white hover:border-[#3B4252] transition-colors"
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#0B0D12] text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline tracking-wider">NOVA</span>
            <span className="sm:hidden font-bold">NOVA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
