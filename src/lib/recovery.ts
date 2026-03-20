export interface RecoveryEntry {
  date: string;
  sleepHours: number;
  sleepQuality: number;  // 1-5
  soreness: number;      // 1-5 (1=none, 5=severe)
  stressLevel: number;   // 1-5
  cycleDay?: number;     // optional menstrual cycle day
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  notes?: string;
}

export interface RecoveryScore {
  total: number;         // 0-100
  sleepScore: number;
  sorenessScore: number;
  stressScore: number;
  cycleScore: number;
  recommendation: string;
  shouldRest: boolean;
}

export function calculateRecoveryScore(entry: RecoveryEntry): RecoveryScore {
  // Sleep score (40% weight): hours + quality
  const hourScore = Math.min(entry.sleepHours / 8, 1) * 50;
  const qualityScore = (entry.sleepQuality / 5) * 50;
  const sleepScore = Math.round(hourScore + qualityScore);

  // Soreness score (25% weight): inverse — less soreness = higher score
  const sorenessScore = Math.round(((6 - entry.soreness) / 5) * 100);

  // Stress score (25% weight): inverse — less stress = higher score
  const stressScore = Math.round(((6 - entry.stressLevel) / 5) * 100);

  // Cycle score (10% weight): defaults to 100 if not tracking
  let cycleScore = 100;
  if (entry.cyclePhase) {
    const phaseScores: Record<string, number> = {
      menstrual: 60,
      follicular: 90,
      ovulation: 80,
      luteal: 70,
    };
    cycleScore = phaseScores[entry.cyclePhase] || 100;
  }

  const total = Math.round(
    sleepScore * 0.4 +
    sorenessScore * 0.25 +
    stressScore * 0.25 +
    cycleScore * 0.1
  );

  const shouldRest = total < 40;

  let recommendation: string;
  if (total >= 80) {
    recommendation = "You're well-recovered! Great day for an intense workout.";
  } else if (total >= 60) {
    recommendation = "Decent recovery. A moderate workout would be ideal today.";
  } else if (total >= 40) {
    recommendation = "Recovery is below average. Consider a lighter session or active recovery.";
  } else {
    recommendation = "Your body needs rest. Take a rest day or do gentle stretching/walking.";
  }

  return { total, sleepScore, sorenessScore, stressScore, cycleScore, recommendation, shouldRest };
}

export function getCyclePhase(dayOfCycle: number): RecoveryEntry['cyclePhase'] {
  if (dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulation';
  return 'luteal';
}

export function getRecoveryTrend(entries: RecoveryEntry[]): { trend: 'improving' | 'declining' | 'stable'; avgScore: number } {
  if (entries.length < 3) return { trend: 'stable', avgScore: 0 };
  const scores = entries.map(e => calculateRecoveryScore(e).total);
  const recent = scores.slice(-3);
  const older = scores.slice(-6, -3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
  const diff = recentAvg - olderAvg;
  return {
    trend: diff > 5 ? 'improving' : diff < -5 ? 'declining' : 'stable',
    avgScore: Math.round(recentAvg),
  };
}
