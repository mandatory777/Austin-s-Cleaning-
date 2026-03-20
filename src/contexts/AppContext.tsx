'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Macros, calculateBMR, calculateTDEE, calculateMacros, adjustMacrosForWorkout } from '@/lib/profile';
import { DayMealPlan, generateMealPlan, swapMeal, MealLog } from '@/lib/meals';
import { WorkoutPlan, WorkoutSession, generateWeeklyWorkouts } from '@/lib/workouts';
import { RecoveryEntry, RecoveryScore, calculateRecoveryScore } from '@/lib/recovery';
import { JournalEntry } from '@/lib/journal';
import { analyzeGap, GapAnalysis } from '@/lib/lifeHappens';
import { getStored, setStored } from '@/lib/storage';

interface AppState {
  profile: UserProfile | null;
  todayMealPlan: DayMealPlan | null;
  weeklyWorkouts: WorkoutPlan[];
  todayWorkout: WorkoutPlan | null;
  workoutSessions: WorkoutSession[];
  recoveryEntries: RecoveryEntry[];
  todayRecovery: RecoveryScore | null;
  journalEntries: JournalEntry[];
  mealLogs: MealLog[];
  gapAnalysis: GapAnalysis | null;
  adjustedMacros: Macros | null;
}

interface AppContextType extends AppState {
  saveProfile: (profile: UserProfile) => void;
  regenerateMealPlan: (pantryItems?: string[]) => void;
  swapMealInPlan: (mealId: string) => void;
  logMeal: (mealSlotId: string, foodId: string, servings: number) => void;
  logWorkout: (session: WorkoutSession) => void;
  logRecovery: (entry: RecoveryEntry) => void;
  logJournal: (entry: JournalEntry) => void;
  updateLastActive: () => void;
  getTodayDate: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayMealPlan, setTodayMealPlan] = useState<DayMealPlan | null>(null);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WorkoutPlan[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [recoveryEntries, setRecoveryEntries] = useState<RecoveryEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [adjustedMacros, setAdjustedMacros] = useState<Macros | null>(null);

  const getTodayDate = useCallback(() => new Date().toISOString().split('T')[0], []);

  // Load from localStorage on mount
  useEffect(() => {
    const p = getStored<UserProfile | null>('pulse_profile', null);
    if (p) {
      setProfile(p);
      const workouts = generateWeeklyWorkouts(p.goal, p.fitnessExperience);
      setWeeklyWorkouts(workouts);

      // Check for gap
      const today = getTodayDate();
      if (p.lastActiveDate) {
        const gap = analyzeGap(p.lastActiveDate, today);
        if (gap.severity !== 'none') setGapAnalysis(gap);
      }

      // Generate today's meal plan
      const existingPlan = getStored<DayMealPlan | null>(`pulse_meals_${today}`, null);
      if (existingPlan) {
        setTodayMealPlan(existingPlan);
      } else {
        const plan = generateMealPlan(today, p.macros);
        setTodayMealPlan(plan);
        setStored(`pulse_meals_${today}`, plan);
      }

      // Check workout-nutrition link
      const dayOfWeek = new Date().getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      if (adjustedDay < workouts.length) {
        const todayW = workouts[adjustedDay];
        const adjusted = adjustMacrosForWorkout(p.macros, todayW.intensity);
        setAdjustedMacros(adjusted);
      }
    }

    setWorkoutSessions(getStored<WorkoutSession[]>('pulse_workout_sessions', []));
    setRecoveryEntries(getStored<RecoveryEntry[]>('pulse_recovery', []));
    setJournalEntries(getStored<JournalEntry[]>('pulse_journal', []));
    setMealLogs(getStored<MealLog[]>('pulse_meal_logs', []));
  }, [getTodayDate]);

  const saveProfile = useCallback((p: UserProfile) => {
    const bmr = calculateBMR(p.sex, p.weight, p.height, p.age);
    const tdee = calculateTDEE(bmr, p.activityLevel);
    const macros = calculateMacros(tdee, p.goal);
    const fullProfile = { ...p, tdee, macros, onboardedAt: new Date().toISOString(), lastActiveDate: getTodayDate() };
    setProfile(fullProfile);
    setStored('pulse_profile', fullProfile);

    const workouts = generateWeeklyWorkouts(fullProfile.goal, fullProfile.fitnessExperience);
    setWeeklyWorkouts(workouts);

    const plan = generateMealPlan(getTodayDate(), macros);
    setTodayMealPlan(plan);
    setStored(`pulse_meals_${getTodayDate()}`, plan);
  }, [getTodayDate]);

  const regenerateMealPlan = useCallback((pantryItems?: string[]) => {
    if (!profile) return;
    const today = getTodayDate();
    const plan = generateMealPlan(today, adjustedMacros || profile.macros, pantryItems);
    setTodayMealPlan(plan);
    setStored(`pulse_meals_${today}`, plan);
  }, [profile, adjustedMacros, getTodayDate]);

  const swapMealInPlan = useCallback((mealId: string) => {
    if (!todayMealPlan || !profile) return;
    const updated = swapMeal(todayMealPlan, mealId, adjustedMacros || profile.macros);
    setTodayMealPlan(updated);
    setStored(`pulse_meals_${getTodayDate()}`, updated);
  }, [todayMealPlan, profile, adjustedMacros, getTodayDate]);

  const logMeal = useCallback((mealSlotId: string, foodId: string, servings: number) => {
    const log: MealLog = { date: getTodayDate(), mealSlotId, foodId, servings, loggedAt: new Date().toISOString() };
    const updated = [...mealLogs, log];
    setMealLogs(updated);
    setStored('pulse_meal_logs', updated);

    if (todayMealPlan) {
      const updatedPlan = {
        ...todayMealPlan,
        meals: todayMealPlan.meals.map(m =>
          m.id === mealSlotId ? { ...m, logged: true, loggedAt: new Date().toISOString() } : m
        ),
      };
      setTodayMealPlan(updatedPlan);
      setStored(`pulse_meals_${getTodayDate()}`, updatedPlan);
    }
  }, [mealLogs, todayMealPlan, getTodayDate]);

  const logWorkout = useCallback((session: WorkoutSession) => {
    const updated = [...workoutSessions, session];
    setWorkoutSessions(updated);
    setStored('pulse_workout_sessions', updated);
  }, [workoutSessions]);

  const logRecovery = useCallback((entry: RecoveryEntry) => {
    const updated = [...recoveryEntries.filter(e => e.date !== entry.date), entry];
    setRecoveryEntries(updated);
    setStored('pulse_recovery', updated);
  }, [recoveryEntries]);

  const logJournal = useCallback((entry: JournalEntry) => {
    const updated = [...journalEntries, entry];
    setJournalEntries(updated);
    setStored('pulse_journal', updated);
  }, [journalEntries]);

  const updateLastActive = useCallback(() => {
    if (!profile) return;
    const updated = { ...profile, lastActiveDate: getTodayDate() };
    setProfile(updated);
    setStored('pulse_profile', updated);
    setGapAnalysis(null);
  }, [profile, getTodayDate]);

  const todayRecovery = recoveryEntries.find(e => e.date === getTodayDate())
    ? calculateRecoveryScore(recoveryEntries.find(e => e.date === getTodayDate())!)
    : null;

  const dayOfWeek = new Date().getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const todayWorkout = weeklyWorkouts.length > 0 && adjustedDay < weeklyWorkouts.length
    ? weeklyWorkouts[adjustedDay]
    : null;

  return (
    <AppContext.Provider value={{
      profile, todayMealPlan, weeklyWorkouts, todayWorkout, workoutSessions,
      recoveryEntries, todayRecovery, journalEntries, mealLogs, gapAnalysis, adjustedMacros,
      saveProfile, regenerateMealPlan, swapMealInPlan, logMeal, logWorkout,
      logRecovery, logJournal, updateLastActive, getTodayDate,
    }}>
      {children}
    </AppContext.Provider>
  );
}
