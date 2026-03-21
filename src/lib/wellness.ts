import { getStored, setStored } from './storage';

export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  note: string;
  loggedAt: string;
}

export interface BreathingSession {
  id: string;
  date: string;
  technique: string;
  durationSeconds: number;
  completedAt: string;
}

export interface SleepLog {
  id: string;
  date: string;
  hoursSlept: number;
  quality: 1 | 2 | 3 | 4 | 5;
  bedtime: string;
  wakeTime: string;
  loggedAt: string;
}

export const MOOD_EMOJIS = ['😫', '😔', '😐', '🙂', '😄'];
export const ENERGY_EMOJIS = ['🪫', '😴', '⚡', '🔋', '⚡⚡'];
export const STRESS_LABELS = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

export const BREATHING_TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s',
    emoji: '📦',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4,
    color: '#3b82f6',
  },
  {
    id: '478',
    name: '4-7-8 Relaxing',
    description: 'Inhale 4s → Hold 7s → Exhale 8s',
    emoji: '🌙',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    cycles: 4,
    color: '#8b5cf6',
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Inhale 4s → Exhale 6s — simple & soothing',
    emoji: '🍃',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    cycles: 6,
    color: '#10b981',
  },
  {
    id: 'energize',
    name: 'Energizing Breath',
    description: 'Inhale 2s → Exhale 2s — quick energy boost',
    emoji: '⚡',
    inhale: 2,
    hold1: 0,
    exhale: 2,
    hold2: 0,
    cycles: 10,
    color: '#f59e0b',
  },
];

export function loadMoodEntries(): MoodEntry[] {
  return getStored<MoodEntry[]>('pulse_mood_entries', []);
}

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = loadMoodEntries();
  entries.unshift(entry);
  setStored('pulse_mood_entries', entries);
}

export function loadBreathingSessions(): BreathingSession[] {
  return getStored<BreathingSession[]>('pulse_breathing', []);
}

export function saveBreathingSession(session: BreathingSession): void {
  const sessions = loadBreathingSessions();
  sessions.unshift(session);
  setStored('pulse_breathing', sessions);
}

export function loadSleepLogs(): SleepLog[] {
  return getStored<SleepLog[]>('pulse_sleep', []);
}

export function saveSleepLog(log: SleepLog): void {
  const logs = loadSleepLogs();
  const updated = [log, ...logs.filter(l => l.date !== log.date)];
  setStored('pulse_sleep', updated);
}

export function getMoodTrend(entries: MoodEntry[], days: number = 7): { avg: number; trend: 'up' | 'down' | 'stable' } {
  const now = new Date();
  const recent = entries.filter(e => {
    const d = new Date(e.loggedAt);
    return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= days;
  });

  if (recent.length < 2) return { avg: recent[0]?.mood ?? 3, trend: 'stable' };

  const avg = recent.reduce((s, e) => s + e.mood, 0) / recent.length;
  const half = Math.floor(recent.length / 2);
  const recentHalf = recent.slice(0, half);
  const olderHalf = recent.slice(half);
  const recentAvg = recentHalf.reduce((s, e) => s + e.mood, 0) / recentHalf.length;
  const olderAvg = olderHalf.reduce((s, e) => s + e.mood, 0) / olderHalf.length;

  const diff = recentAvg - olderAvg;
  const trend = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'stable';

  return { avg: Math.round(avg * 10) / 10, trend };
}
