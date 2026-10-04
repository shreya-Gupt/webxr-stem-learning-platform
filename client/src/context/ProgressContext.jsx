import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

const STORAGE_KEY_PROGRESS = 'webxr_student_progress_';

const DEFAULT_PROGRESS = {
  conceptsExplored: ['projectile-circular-motion', 'chemical-bonding', 'heart', 'graph-theory'],
  simulationsCompleted: 4,
  quizzesCompleted: 3,
  quizScoreAverage: 88,
  xp: 520,
  streakDays: 4,
  badges: [
    { id: 'physics_pioneer', name: 'Kinematics Ace', icon: 'Orbit', desc: 'Explored Projectile & Circular Motion' },
    { id: 'bond_master', name: 'Molecular Architect', icon: 'FlaskConical', desc: 'Tested Chemical Bonding Lab' },
    { id: 'first_streak', name: 'Consistent Explorer', icon: 'Flame', desc: 'Maintained a 4-day STEM streak' },
    { id: 'cardiac_expert', name: 'Physiology Explorer', icon: 'Heart', desc: 'Simulated 4-Chamber Heart Cycle' }
  ],
  recentConcepts: [
    { slug: 'projectile-circular-motion', title: 'Projectile & Circular Motion', timestamp: '1 hour ago' },
    { slug: 'chemical-bonding', title: 'Chemical Bonding', timestamp: '3 hours ago' },
    { slug: 'heart', title: 'Heart Working Simulator', timestamp: 'Yesterday' }
  ],
  recentActivity: [
    { id: 'act_1', text: 'Completed Projectile & Circular Motion', timestamp: '1 hour ago' },
    { id: 'act_2', text: 'Scored 90% in Chemical Bonding Quiz', timestamp: '3 hours ago' },
    { id: 'act_3', text: 'Explored Heart Working Simulator', timestamp: 'Yesterday' },
    { id: 'act_4', text: 'Completed Graph Theory Simulator', timestamp: '2 days ago' }
  ]
};

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `${STORAGE_KEY_PROGRESS}${user.id}` : 'webxr_guest_progress';

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  // Reload progress if user changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setProgress(JSON.parse(stored));
      } else {
        setProgress(DEFAULT_PROGRESS);
      }
    } catch {
      setProgress(DEFAULT_PROGRESS);
    }
  }, [storageKey]);

  // Sync to localStorage
  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Failed saving progress to localStorage', e);
    }
  };

  const recordConceptVisit = (concept) => {
    if (!concept || !concept.slug) return;
    const isAlreadyExplored = progress.conceptsExplored.includes(concept.slug);
    const updatedExplored = isAlreadyExplored
      ? progress.conceptsExplored
      : [...progress.conceptsExplored, concept.slug];

    const filteredRecent = progress.recentConcepts.filter(r => r.slug !== concept.slug);
    const updatedRecent = [
      { slug: concept.slug, title: concept.title, timestamp: 'Just now' },
      ...filteredRecent
    ].slice(0, 5);

    const newActivity = {
      id: `act_${Date.now()}`,
      text: `Explored ${concept.title}`,
      timestamp: 'Just now'
    };

    const updated = {
      ...progress,
      conceptsExplored: updatedExplored,
      simulationsCompleted: updatedExplored.length,
      recentConcepts: updatedRecent,
      recentActivity: [newActivity, ...(progress.recentActivity || [])].slice(0, 6),
      xp: isAlreadyExplored ? progress.xp : progress.xp + 50
    };
    saveProgress(updated);
  };

  const recordExperimentComplete = (experimentName) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      text: `Completed ${experimentName}`,
      timestamp: 'Just now'
    };
    const updated = {
      ...progress,
      simulationsCompleted: (progress.simulationsCompleted || 0) + 1,
      recentActivity: [newActivity, ...(progress.recentActivity || [])].slice(0, 6),
      xp: progress.xp + 100
    };
    saveProgress(updated);
  };

  const recordQuizResult = (scorePercent, quizTitle = 'STEM Quiz') => {
    const newAverage = Math.round(((progress.quizScoreAverage || 80) + scorePercent) / 2);
    const newActivity = {
      id: `act_${Date.now()}`,
      text: `Scored ${scorePercent}% in ${quizTitle}`,
      timestamp: 'Just now'
    };
    const updated = {
      ...progress,
      quizzesCompleted: (progress.quizzesCompleted || 0) + 1,
      quizScoreAverage: newAverage,
      recentActivity: [newActivity, ...(progress.recentActivity || [])].slice(0, 6),
      xp: progress.xp + Math.round(scorePercent * 1.5)
    };
    saveProgress(updated);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        recordConceptVisit,
        recordExperimentComplete,
        recordQuizResult
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
