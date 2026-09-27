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
    <div className="w-full border-b border-[#C4C0AB]/60 select-none">
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Main Tab Navigation: Distributed across full width with equal touch areas */}
        <nav
          className="w-full grid grid-cols-3 gap-2 sm:gap-3 items-center"
          aria-label="Modo de visualização"
        >
          {/* Tab 1: Timeline (24h) */}
          <button
            type="button"
            onClick={() => onViewChange('timeline')}
            title="Timeline (24h)"
            aria-label="Timeline 24 horas"
            className={`w-full h-11 sm:h-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer relative group ${
              currentView === 'timeline'
                ? 'bg-[#141410] text-[#EDE8D0] border border-[#141410] shadow-[0_2px_10px_rgba(20,20,16,0.18)]'
                : 'text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 border border-transparent'
            }`}
          >
            <GitCommitVertical
              className={`w-5 h-5 transition-transform ${
                currentView === 'timeline' ? 'stroke-[2.4] scale-105 text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'timeline' && (
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EDE8D0]" />
            )}
          </button>

          {/* Tab 2: Checklist */}
          <button
            type="button"
            onClick={() => onViewChange('checklist')}
            title="Checklist"
            aria-label="Checklist de atividades"
            className={`w-full h-11 sm:h-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer relative group ${
              currentView === 'checklist'
                ? 'bg-[#141410] text-[#EDE8D0] border border-[#141410] shadow-[0_2px_10px_rgba(20,20,16,0.18)]'
                : 'text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 border border-transparent'
            }`}
          >
            <CheckSquare
              className={`w-5 h-5 transition-transform ${
                currentView === 'checklist' ? 'stroke-[2.4] scale-105 text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'checklist' && (
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EDE8D0]" />
            )}
          </button>

          {/* Tab 3: Calendário */}
          <button
            type="button"
            onClick={() => onViewChange('calendar')}
            title="Grade Diária"
            aria-label="Grade diária"
            className={`w-full h-11 sm:h-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer relative group ${
              currentView === 'calendar'
                ? 'bg-[#141410] text-[#EDE8D0] border border-[#141410] shadow-[0_2px_10px_rgba(20,20,16,0.18)]'
                : 'text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 border border-transparent'
            }`}
          >
            <CalendarDays
              className={`w-5 h-5 transition-transform ${
                currentView === 'calendar' ? 'stroke-[2.4] scale-105 text-[#EDE8D0]' : 'stroke-[2]'
              }`}
            />
            {currentView === 'calendar' && (
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EDE8D0]" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
