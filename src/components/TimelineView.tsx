import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { Check, Clock, Sparkles, RotateCcw, Compass, GitCommit, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  nextActivityId?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  nextActivityId,
}) => {
  // Trail style: organic winding path or vertical straight path
  const [isCurvedTrail, setIsCurvedTrail] = useState<boolean>(true);

  // Live elapsed timer for the active next step to give a live ticking presence
  const [secondsElapsed, setSecondsElapsed] = useState<number>(2535); // starts at ~42min

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (activities.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl border border-dashed border-[#252A33] bg-[#13161D]/50">
          <p className="text-[#8B919E] mb-2 font-mono text-sm">
            Nenhuma etapa cadastrada para esta jornada.
          </p>
          <p className="text-xs text-neutral-500">
            Clique em "+ NOVA" para traçar o seu caminho pelo dia.
          </p>
        </div>
      </div>
    );
  }

  const allCompleted = activities.length > 0 && activities.every((a) => a.completed);

  // Gentle horizontal offsets for the organic winding journey trail (in px relative to center)
  // Perfectly sized so nodes (96px) remain well inside mobile viewports without overflow
  const getOffset = (index: number) => {
    if (!isCurvedTrail) return 0;
    const offsets = [24, -28, 26, -24, 18, -20, 15];
    return offsets[index % offsets.length];
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-24 select-none">
      {/* Top Trail Controls: Start Marker + Trail Mode Switcher */}
      <div className="flex items-center justify-between pt-1 pb-4 px-2">
        {/* Journey Start Marker */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#13161D] border border-[#252A33] text-[10px] font-mono text-[#8B919E] uppercase tracking-wider shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22C55E]" />
          <span>INÍCIO DA JORNADA</span>
        </div>

        {/* Trail Layout Style Switcher (Curva / Reta) */}
        <button
          onClick={() => setIsCurvedTrail((prev) => !prev)}
          title="Alternar estilo visual da trilha"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13161D] hover:bg-[#181C26] border border-[#252A33] text-[10px] font-mono text-[#8B919E] hover:text-white transition-all cursor-pointer"
        >
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>{isCurvedTrail ? 'TRILHA ORGÂNICA' : 'TRILHA RETA'}</span>
        </button>
      </div>

      {/* Main Visual Journey Track */}
      <div className="relative flex flex-col items-center w-full py-2">
        {/* Initial lead-in road connector */}
        <div className="flex flex-col items-center h-8 w-full justify-center">
          <div
            className={`w-[4px] h-full rounded-full transition-all duration-500 ${
              activities[0]?.completed
                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                : 'bg-[#252A33]'
            }`}
          />
        </div>

        {activities.map((activity, index) => {
          const isCompleted = activity.completed;
          const isNext = activity.id === nextActivityId && !isCompleted;
          const isLast = index === activities.length - 1;

          const currentOffset = getOffset(index);
          const nextOffset = !isLast ? getOffset(index + 1) : 0;

          // Road connector status to the next node:
          // The road segment is illuminated in vibrant emerald green when THIS node is completed!
          const isLineToNextActive = isCompleted;

          return (
            <div key={activity.id} className="w-full flex flex-col items-center">
              {/* NODE CONTAINER (Positioned with gentle horizontal offset) */}
              <div
                className="relative z-20 flex flex-col items-center transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${currentOffset}px)`,
                }}
              >
                {/* Active Indicator Floating Badge above the node */}
                {isNext && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>PRÓXIMO PASSO</span>
                  </motion.div>
                )}

                {/* THE LARGE ACTIVITY NODE (Bolinha com título dentro) */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenDetail(activity)}
                  title="Toque para revelar o momento"
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-between p-2.5 sm:p-3 cursor-pointer transition-all duration-300 border-2 select-none group ${
                    isCompleted
                      ? 'bg-[#0b1f14] border-emerald-500 text-emerald-300 shadow-[0_0_24px_rgba(34,197,94,0.35)] hover:border-emerald-400'
                      : isNext
                      ? 'bg-[#13161D] border-emerald-400 text-white shadow-[0_0_35px_rgba(34,197,94,0.4)] ring-4 ring-emerald-500/25 ring-offset-2 ring-offset-[#0B0D12]'
                      : 'bg-[#13161D] border-[#252A33] text-[#D0D4DC] shadow-lg shadow-black/40 hover:border-[#3B4252] hover:bg-[#181C26]'
                  }`}
                >
                  {/* Top: Time in crisp monospace font */}
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-wider ${
                        isNext
                          ? 'text-emerald-400'
                          : isCompleted
                          ? 'text-emerald-400/90'
                          : 'text-[#8B919E] group-hover:text-white transition-colors'
                      }`}
                    >
                      {activity.startTime}
                    </span>
                  </div>

                  {/* Center: Main Activity Title (Inside the Node) */}
                  <div className="w-full flex-1 flex items-center justify-center px-1 text-center min-w-0">
                    <span
                      className={`font-black uppercase tracking-tight line-clamp-2 leading-tight ${
                        activity.title.length > 9
                          ? 'text-[11px] sm:text-xs font-extrabold'
                          : 'text-xs sm:text-sm'
                      } ${
                        isNext
                          ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                          : isCompleted
                          ? 'text-emerald-100 font-bold'
                          : 'text-[#D0D4DC] group-hover:text-white transition-colors'
                      }`}
                    >
                      {activity.title}
                    </span>
                  </div>

                  {/* Bottom: Status Pill / Indicator inside node */}
                  <div className="mt-0.5 flex items-center justify-center">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-semibold">
                        <Check className="w-3 h-3 stroke-[3] text-emerald-400" />
                        <span>FEITO</span>
                      </div>
                    ) : isNext ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>AGORA</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-[#6A7280] group-hover:text-[#8B919E] transition-colors">
                        <span className="w-1 h-1 rounded-full bg-[#3B4252]" />
                        <span className="text-[9px]">ETAPA</span>
                      </div>
                    )}
                  </div>

                  {/* Quick-toggle action target on top-right badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(activity.id, e);
                    }}
                    title={isCompleted ? 'Reabrir etapa' : 'Marcar como concluída'}
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-[#0B0D12] shadow-[0_0_8px_rgba(34,197,94,0.6)] hover:scale-110'
                        : isNext
                        ? 'bg-[#181C26] border-emerald-400/80 text-emerald-400 hover:bg-emerald-500 hover:text-[#0B0D12] hover:scale-110'
                        : 'bg-[#181C26] border-[#252A33] text-[#8B919E] hover:border-emerald-500 hover:text-emerald-400 hover:scale-110'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-current" />
                    )}
                  </button>
                </motion.div>

                {/* ACTIVE STEP DIRECT ACTIONS: One-click Advance Button & Live Timer */}
                {isNext && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2.5 flex flex-col items-center gap-1.5 z-30"
                  >
                    {/* Quick Complete Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(activity.id, e);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#0B0D12] text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_18px_rgba(34,197,94,0.4)] cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>CONCLUIR PASSO</span>
                      <span className="hidden sm:inline opacity-70 text-[10px] font-normal">
                        (ESPAÇO)
                      </span>
                    </motion.button>

                    {/* Live Stopwatch & Moment Peek Trigger */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#8B919E]">
                      <span className="flex items-center gap-1 text-emerald-400/90 font-semibold">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {formatTimer(secondsElapsed)}
                      </span>
                      <span>•</span>
                      <button
                        onClick={() => onOpenDetail(activity)}
                        className="hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Ver momento
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Subtitle / hint on completed nodes */}
                {isCompleted && (
                  <button
                    onClick={() => onOpenDetail(activity)}
                    className="mt-1.5 text-[10px] font-mono text-[#8B919E] hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{activity.completedAt ? `Concluído ${activity.completedAt}` : 'Concluído'}</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                )}

                {/* Hint on pending nodes */}
                {!isCompleted && !isNext && (
                  <button
                    onClick={() => onOpenDetail(activity)}
                    className="mt-1 text-[10px] font-mono text-[#6A7280] hover:text-[#C5CAD3] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Toque para detalhes</span>
                  </button>
                )}
              </div>

              {/* ROAD CONNECTOR TO NEXT NODE */}
              {!isLast && (
                <div className="w-full flex items-center justify-center my-1 pointer-events-none">
                  {isCurvedTrail ? (
                    /* Organic Bezier Curve SVG linking node i to node i+1 */
                    <svg
                      className="w-48 h-14 overflow-visible"
                      viewBox="0 0 192 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Road Track */}
                      <path
                        d={`M ${96 + currentOffset} 0 C ${96 + currentOffset} 28, ${
                          96 + nextOffset
                        } 28, ${96 + nextOffset} 56`}
                        stroke="#252A33"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Dashed Center Guide Line */}
                      <path
                        d={`M ${96 + currentOffset} 0 C ${96 + currentOffset} 28, ${
                          96 + nextOffset
                        } 28, ${96 + nextOffset} 56`}
                        stroke="#181C26"
                        strokeWidth="1.5"
                        strokeDasharray="3 4"
                        strokeLinecap="round"
                      />
                      {/* Luminous Active Completed Path */}
                      {isLineToNextActive && (
                        <path
                          d={`M ${96 + currentOffset} 0 C ${96 + currentOffset} 28, ${
                            96 + nextOffset
                          } 28, ${96 + nextOffset} 56`}
                          stroke="#22C55E"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="transition-all duration-700"
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.7))',
                          }}
                        />
                      )}
                    </svg>
                  ) : (
                    /* Straight Spine Line */
                    <div className="flex flex-col items-center h-12 w-full justify-center">
                      <div
                        className={`w-[4px] h-full rounded-full transition-all duration-500 ${
                          isLineToNextActive
                            ? 'bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                            : 'bg-[#252A33]'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Final Journey Milestone Marker */}
        <div className="w-full flex flex-col items-center pt-2">
          {/* Connector to end */}
          <div className="flex flex-col items-center h-8 w-full justify-center">
            <div
              className={`w-[4px] h-full rounded-full transition-all duration-500 ${
                allCompleted
                  ? 'bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  : 'bg-[#252A33]'
              }`}
            />
          </div>

          <motion.div
            layout
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border transition-all shadow-md ${
              allCompleted
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]'
                : 'bg-[#13161D] border-[#252A33] text-[#8B919E]'
            }`}
          >
            {allCompleted ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-bold tracking-wider">FASE COMPLETA // PARABÉNS!</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#252A33]" />
                <span>FIM DO CICLO DIÁRIO</span>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
