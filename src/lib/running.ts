export interface RunLog {
  id: string;
  date: string;
  distance: number; // miles
  duration: number; // minutes
  pace: number; // min/mile (calculated)
  type: 'easy' | 'tempo' | 'interval' | 'long' | 'race' | 'recovery';
  notes: string;
  caloriesBurned: number;
  loggedAt: string;
}

export interface RunningGoal {
  type: '5k' | '10k' | 'half_marathon' | 'marathon' | 'custom';
  targetDistance: number; // miles
  targetPace?: number; // min/mile
  weeklyMileageTarget: number;
  startDate: string;
  raceDate?: string;
}

export interface WeeklyRunSummary {
  totalMiles: number;
  totalMinutes: number;
  totalRuns: number;
  avgPace: number;
  caloriesBurned: number;
}

export const RUN_TYPES = [
  { type: 'easy' as const, label: 'Easy Run', color: 'text-green-600', bg: 'bg-green-100', emoji: '🏃', desc: 'Comfortable conversational pace' },
  { type: 'tempo' as const, label: 'Tempo', color: 'text-orange-600', bg: 'bg-orange-100', emoji: '🔥', desc: 'Comfortably hard sustained effort' },
  { type: 'interval' as const, label: 'Intervals', color: 'text-red-600', bg: 'bg-red-100', emoji: '⚡', desc: 'Fast repeats with rest periods' },
  { type: 'long' as const, label: 'Long Run', color: 'text-blue-600', bg: 'bg-blue-100', emoji: '🛣️', desc: 'Extended distance at easy pace' },
  { type: 'race' as const, label: 'Race', color: 'text-purple-600', bg: 'bg-purple-100', emoji: '🏆', desc: 'Race day or time trial' },
  { type: 'recovery' as const, label: 'Recovery', color: 'text-teal-600', bg: 'bg-teal-100', emoji: '🧘', desc: 'Very easy, active recovery' },
];

export const RACE_GOALS = [
  { type: '5k' as const, label: '5K', distance: 3.1, weeklyBase: 15 },
  { type: '10k' as const, label: '10K', distance: 6.2, weeklyBase: 20 },
  { type: 'half_marathon' as const, label: 'Half Marathon', distance: 13.1, weeklyBase: 25 },
  { type: 'marathon' as const, label: 'Marathon', distance: 26.2, weeklyBase: 35 },
];

export function calculatePace(distance: number, durationMinutes: number): number {
  if (distance <= 0) return 0;
  return Math.round((durationMinutes / distance) * 100) / 100;
}

export function formatPace(paceMinPerMile: number): string {
  if (paceMinPerMile <= 0) return '--:--';
  const mins = Math.floor(paceMinPerMile);
  const secs = Math.round((paceMinPerMile - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export function estimateCalories(distanceMiles: number, weightKg: number): number {
  // Rough estimate: ~100 cal per mile for a 150lb person, adjusted by weight
  const baseCal = distanceMiles * 100;
  const weightFactor = weightKg / 68; // 68kg ≈ 150lb
  return Math.round(baseCal * weightFactor);
}

export function getWeeklySummary(runs: RunLog[], weekStartDate: string): WeeklyRunSummary {
  const start = new Date(weekStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const weekRuns = runs.filter(r => {
    const d = new Date(r.date);
    return d >= start && d < end;
  });

  const totalMiles = weekRuns.reduce((s, r) => s + r.distance, 0);
  const totalMinutes = weekRuns.reduce((s, r) => s + r.duration, 0);
  const caloriesBurned = weekRuns.reduce((s, r) => s + r.caloriesBurned, 0);

  return {
    totalMiles: Math.round(totalMiles * 10) / 10,
    totalMinutes: Math.round(totalMinutes),
    totalRuns: weekRuns.length,
    avgPace: totalMiles > 0 ? calculatePace(totalMiles, totalMinutes) : 0,
    caloriesBurned,
  };
}

export function getPersonalRecords(runs: RunLog[]): { fastestPace: RunLog | null; longestRun: RunLog | null; fastestMile: RunLog | null } {
  if (runs.length === 0) return { fastestPace: null, longestRun: null, fastestMile: null };

  const longestRun = runs.reduce((best, r) => r.distance > best.distance ? r : best, runs[0]);
  const withPace = runs.filter(r => r.pace > 0 && r.distance >= 1);
  const fastestPace = withPace.length > 0 ? withPace.reduce((best, r) => r.pace < best.pace ? r : best, withPace[0]) : null;
  const fastestMile = fastestPace; // Same metric for simplicity

  return { fastestPace, longestRun, fastestMile };
}

// Generate a simple weekly running plan based on goal
export function generateWeeklyPlan(goal: RunningGoal): { day: string; type: RunLog['type']; miles: number; description: string }[] {
  const weekly = goal.weeklyMileageTarget;

  return [
    { day: 'Monday', type: 'easy', miles: Math.round(weekly * 0.15 * 10) / 10, description: 'Easy pace run' },
    { day: 'Tuesday', type: 'tempo', miles: Math.round(weekly * 0.15 * 10) / 10, description: 'Tempo workout' },
    { day: 'Wednesday', type: 'recovery', miles: Math.round(weekly * 0.1 * 10) / 10, description: 'Recovery jog or cross-train' },
    { day: 'Thursday', type: 'interval', miles: Math.round(weekly * 0.12 * 10) / 10, description: 'Speed intervals' },
    { day: 'Friday', type: 'easy', miles: 0, description: 'Rest day' },
    { day: 'Saturday', type: 'long', miles: Math.round(weekly * 0.3 * 10) / 10, description: 'Long run at easy pace' },
    { day: 'Sunday', type: 'easy', miles: Math.round(weekly * 0.18 * 10) / 10, description: 'Easy recovery run' },
  ];
}
