import { getStored, setStored } from './storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'hydration' | 'streak' | 'milestone';
  xp: number;
  unlockedAt?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalMealsLogged: number;
  totalRunMiles: number;
  totalWaterGlasses: number;
  totalJournalEntries: number;
  totalMoodCheckins: number;
  totalBreathingSessions: number;
  challengesCompleted: number;
  lastActiveDate: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'hydration';
  target: number;
  unit: string;
  xpReward: number;
  date: string;
  completed: boolean;
  progress: number;
}

// XP required for each level (increases each level)
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.3, level - 1));
}

export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  let level = 1;
  let xpUsed = 0;
  while (true) {
    const needed = xpForLevel(level);
    if (xpUsed + needed > totalXP) {
      return { level, currentXP: totalXP - xpUsed, nextLevelXP: needed };
    }
    xpUsed += needed;
    level++;
  }
}

export function getLevelTitle(level: number): string {
  if (level <= 3) return 'Beginner';
  if (level <= 6) return 'Rising Star';
  if (level <= 10) return 'Committed';
  if (level <= 15) return 'Dedicated';
  if (level <= 20) return 'Champion';
  if (level <= 30) return 'Elite';
  return 'Legend';
}

// All possible achievements
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Fitness
  { id: 'first_workout', title: 'First Steps', description: 'Complete your first workout', emoji: '💪', category: 'fitness', xp: 50 },
  { id: '10_workouts', title: 'Getting Strong', description: 'Complete 10 workouts', emoji: '🏋️', category: 'fitness', xp: 150 },
  { id: '50_workouts', title: 'Iron Will', description: 'Complete 50 workouts', emoji: '⚔️', category: 'fitness', xp: 500 },
  { id: 'first_run', title: 'Hit the Ground Running', description: 'Log your first run', emoji: '🏃', category: 'fitness', xp: 50 },
  { id: '10_miles', title: 'Double Digits', description: 'Run 10 total miles', emoji: '🛤️', category: 'fitness', xp: 100 },
  { id: '50_miles', title: 'Ultrarunner', description: 'Run 50 total miles', emoji: '🏔️', category: 'fitness', xp: 300 },
  { id: '100_miles', title: 'Century Club', description: 'Run 100 total miles', emoji: '🌟', category: 'fitness', xp: 500 },

  // Nutrition
  { id: 'first_meal', title: 'Fueled Up', description: 'Log your first meal', emoji: '🍽️', category: 'nutrition', xp: 30 },
  { id: '10_meals', title: 'Meal Prepper', description: 'Log 10 meals', emoji: '🥗', category: 'nutrition', xp: 100 },
  { id: '50_meals', title: 'Nutrition Nerd', description: 'Log 50 meals', emoji: '📊', category: 'nutrition', xp: 300 },
  { id: 'hit_macros', title: 'Macro Master', description: 'Hit your macro targets for a day', emoji: '🎯', category: 'nutrition', xp: 100 },

  // Hydration
  { id: 'first_water', title: 'Stay Hydrated', description: 'Log your first glass of water', emoji: '💧', category: 'hydration', xp: 20 },
  { id: 'water_goal', title: 'Water Champion', description: 'Hit your daily water goal', emoji: '🌊', category: 'hydration', xp: 50 },
  { id: 'water_streak_7', title: 'Hydration Habit', description: '7-day water goal streak', emoji: '💦', category: 'hydration', xp: 200 },

  // Wellness
  { id: 'first_breathing', title: 'Just Breathe', description: 'Complete a breathing exercise', emoji: '🧘', category: 'wellness', xp: 30 },
  { id: 'first_mood', title: 'Self Aware', description: 'Log your first mood check-in', emoji: '🪞', category: 'wellness', xp: 30 },
  { id: '10_mood', title: 'Emotional Intelligence', description: 'Complete 10 mood check-ins', emoji: '🧠', category: 'wellness', xp: 150 },
  { id: 'first_journal', title: 'Dear Diary', description: 'Write your first journal entry', emoji: '📝', category: 'wellness', xp: 30 },

  // Streaks
  { id: 'streak_3', title: 'Hat Trick', description: '3-day activity streak', emoji: '🔥', category: 'streak', xp: 50 },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day activity streak', emoji: '🔥', category: 'streak', xp: 150 },
  { id: 'streak_14', title: 'Two Week Terror', description: '14-day activity streak', emoji: '🔥', category: 'streak', xp: 300 },
  { id: 'streak_30', title: 'Monthly Monster', description: '30-day activity streak', emoji: '🔥', category: 'streak', xp: 500 },

  // Milestones
  { id: 'level_5', title: 'Level 5!', description: 'Reach level 5', emoji: '⭐', category: 'milestone', xp: 100 },
  { id: 'level_10', title: 'Double Digits', description: 'Reach level 10', emoji: '🌟', category: 'milestone', xp: 250 },
  { id: 'level_20', title: 'Elite Status', description: 'Reach level 20', emoji: '👑', category: 'milestone', xp: 500 },
];

