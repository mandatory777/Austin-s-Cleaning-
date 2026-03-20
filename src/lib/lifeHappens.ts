import { MealLog } from './meals';

export interface GapAnalysis {
  daysAway: number;
  lastActiveDate: string;
  message: string;
  estimatedMeals: number;
  severity: 'none' | 'short' | 'medium' | 'long';
}

export function analyzeGap(lastActiveDate: string, today: string): GapAnalysis {
  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const daysAway = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysAway <= 1) {
    return {
      daysAway,
      lastActiveDate,
      message: '',
      estimatedMeals: 0,
      severity: 'none',
    };
  }

  let message: string;
  let severity: GapAnalysis['severity'];

  if (daysAway <= 3) {
    message = "Welcome back! Life gets busy — let's pick up where you left off.";
    severity = 'short';
  } else if (daysAway <= 7) {
    message = "Hey, good to see you! No pressure — we've kept your plan ready whenever you are.";
    severity = 'medium';
  } else {
    message = `It's been ${daysAway} days — and that's totally okay. Your body remembers the good work you've done. Ready for a fresh start?`;
    severity = 'long';
  }

  return {
    daysAway,
    lastActiveDate,
    message,
    estimatedMeals: daysAway * 3,
    severity,
  };
}

export function estimateMissedMeals(
  mealLogs: MealLog[],
  missedDays: number
): { estimatedCalories: number; estimatedProtein: number } {
  if (mealLogs.length === 0) {
    return { estimatedCalories: 2000 * missedDays, estimatedProtein: 75 * missedDays };
  }

  // Calculate average daily intake from logged meals
  const dailyTotals: Record<string, { calories: number; protein: number }> = {};
  for (const log of mealLogs) {
    if (!dailyTotals[log.date]) {
      dailyTotals[log.date] = { calories: 0, protein: 0 };
    }
  }

  const days = Object.values(dailyTotals);
  if (days.length === 0) {
    return { estimatedCalories: 2000 * missedDays, estimatedProtein: 75 * missedDays };
  }

  const avgCalories = days.reduce((s, d) => s + d.calories, 0) / days.length;
  const avgProtein = days.reduce((s, d) => s + d.protein, 0) / days.length;

  return {
    estimatedCalories: Math.round(avgCalories * missedDays),
    estimatedProtein: Math.round(avgProtein * missedDays),
  };
}

export function getGentleResetPlan(daysAway: number): {
  adjustedIntensity: 'light' | 'moderate' | 'hard';
  message: string;
} {
  if (daysAway <= 3) {
    return {
      adjustedIntensity: 'moderate',
      message: "Jumping back in at your normal pace.",
    };
  }
  if (daysAway <= 7) {
    return {
      adjustedIntensity: 'light',
      message: "Starting with a lighter workout to ease back in. We'll ramp up over the next few days.",
    };
  }
  return {
    adjustedIntensity: 'light',
    message: "Let's start gentle and build back up. Your first few workouts will be lighter — your body will thank you.",
  };
}
