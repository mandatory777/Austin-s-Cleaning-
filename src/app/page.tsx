'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { getStored } from '@/lib/storage';
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
    loading,
    profile,
    gapAnalysis,
    todayMealPlan,
    todayWorkout,
    todayRecovery,
    updateLastActive,
  } = useApp();

  useEffect(() => {
    if (loading) return; // Wait for localStorage to load first
    const session = getStored<{ loggedIn: boolean } | null>('pulse_session', null);
    if (!session?.loggedIn) {
      router.replace('/login');
    } else if (!profile) {
      router.replace('/onboarding');
    } else {
      updateLastActive();
    }
  }, [loading, profile, router, updateLastActive]);

  if (loading || !profile) return null;

  const macroTargets = profile.macros;
  // Count logged meals for consumed progress
  const loggedMeals = todayMealPlan?.meals.filter(m => m.logged) ?? [];
  const loggedCalories = loggedMeals.reduce((s, m) => s + m.food.calories * m.servings, 0);
  const loggedProtein = loggedMeals.reduce((s, m) => s + m.food.protein * m.servings, 0);
  const loggedCarbs = loggedMeals.reduce((s, m) => s + m.food.carbs * m.servings, 0);
  const loggedFat = loggedMeals.reduce((s, m) => s + m.food.fat * m.servings, 0);

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-28">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-700">
            {getGreeting()}, {profile.name}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Life Happens Banner */}
        {gapAnalysis && <LifeHappensBanner gap={gapAnalysis} onDismiss={() => updateLastActive()} />}

        {/* Macro Rings */}
        <div className="neu-flat p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
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
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ borderLeft: '4px solid #f43f5e' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Today&apos;s Workout
              </h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {todayWorkout ? (
              <div>
                <h3 className="text-lg font-bold text-gray-700">{todayWorkout.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-500">
                    {todayWorkout.exercises.length} exercises
                  </span>
                  <span className="text-sm text-gray-500">
                    ~{todayWorkout.estimatedMinutes} min
                  </span>
                  <span className={`neu-badge ${
                    todayWorkout.intensity === 'light'
                      ? 'text-green-600'
                      : todayWorkout.intensity === 'moderate'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {todayWorkout.intensity}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Rest day - enjoy your recovery!</p>
            )}
          </div>
        </Link>

        {/* Recovery Score */}
        <Link href="/recovery" className="block">
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Recovery
              </h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="text-gray-400 text-sm">/100</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{todayRecovery.recommendation}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Log your recovery to get today&apos;s score
              </p>
            )}
          </div>
        </Link>

        {/* Journal Prompt */}
        <Link href="/journal" className="block">
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ background: 'linear-gradient(135deg, #e0e5ec 60%, #fde68a 150%)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">
                  Food Journal
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  How did your meals make you feel today?
                </p>
              </div>
              <div className="text-2xl">&#128221;</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
