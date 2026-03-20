'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import LifeHappensBanner from '@/components/LifeHappensBanner';
import MacroRing from '@/components/MacroRing';
import Link from 'next/link';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    profile,
    gapAnalysis,
    todayMealPlan,
    todayWorkout,
    todayRecovery,
    updateLastActive,
  } = useApp();

  useEffect(() => {
    if (!profile) {
      router.replace('/onboarding');
    } else {
      updateLastActive();
    }
  }, [profile, router, updateLastActive]);

  if (!profile) return null;

  const macroTargets = profile.macros;
  // Count logged meals for consumed progress
  const loggedMeals = todayMealPlan?.meals.filter(m => m.logged) ?? [];
  const loggedCalories = loggedMeals.reduce((s, m) => s + m.food.calories * m.servings, 0);
  const loggedProtein = loggedMeals.reduce((s, m) => s + m.food.protein * m.servings, 0);
  const loggedCarbs = loggedMeals.reduce((s, m) => s + m.food.carbs * m.servings, 0);
  const loggedFat = loggedMeals.reduce((s, m) => s + m.food.fat * m.servings, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {getGreeting()}, {profile.name}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Life Happens Banner */}
        {gapAnalysis && <LifeHappensBanner gap={gapAnalysis} onDismiss={() => updateLastActive()} />}

        {/* Macro Rings */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Today&apos;s Nutrition
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <MacroRing
              label="Calories"
              current={loggedCalories}
              target={macroTargets.calories}
              unit="kcal"
              color="#f43f5e"
            />
            <MacroRing
              label="Protein"
              current={loggedProtein}
              target={macroTargets.protein}
              unit="g"
              color="#8b5cf6"
            />
            <MacroRing
              label="Carbs"
              current={loggedCarbs}
              target={macroTargets.carbs}
              unit="g"
              color="#f59e0b"
            />
            <MacroRing
              label="Fat"
              current={loggedFat}
              target={macroTargets.fat}
              unit="g"
              color="#10b981"
            />
          </div>
        </div>

        {/* Today's Workout */}
        <Link href="/workouts" className="block">
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Today&apos;s Workout
              </h2>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {todayWorkout ? (
              <div>
                <h3 className="text-lg font-bold text-slate-800">{todayWorkout.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-slate-500">
                    {todayWorkout.exercises.length} exercises
                  </span>
                  <span className="text-sm text-slate-500">
                    ~{todayWorkout.estimatedMinutes} min
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    todayWorkout.intensity === 'light'
                      ? 'bg-green-100 text-green-700'
                      : todayWorkout.intensity === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {todayWorkout.intensity}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Rest day - enjoy your recovery!</p>
            )}
          </div>
        </Link>

        {/* Recovery Score */}
        <Link href="/recovery" className="block">
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Recovery
              </h2>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {todayRecovery ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${
                    todayRecovery.total >= 80
                      ? 'text-green-500'
                      : todayRecovery.total >= 60
                      ? 'text-yellow-500'
                      : todayRecovery.total >= 40
                      ? 'text-orange-500'
                      : 'text-red-500'
                  }`}>
                    {todayRecovery.total}
                  </span>
                  <span className="text-slate-400 text-sm">/100</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{todayRecovery.recommendation}</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                Log your recovery to get today&apos;s score
              </p>
            )}
          </div>
        </Link>

        {/* Journal Prompt */}
        <Link href="/journal" className="block">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-rose-600 uppercase tracking-wide">
                  Food Journal
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  How did your meals make you feel today?
                </p>
              </div>
              <div className="text-2xl">📝</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
