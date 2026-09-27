import React from 'react';

interface DimoLogoProps {
  compact?: boolean;
  className?: string;
}

export const DimoLogo: React.FC<DimoLogoProps> = ({ compact = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Mark: Timeline node + continuous cycle path forming 'D' */}
      <div className="relative w-8 h-8 rounded-xl bg-[#EDE8D0] border border-[#C4C0AB] flex items-center justify-center shadow-[0_2px_8px_rgba(20,20,16,0.06)] shrink-0 group">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#141410]"
        >
          {/* Vertical timeline spine */}
          <line
            x1="10"
            y1="6"
            x2="10"
            y2="26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Semicircular journey / cycle path forming the loop of 'D' */}
          <path
            d="M 10 7.5 H 17 C 22.5 7.5 25.5 11 25.5 16 C 25.5 21 22.5 24.5 17 24.5 H 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#141410]"
          />

          {/* Active Waypoint Node along the timeline spine */}
          <circle
            cx="10"
            cy="16"
            r="3.5"
            className="fill-[#141410]"
          />
          <circle
            cx="10"
            cy="16"
            r="5"
            className="stroke-[#777567] stroke-[1.2] opacity-50"
          />
        </svg>
      </div>

      {/* Typography: DIMO Wordmark */}
      {!compact && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-[0.22em] text-base text-[#141410] font-sans">
              DIMO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#141410]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#777567] uppercase mt-0.5">
            JORNADA DIÁRIA
          </span>
        </div>
      )}
    </div>
  );
};
