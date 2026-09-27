/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, ViewMode, DayOffset } from './types';
import { DEMO_SAMPLE_ACTIVITIES } from './data/mockActivities';
import {
  loadSavedActivities,
  saveActivitiesToStorage,
  getDynamicDayInfo,
} from './utils/storage';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { TimelineView } from './components/TimelineView';
import { ChecklistView } from './components/ChecklistView';
import { CalendarView } from './components/CalendarView';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { ActivityFormModal } from './components/ActivityFormModal';
import { FooterBar } from './components/FooterBar';
import { InstallBanner } from './components/InstallBanner';
import { InstallGuideModal } from './components/InstallGuideModal';
import { useMobilePWA } from './utils/useMobilePWA';
import {
  playStepCompleteSound,
  playStepReopenSound,
  playTickSound,
  setAudioEnabled,
} from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('timeline');
  const [currentOffset, setCurrentOffset] = useState<DayOffset>(0);

  // Mobile Web App / PWA install flow & standalone detection
  const pwa = useMobilePWA();

  // Initialize from persistent localStorage (defaults to zero fake activities on fresh start)
  const [activitiesByDay, setActivitiesByDay] = useState<Record<DayOffset, Activity[]>>(() => {
    return loadSavedActivities();
  });

  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivityPrefillTitle, setNewActivityPrefillTitle] = useState<string>('');
  const [newActivityPrefillTime, setNewActivityPrefillTime] = useState<string | undefined>(undefined);
  const [centerKey, setCenterKey] = useState<number>(0);

  // Prevent whole-window scrolling, keep scroll restoration manual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Sync to localStorage on every change so user never loses their real routine
  useEffect(() => {
    saveActivitiesToStorage(activitiesByDay);
  }, [activitiesByDay]);

  // Sync sound settings with audio utility
  const handleToggleSound = useCallback(() => {
    const next = !soundActive;
    setSoundActive(next);
    setAudioEnabled(next);
    if (next) playTickSound();
  }, [soundActive]);

  // Real dynamic calendar day info
  const currentDayInfo = useMemo(() => {
    return getDynamicDayInfo(currentOffset);
  }, [currentOffset]);

  // Activities sorted by time for the active day
  const currentActivities = useMemo(() => {
    const list = activitiesByDay[currentOffset] || [];
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [activitiesByDay, currentOffset]);

  // Next activity to do (first non-completed activity)
  const nextActivity = useMemo(() => {
    return currentActivities.find((a) => !a.completed);
  }, [currentActivities]);

  const nextActivityIndex = useMemo(() => {
    return currentActivities.findIndex((a) => !a.completed);
  }, [currentActivities]);

  const totalActivities = currentActivities.length;
  const completedActivities = currentActivities.filter((a) => a.completed).length;
  const allCompleted = totalActivities > 0 && completedActivities === totalActivities;

  // Daily missions calculation (0 to 3) for the active day
  const dailyMissionsCompleted = useMemo(() => {
    let count = 0;
    // 1. Planejar: pelo menos 1 atividade criada para o dia
    if (totalActivities > 0) count++;
    // 2. Foco: pelo menos 1 atividade concluída
    if (completedActivities >= 1) count++;
    // 3. Constância: concluir 3 atividades (ou todas se houver pelo menos 2)
    if (
      completedActivities >= 3 ||
      (totalActivities >= 2 && completedActivities === totalActivities)
    ) {
      count++;
    }
    return Math.min(3, count);
  }, [totalActivities, completedActivities]);

  // Toggle completion of an activity
  const handleToggleComplete = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      setActivitiesByDay((prev) => {
        const dayList = prev[currentOffset] || [];
        const target = dayList.find((item) => item.id === id);
        if (!target) return prev;

        const willBeCompleted = !target.completed;
        if (willBeCompleted) {
          playStepCompleteSound();
        } else {
          playStepReopenSound();
        }

        const now = new Date();
        const timeFormatted = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const updatedList = dayList.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              completed: willBeCompleted,
              completedAt: willBeCompleted ? timeFormatted : undefined,
            };
          }
          return item;
        });

        // Also update selectedActivity in modal if currently open
        if (selectedActivity && selectedActivity.id === id) {
          setSelectedActivity({
            ...selectedActivity,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? timeFormatted : undefined,
          });
        }

        return {
          ...prev,
          [currentOffset]: updatedList,
        };
      });
    },
    [currentOffset, selectedActivity]
  );

  // Open modal to create new activity with smart contextual defaults
  const handleOpenNewActivity = useCallback(
    (suggestedTitle?: string, suggestedTime?: string) => {
      playTickSound();
      setEditingActivity(null);
      setNewActivityPrefillTitle(suggestedTitle || '');

      if (suggestedTime) {
        setNewActivityPrefillTime(suggestedTime);
      } else {
        const list = activitiesByDay[currentOffset] || [];
        if (list.length > 0) {
          const sorted = [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
          const last = sorted[sorted.length - 1];
          if (last.endTime) {
            setNewActivityPrefillTime(last.endTime);
          } else {
            const [h, m] = last.startTime.split(':').map(Number);
            const nextH = Math.min(h + 1, 23);
            setNewActivityPrefillTime(`${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
          }
        } else {
          const now = new Date();
          const currentH = String(now.getHours()).padStart(2, '0');
          setNewActivityPrefillTime(`${currentH}:00`);
        }
      }

      setIsFormOpen(true);
    },
    [activitiesByDay, currentOffset]
  );

  // Save (Create or Update) activity
  const handleSaveActivity = useCallback(
    (data: {
      id?: string;
      title: string;
      startTime: string;
      endTime?: string;
      description?: string;
      category?: string;
    }) => {
      playTickSound();

      let duration = '45 min';
      if (data.startTime && data.endTime) {
        const [h1, m1] = data.startTime.split(':').map(Number);
        const [h2, m2] = data.endTime.split(':').map(Number);
        const diffMinutes = h2 * 60 + m2 - (h1 * 60 + m1);
        if (diffMinutes > 0) {
          const hrs = Math.floor(diffMinutes / 60);
          const mins = diffMinutes % 60;
          duration =
            hrs > 0 && mins > 0
              ? `${hrs}h ${mins}min`
              : hrs > 0
              ? `${hrs}h 00min`
              : `${mins} min`;
        }
      }

      setActivitiesByDay((prev) => {
        const currentList = prev[currentOffset] || [];

        if (data.id) {
          // Editing existing activity
          const updated = currentList.map((item) => {
            if (item.id === data.id) {
              return {
                ...item,
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                description: data.description,
                category: data.category,
                duration,
              };
            }
            return item;
          });
          return { ...prev, [currentOffset]: updated };
        } else {
          // Creating new activity
          const newActivity: Activity = {
            id: `act-${Date.now()}`,
            title: data.title,
            startTime: data.startTime,
            endTime: data.endTime,
            description: data.description,
            category: data.category || 'Rotina',
            completed: false,
            duration,
          };
          return {
            ...prev,
            [currentOffset]: [...currentList, newActivity],
          };
        }
      });

      setEditingActivity(null);
    },
    [currentOffset]
  );

  // Delete activity
  const handleDeleteActivity = useCallback(
    (id: string) => {
      playTickSound();
      setActivitiesByDay((prev) => {
        const currentList = prev[currentOffset] || [];
        return {
          ...prev,
          [currentOffset]: currentList.filter((item) => item.id !== id),
        };
      });
      setSelectedActivity(null);
    },
    [currentOffset]
  );

  // Open edit modal
  const handleEditActivity = useCallback((activity: Activity) => {
    setSelectedActivity(null);
    setEditingActivity(activity);
    setIsFormOpen(true);
  }, []);

  // Optional preview sample routine loader
  const handleLoadSampleRoutine = useCallback(() => {
    playStepCompleteSound();
    setActivitiesByDay(DEMO_SAMPLE_ACTIVITIES);
  }, []);

  // Keyboard shortcut listener:
  // Space = toggle next activity
  // 'N' or Cmd+N = new activity
  // 1, 2, 3 = change views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Space: complete next activity
      if (e.code === 'Space' && !isFormOpen && !selectedActivity) {
        e.preventDefault();
        if (nextActivity) {
          handleToggleComplete(nextActivity.id);
        }
      }

      // 'N' or Cmd+N: new activity
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey) {
        if (!isFormOpen && !selectedActivity) {
          e.preventDefault();
          handleOpenNewActivity();
        }
      }

      // 1, 2, 3: view switches
      if (e.key === '1') setCurrentView('timeline');
      if (e.key === '2') setCurrentView('checklist');
      if (e.key === '3') setCurrentView('calendar');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextActivity, isFormOpen, selectedActivity, handleToggleComplete, handleOpenNewActivity]);

  return (
    <div className="w-full h-full h-[100dvh] max-w-full overflow-hidden bg-[#EDE8D0] text-[#141410] flex flex-col font-sans selection:bg-[#33312B] selection:text-[#EDE8D0]">
      {/* ÁREA 1 — INTERFACE FIXA (Header + DaySelector) */}
      <header className="shrink-0 w-full z-30 bg-[#EDE8D0]/95 backdrop-blur-md border-b border-[#C4C0AB] shadow-[0_2px_12px_rgba(20,20,16,0.04)]">
        <Header
          currentView={currentView}
          onViewChange={(v) => {
            playTickSound();
            setCurrentView(v);
          }}
        />

        {/* Clean Day Navigation - Pinned in Fixed Toolbar */}
        <DaySelector
          currentOffset={currentOffset}
          dayInfo={currentDayInfo}
          onPrevDay={() => {
            playTickSound();
            setCurrentOffset((prev) => prev - 1);
          }}
          onNextDay={() => {
            playTickSound();
            setCurrentOffset((prev) => prev + 1);
          }}
          onToday={() => {
            playTickSound();
            setCurrentOffset(0);
            setCenterKey((prev) => prev + 1);
          }}
        />
      </header>

      {/* ÁREA 2 — TIMELINE / VISTAS COM SCROLL INTERNO INDEPENDENTE */}
      <main className="w-full flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {/* Timeline View - 24 Hours with Independent Smooth Scroll */}
        {currentView === 'timeline' && (
          <TimelineView
            activities={currentActivities}
            onToggleComplete={handleToggleComplete}
            onOpenDetail={(act) => {
              playTickSound();
              setSelectedActivity(act);
            }}
            onNewActivity={handleOpenNewActivity}
            nextActivityId={nextActivity?.id}
            isToday={currentOffset === 0}
            currentOffset={currentOffset}
            centerKey={centerKey}
          />
        )}

        {/* Checklist View - Internal Scroll */}
        {currentView === 'checklist' && (
          <div
            className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain pb-24 pt-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <ChecklistView
              activities={currentActivities}
              onToggleComplete={handleToggleComplete}
              onOpenDetail={(act) => {
                playTickSound();
                setSelectedActivity(act);
              }}
              onNewActivity={() => handleOpenNewActivity()}
              nextActivityId={nextActivity?.id}
            />
          </div>
        )}

        {/* Calendar View - Internal Scroll */}
        {currentView === 'calendar' && (
          <div
            className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain pb-24 pt-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <CalendarView
              activities={currentActivities}
              onToggleComplete={handleToggleComplete}
              onOpenDetail={(act) => {
                playTickSound();
                setSelectedActivity(act);
              }}
              onNewActivity={(time) => handleOpenNewActivity(undefined, time)}
              nextActivityId={nextActivity?.id}
            />
          </div>
        )}
      </main>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        dayInfo={currentDayInfo}
        onClose={() => setSelectedActivity(null)}
        onToggleComplete={(id) => handleToggleComplete(id)}
        onEdit={(act) => handleEditActivity(act)}
        onDelete={(id) => handleDeleteActivity(id)}
      />

      {/* Create / Edit Activity Modal */}
      <ActivityFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingActivity(null);
          setNewActivityPrefillTitle('');
          setNewActivityPrefillTime(undefined);
        }}
        onSave={handleSaveActivity}
        initialActivity={editingActivity}
        initialTitle={newActivityPrefillTitle}
        defaultStartTime={newActivityPrefillTime}
        dayInfo={currentDayInfo}
      />

      {/* Mobile Web App Install Invitation Banner */}
      {pwa.isMobile && !pwa.isStandalone && !pwa.hasDismissedBanner && (
        <InstallBanner
          isIOS={pwa.isIOS}
          canInstallNative={pwa.canInstallNative}
          onOpenGuide={pwa.openGuide}
          onNativeInstall={pwa.triggerNativeInstall}
          onDismiss={pwa.dismissBanner}
        />
      )}

      {/* Visual Installation Guide Modal (iPhone/Safari & Android) */}
      <InstallGuideModal
        isOpen={pwa.isGuideOpen}
        onClose={pwa.closeGuide}
        onConfirmAdded={pwa.confirmGuideCompleted}
        isIOS={pwa.isIOS}
      />

      {/* Live Bottom Footer Bar */}
      <FooterBar missionsCompleted={dailyMissionsCompleted} />
    </div>
  );
}
