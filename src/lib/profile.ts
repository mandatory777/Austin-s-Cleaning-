export type Goal = 'weight_loss' | 'muscle_gain' | 'wellness';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female';

export interface HouseholdMember {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  tdee: number;
  macros: Macros;
}

export interface WeightEntry {
  date: string;
  weight: number; // lbs
}

export interface UserProfile {
  name: string;
  age: number;
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  goalWeight?: number; // lbs
  goal: Goal;
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;
  sleepHours: number;
  stressLevel: number; // 1-5
  tdee: number;
  macros: Macros;
  household: HouseholdMember[];
  onboardedAt: string;
  lastActiveDate: string;
}

export interface Macros {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor
export function calculateBMR(sex: Sex, weight: number, height: number, age: number): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateMacros(tdee: number, goal: Goal): Macros {
  let calories: number;
  let proteinPct: number, carbsPct: number, fatPct: number;

  switch (goal) {
    case 'weight_loss':
      calories = Math.round(tdee * 0.8); // 20% deficit
      proteinPct = 0.40; carbsPct = 0.30; fatPct = 0.30;
      break;
    case 'muscle_gain':
      calories = Math.round(tdee * 1.1); // 10% surplus
      proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;
      break;
    case 'wellness':
    default:
      calories = tdee;
      proteinPct = 0.30; carbsPct = 0.40; fatPct = 0.30;
      break;
  }

  return {
    calories,
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  };
}

export function adjustMacrosForWorkout(baseMacros: Macros, workoutIntensity: 'light' | 'moderate' | 'hard'): Macros {
  if (workoutIntensity === 'light') return baseMacros;
  const proteinBoost = workoutIntensity === 'hard' ? 0.15 : 0.08;
  const carbBoost = workoutIntensity === 'hard' ? 0.10 : 0.05;
  return {
    calories: Math.round(baseMacros.calories * (1 + proteinBoost * 0.5 + carbBoost * 0.5)),
    protein: Math.round(baseMacros.protein * (1 + proteinBoost)),
    carbs: Math.round(baseMacros.carbs * (1 + carbBoost)),
    fat: baseMacros.fat,
  };
}

export const GOAL_LABELS: Record<Goal, string> = {
  weight_loss: 'Weight Loss',
  muscle_gain: 'Muscle Gain',
  wellness: 'General Wellness',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (desk job)',
  light: 'Lightly Active (1-2 days/week)',
  moderate: 'Moderately Active (3-5 days/week)',
  active: 'Active (6-7 days/week)',
  very_active: 'Very Active (athlete/physical job)',
};

export const EXPERIENCE_LABELS: Record<FitnessExperience, string> = {
  beginner: 'Beginner (new to fitness)',
  intermediate: 'Intermediate (1-3 years)',
  advanced: 'Advanced (3+ years)',
};
