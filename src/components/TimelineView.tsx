import React, { useEffect, useRef, useCallback } from 'react';
import { Activity, RpgIconId } from '../types';
import { Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { RpgIcon, inferRpgIcon } from './RpgIcon';

interface TimelineViewProps {
  activities: Activity[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onOpenDetail: (activity: Activity) => void;
  onNewActivity: (suggestedTitle?: string, suggestedTime?: string) => void;
  nextActivityId?: string;
  isToday?: boolean;
  currentOffset?: number;
  centerKey?: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onToggleComplete,
  onOpenDetail,
  onNewActivity,
  nextActivityId,
  isToday = false,
  currentOffset = 0,
  centerKey = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentHourRef = useRef<HTMLDivElement | null>(null);
  const currentHour = new Date().getHours();

  // Scroll internally to current hour without moving window or header
  const scrollToCurrentHour = useCallback((smooth: boolean = true) => {
    const container = containerRef.current;
    const target = currentHourRef.current;
    if (container && target) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      const targetHeight = targetRect.height || 48;
      const containerHeight = container.clientHeight;

      const scrollToY = Math.max(
        0,
        relativeTop - (containerHeight / 2) + (targetHeight / 2)
      );

      container.scrollTo({
        top: scrollToY,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // Center on current hour when viewing Today, on mount, or when user taps "Hoje"
  useEffect(() => {
    if (isToday) {
      const timer = setTimeout(() => {
        scrollToCurrentHour(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isToday, centerKey, scrollToCurrentHour]);

  // Reset scroll to top of the 24-hour day when viewing another day
  useEffect(() => {
    if (!isToday && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [isToday, currentOffset]);

  // Hours 0 through 23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Group activities by starting hour
  const getActivitiesForHour = (h: number): Activity[] => {
    return activities
      .filter((a) => {
        const actHour = parseInt(a.startTime.split(':')[0], 10);
        return actHour === h;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // State: Currently selected empty hour showing the official Dimo sword (creation waypoint)
  const [selectedEmptyHour, setSelectedEmptyHour] = React.useState<number | null>(() => {
    return isToday ? currentHour : 8;
  });

  // Keep selected empty hour updated when date changes
  useEffect(() => {
    setSelectedEmptyHour(isToday ? currentHour : 8);
  }, [currentOffset, isToday, currentHour]);

  // Handler for clicking on an empty hour
  const handleEmptyHourClick = (hour: number, hourStr: string) => {
    if (selectedEmptyHour === hour) {
      // Already selected with the Dimo sword: open creation flow!
      onNewActivity(undefined, hourStr);
    } else {
      // Move the Dimo sword to this newly selected hour
      setSelectedEmptyHour(hour);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain select-none pb-28 pt-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4">
        {/* 24-Hour Vertical Continuous Journey */}
        <div className="relative py-2">
          {hours.map((hour) => {
            const hourStr = `${String(hour).padStart(2, '0')}:00`;
            const hourActivities = getActivitiesForHour(hour);
            const hasActivities = hourActivities.length > 0;
            const isCurrentHour = isToday && hour === currentHour;
            const isPastHour = isToday && hour < currentHour;

            // Empty hour selection state
            const isSelectedEmpty = !hasActivities && selectedEmptyHour === hour;

            // Activity states
            const hasNextActivity = hourActivities.some(
              (a) => a.id === nextActivityId && !a.completed
            );
            const allCompletedInHour =
              hasActivities && hourActivities.every((a) => a.completed);
            const someCompleted =
              hasActivities && hourActivities.some((a) => a.completed);

            return (
              <div
                key={hour}
                ref={isCurrentHour ? currentHourRef : undefined}
                className={`relative flex ${
                  hasActivities && hourActivities.length > 1
                    ? 'items-start pt-2.5 pb-3 sm:pt-3 sm:pb-3.5'
                    : 'items-center py-2 sm:py-2.5'
                } gap-2.5 sm:gap-3.5 transition-colors duration-200 rounded-2xl ${
                  isCurrentHour ? 'bg-[#C4C0AB]/25' : ''
                }`}
              >
                {/* 1. Left Time Marker (clean monospace anchor along the journey path) */}
                <div
                  onClick={() => !hasActivities && handleEmptyHourClick(hour, hourStr)}
                  className={`w-12 sm:w-14 shrink-0 text-right font-mono text-[11px] sm:text-xs transition-colors cursor-pointer select-none ${
                    hasActivities && hourActivities.length > 1 ? 'pt-2.5' : ''
                  } ${
                    isCurrentHour
                      ? 'text-[#141410] font-bold'
                      : isPastHour
                      ? 'text-[#9D9988]'
                      : 'text-[#777567] hover:text-[#141410]'
                  }`}
                  title={hasActivities ? hourStr : `Selecionar ${hourStr}`}
                >
                  <span className="font-mono-numbers">{hourStr}</span>
                  {isCurrentHour && (
                    <span className="block text-[9px] tracking-wider text-[#141410] font-bold uppercase leading-none mt-1">
                      AGORA
                    </span>
                  )}
                </div>

                {/* 2. Journey Waypoint Node (Substantial Gamified Milestone + Connected Spine Trail) */}
                <div
                  className={`relative w-14 sm:w-16 shrink-0 flex items-center justify-center self-stretch ${
                    hasActivities && hourActivities.length > 1 ? 'pt-1.5' : ''
                  }`}
                >
                  {/* Vertical Spine Trail (Segment precisely centered behind the milestone) */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[3px] bg-[#C4C0AB] transition-colors duration-300 ${
                      hour === 0 ? 'top-1/2 rounded-t-full' : 'top-0'
                    } ${hour === 23 ? 'bottom-1/2 rounded-b-full' : 'bottom-0'}`}
                    aria-hidden="true"
                  />

                  {/* Active progress trail along the spine for Today up to current hour */}
                  {isToday && hour <= currentHour && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-[3px] bg-[#141410] transition-all duration-300 ${
                        hour === 0 ? 'top-1/2 rounded-t-full' : 'top-0'
                      } ${
                        hour === currentHour ? 'bottom-1/2' : 'bottom-0'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {hasActivities ? (
                    (() => {
                      const primaryActivity =
                        hourActivities.find((a) => !a.completed) || hourActivities[0];
                      const primaryIcon: RpgIconId =
                        primaryActivity.icon ||
                        inferRpgIcon(primaryActivity.title, primaryActivity.category);

                      return (
                        <button
                          type="button"
                          onClick={() => {
                            if (hourActivities.length === 1) {
                              onOpenDetail(hourActivities[0]);
                            }
                          }}
                          className={`group rounded-full transition-all duration-200 ease-out flex items-center justify-center cursor-pointer relative z-10 select-none hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.96] active:translate-y-0 ${
                            allCompletedInHour
                              ? 'w-13.5 h-13.5 sm:w-14 sm:h-14 bg-[#141410] border border-[#141410] shadow-xs'
                              : isCurrentHour
                              ? 'w-16 h-16 sm:w-[68px] sm:h-[68px] bg-[#FAF8F0] border-2 border-[#141410] ring-2 ring-[#141410] ring-offset-2 ring-offset-[#EDE8D0] shadow-xs'
                              : hasNextActivity
                              ? 'w-14 h-14 sm:w-15 sm:h-15 bg-[#FAF8F0] border-2 border-[#141410] ring-2 ring-[#141410]/20 ring-offset-1 ring-offset-[#EDE8D0] shadow-xs'
                              : someCompleted
                              ? 'w-13.5 h-13.5 sm:w-14 sm:h-14 bg-[#545248] border border-[#33312B] shadow-xs'
                              : 'w-13.5 h-13.5 sm:w-14 sm:h-14 bg-[#FAF8F0] border border-[#C4C0AB] hover:border-[#141410] shadow-xs'
                          }`}
                          title={`${hourActivities.length} atividade(s) às ${hourStr}`}
                          aria-label={`${hourActivities.length} atividade(s) às ${hourStr}`}
                        >
                          {/* RPG Pixel-art item icon with Clint Hess microinteraction */}
                          <div className="transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5">
                            <RpgIcon
                              icon={primaryIcon}
                              size={isCurrentHour ? 28 : hasNextActivity ? 25 : 23}
                              variant={
                                allCompletedInHour || someCompleted
                                  ? 'completed'
                                  : isPastHour
                                  ? 'muted'
                                  : 'default'
                              }
                            />
                          </div>

                          {/* Discrete check badge at bottom-right corner when completed */}
                          {allCompletedInHour && (
                            <span
                              className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#FAF8F0] border border-[#141410] text-[#141410] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110"
                              title="Etapa concluída"
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            </span>
                          )}

                          {/* Multiple activities counter badge at top-right */}
                          {hourActivities.length > 1 && (
                            <span
                              className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#141410] text-[#EDE8D0] text-[9px] font-mono font-bold leading-none border border-[#FAF8F0] shadow-xs"
                              title={`${hourActivities.length} atividades neste horário`}
                            >
                              +{hourActivities.length - 1}
                            </span>
                          )}
                        </button>
                      );
                    })()
                  ) : isSelectedEmpty ? (
                    /* Selected Empty Hour with Official Dimo Sword (Clint Hess Microinteraction: ready to create) */
                    <button
                      type="button"
                      onClick={() => handleEmptyHourClick(hour, hourStr)}
                      title={`Horário selecionado (${hourStr}) — Toque para criar atividade`}
                      className="group w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#FAF8F0] border-2 border-[#141410] ring-2 ring-[#141410]/25 ring-offset-2 ring-offset-[#EDE8D0] shadow-xs cursor-pointer flex items-center justify-center relative z-10 transition-all duration-200 hover:scale-[1.06] hover:-translate-y-0.5 active:scale-[0.96] active:translate-y-0 select-none"
                      aria-label={`Horário selecionado (${hourStr}) — Toque para criar atividade`}
                    >
                      {/* Official Dimo RPG Chromatic Sword Asset */}
                      <img
                        src="/icone4.png"
                        alt="Dimo Espada"
                        width={32}
                        height={32}
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain pixel-crisp pointer-events-none transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
                      />
                    </button>
                  ) : (
                    /* Normal Unselected Empty Hour Waypoint (calm, clean, transitions to sword on click) */
                    <button
                      type="button"
                      onClick={() => handleEmptyHourClick(hour, hourStr)}
                      title={`Selecionar ${hourStr} para adicionar atividade`}
                      className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full border border-[#C4C0AB] bg-[#FAF8F0]/70 hover:border-[#141410] hover:bg-[#FAF8F0] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group flex items-center justify-center relative z-10 select-none shadow-xs"
                      aria-label={`Selecionar ${hourStr}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4C0AB] group-hover:bg-[#141410] transition-colors" />
                      <Plus className="w-3.5 h-3.5 stroke-[2.5] hidden group-hover:block text-[#141410] transition-transform group-hover:scale-110 absolute" />
                    </button>
                  )}
                </div>

                {/* 3. Right Content: Compact Journey Steps (Passos do Dia) */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {hasActivities ? (
                    <div className="space-y-2 w-full">
                      {hourActivities.map((act) => {
                        const isCompleted = act.completed;
                        const isNext = act.id === nextActivityId && !isCompleted;
                        const actIcon: RpgIconId =
                          act.icon || inferRpgIcon(act.title, act.category);

                        return (
                          <motion.div
                            key={act.id}
                            layout
                            onClick={() => onOpenDetail(act)}
                            className={`group w-full py-2.5 px-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 hover:-translate-y-0.5 active:scale-[0.985] active:translate-y-0 ${
                              isCompleted
                                ? 'bg-[#FAF8F0]/70 border-[#C4C0AB] text-[#777567] hover:border-[#9D9988]'
                                : isNext
                                ? 'bg-[#FAF8F0] border-2 border-[#141410] shadow-[0_2px_8px_rgba(20,20,16,0.06)] text-[#141410]'
                                : isCurrentHour
                                ? 'bg-[#FAF8F0] border border-[#141410] text-[#141410] shadow-xs'
                                : 'bg-[#FAF8F0] border border-[#C4C0AB] hover:border-[#141410] text-[#33312B]'
                            }`}
                          >
                            {/* Checkmark button + RPG Icon + Title */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(act.id, e);
                                }}
                                title={
                                  isCompleted
                                    ? 'Reabrir atividade'
                                    : 'Concluir atividade'
                                }
                                className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer hover:scale-105 active:scale-90 ${
                                  isCompleted
                                    ? 'bg-[#141410] text-[#EDE8D0] shadow-xs'
                                    : isNext
                                    ? 'border-2 border-[#141410] text-[#141410] bg-[#C4C0AB]/40 hover:bg-[#141410] hover:text-[#EDE8D0]'
                                    : 'border border-[#9D9988] text-transparent hover:border-[#141410] hover:text-[#141410]'
                                }`}
                                aria-label={
                                  isCompleted
                                    ? 'Marcar como não concluída'
                                    : 'Marcar como concluída'
                                }
                              >
                                {isCompleted && (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                )}
                              </button>

                              {/* Subtle RPG Item Icon inside the activity card */}
                              <div className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                <RpgIcon
                                  icon={actIcon}
                                  size={18}
                                  variant={isCompleted ? 'muted' : 'default'}
                                />
                              </div>

                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                  className={`text-xs sm:text-sm font-semibold truncate ${
                                    isCompleted
                                      ? 'line-through text-[#777567]'
                                      : isNext || isCurrentHour
                                      ? 'text-[#141410] font-bold'
                                      : 'text-[#33312B]'
                                  }`}
                                >
                                  {act.title}
                                </span>

                                {isNext && (
                                  <span className="hidden xs:inline-flex items-center text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#141410] text-[#EDE8D0] border border-[#141410] font-bold shrink-0 shadow-xs">
                                    PRÓXIMO
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Exact Time & Optional Category */}
                            <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono font-mono-numbers">
                              <span
                                className={`${
                                  isNext || isCurrentHour
                                    ? 'text-[#141410] font-bold'
                                    : isCompleted
                                    ? 'text-[#777567]'
                                    : 'text-[#545248]'
                                }`}
                              >
                                {act.startTime}
                                {act.endTime ? ` – ${act.endTime}` : ''}
                              </span>

                              {act.category && (
                                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#EDE8D0] text-[#545248] border border-[#C4C0AB]">
                                  {act.category}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty Hour placeholder: clean, calm, click to schedule */
                    <div
                      onClick={() => {
                        setSelectedEmptyHour(hour);
                        onNewActivity(undefined, hourStr);
                      }}
                      className={`w-full py-2 px-2.5 rounded-xl transition-all duration-200 cursor-pointer group flex items-center justify-between ${
                        isSelectedEmpty
                          ? 'bg-[#C4C0AB]/30 border border-[#141410]/20'
                          : 'hover:bg-[#C4C0AB]/25'
                      }`}
                    >
                      <span className="text-[11px] font-mono text-[#777567] group-hover:text-[#141410] transition-colors flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#545248] group-hover:rotate-90 transition-transform duration-200" />
                        <span>{isSelectedEmpty ? `Criar atividade às ${hourStr}` : `Adicionar às ${hourStr}`}</span>
                      </span>

                      <span className="text-[11px] font-mono text-[#9D9988] opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