export function getDefaultStats(): UserStats {
  return {
    xp: 0, level: 1, currentStreak: 0, longestStreak: 0,
    totalWorkouts: 0, totalMealsLogged: 0, totalRunMiles: 0,
    totalWaterGlasses: 0, totalJournalEntries: 0, totalMoodCheckins: 0,
    totalBreathingSessions: 0, challengesCompleted: 0,
    lastActiveDate: '',
  };
}

export function loadStats(): UserStats {
  return getStored<UserStats>('pulse_stats', getDefaultStats());
}

export function saveStats(stats: UserStats): void {
  setStored('pulse_stats', stats);
}

export function loadUnlockedAchievements(): Achievement[] {
  return getStored<Achievement[]>('pulse_achievements', []);
}

export function checkAndUnlockAchievements(stats: UserStats): Achievement[] {
  const unlocked = loadUnlockedAchievements();
  const unlockedIds = new Set(unlocked.map(a => a.id));
  const newlyUnlocked: Achievement[] = [];

  const checks: Record<string, boolean> = {
    first_workout: stats.totalWorkouts >= 1,
    '10_workouts': stats.totalWorkouts >= 10,
    '50_workouts': stats.totalWorkouts >= 50,
    first_run: stats.totalRunMiles > 0,
    '10_miles': stats.totalRunMiles >= 10,
    '50_miles': stats.totalRunMiles >= 50,
    '100_miles': stats.totalRunMiles >= 100,
    first_meal: stats.totalMealsLogged >= 1,
    '10_meals': stats.totalMealsLogged >= 10,
    '50_meals': stats.totalMealsLogged >= 50,
    first_water: stats.totalWaterGlasses >= 1,
    first_breathing: stats.totalBreathingSessions >= 1,
    first_mood: stats.totalMoodCheckins >= 1,
    '10_mood': stats.totalMoodCheckins >= 10,
    first_journal: stats.totalJournalEntries >= 1,
    streak_3: stats.currentStreak >= 3,
    streak_7: stats.currentStreak >= 7,
    streak_14: stats.currentStreak >= 14,
    streak_30: stats.currentStreak >= 30,
    level_5: stats.level >= 5,
    level_10: stats.level >= 10,
    level_20: stats.level >= 20,
  };

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (!unlockedIds.has(achievement.id) && checks[achievement.id]) {
      const a = { ...achievement, unlockedAt: new Date().toISOString() };
      newlyUnlocked.push(a);
      unlocked.push(a);
      stats.xp += achievement.xp;
    }
  }

  if (newlyUnlocked.length > 0) {
    const levelInfo = getLevelFromXP(stats.xp);
    stats.level = levelInfo.level;
    setStored('pulse_achievements', unlocked);
    saveStats(stats);
  }

  return newlyUnlocked;
}

// Update streak based on today's date
export function updateStreak(stats: UserStats, today: string): UserStats {
  if (stats.lastActiveDate === today) return stats;

  const lastDate = new Date(stats.lastActiveDate + 'T12:00:00');
  const todayDate = new Date(today + 'T12:00:00');
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    stats.currentStreak += 1;
  } else if (diffDays > 1) {
    stats.currentStreak = 1;
  } else if (!stats.lastActiveDate) {
    stats.currentStreak = 1;
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  stats.lastActiveDate = today;
  return stats;
}

