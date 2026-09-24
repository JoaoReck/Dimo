/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, ViewMode, DayOffset } from './types';
import { INITIAL_DAYS_INFO, INITIAL_ACTIVITIES_BY_DAY } from './data/mockActivities';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { HudStatus } from './components/HudStatus';
import { TimelineView } from './components/TimelineView';
import { ChecklistView } from './components/ChecklistView';
import { CalendarView } from './components/CalendarView';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { ActivityFormModal } from './components/ActivityFormModal';
import { FooterBar } from './components/FooterBar';
import {
  playStepCompleteSound,
  playStepReopenSound,
  playTickSound,
  setAudioEnabled,
  isAudioEnabled,
} from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('timeline');
  const [currentOffset, setCurrentOffset] = useState<DayOffset>(0);
  const [activitiesByDay, setActivitiesByDay] = useState<Record<DayOffset, Activity[]>>(
    INITIAL_ACTIVITIES_BY_DAY
  );

  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Sync sound settings with audio utility
  const handleToggleSound = useCallback(() => {
    const next = !soundActive;
    setSoundActive(next);
    setAudioEnabled(next);
    if (next) playTickSound();
  }, [soundActive]);

  // Current day data
  const currentDayInfo = INITIAL_DAYS_INFO[currentOffset];

  // Activities sorted by time
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

        // Also update selectedActivity in modal if open
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
            category: data.category,
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

  // Keyboard shortcut listener:
  // Space = toggle next activity
  // 'N' or Cmd+N = new activity
  // 1, 2, 3 = change views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
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
          setEditingActivity(null);
          setIsFormOpen(true);
        }
      }

      // 1, 2, 3: view switches
      if (e.key === '1') setCurrentView('timeline');
      if (e.key === '2') setCurrentView('checklist');
      if (e.key === '3') setCurrentView('calendar');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextActivity, isFormOpen, selectedActivity, handleToggleComplete]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F5F5] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          playTickSound();
          setCurrentView(v);
        }}
        onNewActivity={() => {
          playTickSound();
          setEditingActivity(null);
          setIsFormOpen(true);
        }}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Day Selector & Overall Progress */}
        <DaySelector
          currentOffset={currentOffset}
          dayInfo={currentDayInfo}
          onSelectOffset={(offset) => {
            playTickSound();
            setCurrentOffset(offset);
          }}
          totalActivities={totalActivities}
          completedActivities={completedActivities}
        />

        {/* Phase Philosophy HUD Banner */}
        <HudStatus
          currentStepIndex={nextActivityIndex === -1 ? totalActivities : nextActivityIndex}
          totalSteps={totalActivities}
          allCompleted={allCompleted}
          nextActivity={nextActivity}
        />

        {/* View Switcher Content */}
        {currentView === 'timeline' && (
          <TimelineView
            activities={currentActivities}
            onToggleComplete={handleToggleComplete}
            onOpenDetail={(act) => {
              playTickSound();
              setSelectedActivity(act);
            }}
            nextActivityId={nextActivity?.id}
          />
        )}

        {currentView === 'checklist' && (
          <ChecklistView
            activities={currentActivities}
            onToggleComplete={handleToggleComplete}
            onOpenDetail={(act) => {
              playTickSound();
              setSelectedActivity(act);
            }}
            nextActivityId={nextActivity?.id}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            activities={currentActivities}
            onToggleComplete={handleToggleComplete}
            onOpenDetail={(act) => {
              playTickSound();
              setSelectedActivity(act);
            }}
            nextActivityId={nextActivity?.id}
          />
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
        }}
        onSave={handleSaveActivity}
        initialActivity={editingActivity}
        dayInfo={currentDayInfo}
      />

      {/* Live Bottom Footer Bar */}
      <FooterBar />
    </div>
  );
}
