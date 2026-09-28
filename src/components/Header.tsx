import React from 'react';
import { ViewMode } from '../types';
import { GitCommitVertical, CheckSquare, CalendarDays } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  showInstallOption?: boolean;
  onInstallClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="w-full border-b border-[#C4C0AB]/70 select-none bg-[#EDE8D0]">
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Main Tab Navigation: Distributed across full width with equal, generous touch areas */}
        <nav
          className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 items-center"
          aria-label="Navegação Principal"
        >
          {/* Tab 1: Timeline (24h) */}
          <button
            type="button"
            onClick={() => onViewChange('timeline')}
            title="Timeline / Jornada do Dia"
            aria-label="Timeline 24 horas"
            className={`w-full h-12 sm:h-13 flex flex-col items-center justify-center rounded-2xl cursor-pointer relative group transition-all duration-150 active:scale-[0.98] ${
              currentView === 'timeline'
                ? 'bg-[#141410] text-[#EDE8D0] border-2 border-[#141410] shadow-[0_2px_8px_rgba(20,20,16,0.18)]'
                : 'text-[#545248] hover:text-[#141410] hover:bg-[#C4C0AB]/50 border-2 border-transparent'
            }`}
          >
            <GitCommitVertical
              className={`w-5.5 h-5.5 sm:w-6 sm:h-6 crisp-nav-icon ${
                currentView === 'timeline' ? 'stroke-[2.4] text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'timeline' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#EDE8D0] mt-0.5" />
            )}
          </button>

          {/* Tab 2: Checklist */}
          <button
            type="button"
            onClick={() => onViewChange('checklist')}
            title="Checklist de Atividades"
            aria-label="Checklist de atividades"
            className={`w-full h-12 sm:h-13 flex flex-col items-center justify-center rounded-2xl cursor-pointer relative group transition-all duration-150 active:scale-[0.98] ${
              currentView === 'checklist'
                ? 'bg-[#141410] text-[#EDE8D0] border-2 border-[#141410] shadow-[0_2px_8px_rgba(20,20,16,0.18)]'
                : 'text-[#545248] hover:text-[#141410] hover:bg-[#C4C0AB]/50 border-2 border-transparent'
            }`}
          >
            <CheckSquare
              className={`w-5.5 h-5.5 sm:w-6 sm:h-6 crisp-nav-icon ${
                currentView === 'checklist' ? 'stroke-[2.4] text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'checklist' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#EDE8D0] mt-0.5" />
            )}
          </button>

          {/* Tab 3: Calendário */}
          <button
            type="button"
            onClick={() => onViewChange('calendar')}
            title="Grade Diária"
            aria-label="Grade diária"
            className={`w-full h-12 sm:h-13 flex flex-col items-center justify-center rounded-2xl cursor-pointer relative group transition-all duration-150 active:scale-[0.98] ${
              currentView === 'calendar'
                ? 'bg-[#141410] text-[#EDE8D0] border-2 border-[#141410] shadow-[0_2px_8px_rgba(20,20,16,0.18)]'
                : 'text-[#545248] hover:text-[#141410] hover:bg-[#C4C0AB]/50 border-2 border-transparent'
            }`}
          >
            <CalendarDays
              className={`w-5.5 h-5.5 sm:w-6 sm:h-6 crisp-nav-icon ${
                currentView === 'calendar' ? 'stroke-[2.4] text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'calendar' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#EDE8D0] mt-0.5" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