// Daily challenge generator
const CHALLENGE_POOL = [
  { title: 'Hydration Hero', description: 'Drink 8 glasses of water', emoji: '💧', category: 'hydration' as const, target: 8, unit: 'glasses', xpReward: 40 },
  { title: 'Move It!', description: 'Complete today\'s workout', emoji: '💪', category: 'fitness' as const, target: 1, unit: 'workout', xpReward: 50 },
  { title: 'Fuel Right', description: 'Log 3 meals today', emoji: '🥗', category: 'nutrition' as const, target: 3, unit: 'meals', xpReward: 40 },
  { title: 'Zen Moment', description: 'Do a breathing exercise', emoji: '🧘', category: 'wellness' as const, target: 1, unit: 'session', xpReward: 30 },
  { title: 'Runner\'s High', description: 'Log a run today', emoji: '🏃', category: 'fitness' as const, target: 1, unit: 'run', xpReward: 50 },
  { title: 'Mindful Check', description: 'Log your mood today', emoji: '🪞', category: 'wellness' as const, target: 1, unit: 'check-in', xpReward: 25 },
  { title: 'Super Hydrated', description: 'Drink 10 glasses of water', emoji: '🌊', category: 'hydration' as const, target: 10, unit: 'glasses', xpReward: 60 },
  { title: 'Journal Time', description: 'Write a food journal entry', emoji: '📝', category: 'wellness' as const, target: 1, unit: 'entry', xpReward: 30 },
];

export function getDailyChallenges(date: string): DailyChallenge[] {
  const stored = getStored<DailyChallenge[]>(`pulse_challenges_${date}`, []);
  if (stored.length > 0) return stored;

  // Seed-based "random" using date string
  const seed = date.split('-').reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...CHALLENGE_POOL].sort((a, b) => {
    const ha = (seed * 31 + a.title.length) % 100;
    const hb = (seed * 31 + b.title.length) % 100;
    return ha - hb;
  });

  const challenges: DailyChallenge[] = shuffled.slice(0, 3).map((c, i) => ({
    id: `challenge-${date}-${i}`,
    ...c,
    date,
    completed: false,
    progress: 0,
  }));

  setStored(`pulse_challenges_${date}`, challenges);
  return challenges;
}

export function updateChallenge(date: string, challengeId: string, progress: number): DailyChallenge[] {
  const challenges = getDailyChallenges(date);
  const updated = challenges.map(c => {
    if (c.id === challengeId) {
      const newProgress = Math.max(c.progress, progress);
      return { ...c, progress: newProgress, completed: newProgress >= c.target };
    }
    return c;
  });
  setStored(`pulse_challenges_${date}`, updated);
  return updated;
}

// Smart companion messages based on user activity
export function getCompanionMessage(stats: UserStats, timeOfDay: 'morning' | 'afternoon' | 'evening'): string {
  const messages: string[] = [];

  // Streak messages
  if (stats.currentStreak >= 7) {
    messages.push(`🔥 ${stats.currentStreak}-day streak! You're unstoppable!`);
  } else if (stats.currentStreak >= 3) {
    messages.push(`🔥 ${stats.currentStreak} days strong! Keep the momentum going!`);
  } else if (stats.currentStreak === 0) {
    messages.push("Welcome back! Today's a fresh start 💫");
  }

  // Time-based messages
  if (timeOfDay === 'morning') {
    messages.push("Rise and shine! Let's make today count 🌅");
    messages.push("Good morning! Your body is ready for greatness ☀️");
    messages.push("A new day, a new chance to be your best self 🌟");
  } else if (timeOfDay === 'afternoon') {
    messages.push("Keep going! You're doing amazing today 💪");
    messages.push("Halfway through the day — stay hydrated! 💧");
    messages.push("Afternoon energy boost: you've got this! ⚡");
  } else {
    messages.push("Great work today! Rest well tonight 🌙");
    messages.push("Wind down and be proud of what you accomplished 🌟");
    messages.push("Evening reflection: every step counts 🌙");
  }

  // Achievement-based
  if (stats.totalWorkouts > 0 && stats.totalWorkouts % 10 === 0) {
    messages.push(`🎉 ${stats.totalWorkouts} workouts complete! Incredible dedication!`);
  }
  if (stats.totalRunMiles > 0 && stats.totalRunMiles >= 10) {
    messages.push(`🏃 You've run ${Math.round(stats.totalRunMiles)} miles total. Amazing!`);
  }

  // Level-based
  const levelInfo = getLevelFromXP(stats.xp);
  if (levelInfo.currentXP / levelInfo.nextLevelXP > 0.8) {
    messages.push(`Almost level ${stats.level + 1}! Just a bit more XP ⬆️`);
  }

  // Pick one based on a simple hash of today
  const today = new Date().toISOString().split('T')[0];
  const hash = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  return messages[hash % messages.length];
}
