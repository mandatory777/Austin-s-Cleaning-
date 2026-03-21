'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { getStored } from '@/lib/storage';
import LifeHappensBanner from '@/components/LifeHappensBanner';
import MacroRing from '@/components/MacroRing';
import VirtualPet from '@/components/VirtualPet';
import Link from 'next/link';
import {
  loadStats, getLevelFromXP, getLevelTitle, getCompanionMessage,
  getDailyChallenges, updateStreak, saveStats, checkAndUnlockAchievements,
  loadUnlockedAchievements,
} from '@/lib/achievements';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
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

  const [stats, setStats] = useState(loadStats());
  const today = new Date().toISOString().split('T')[0];
  const challenges = useMemo(() => getDailyChallenges(today), [today]);
  const levelInfo = useMemo(() => getLevelFromXP(stats.xp), [stats.xp]);
  const companionMsg = useMemo(() => getCompanionMessage(stats, getTimeOfDay()), [stats]);
  const achievementCount = useMemo(() => loadUnlockedAchievements().length, []);

  useEffect(() => {
    if (loading) return;
    const session = getStored<{ loggedIn: boolean } | null>('pulse_session', null);
    if (!session?.loggedIn) {
      router.replace('/login');
    } else if (!profile) {
      router.replace('/onboarding');
    } else {
      updateLastActive();
      // Update streak
      const current = loadStats();
      const updated = updateStreak(current, today);
      saveStats(updated);
      checkAndUnlockAchievements(updated);
      setStats(updated);
    }
  }, [loading, profile, router, updateLastActive, today]);

  if (loading || !profile) return null;

  const macroTargets = profile.macros;
  const loggedMeals = todayMealPlan?.meals.filter(m => m.logged) ?? [];
  const loggedCalories = loggedMeals.reduce((s, m) => s + m.food.calories * m.servings, 0);
  const loggedProtein = loggedMeals.reduce((s, m) => s + m.food.protein * m.servings, 0);
  const loggedCarbs = loggedMeals.reduce((s, m) => s + m.food.carbs * m.servings, 0);
  const loggedFat = loggedMeals.reduce((s, m) => s + m.food.fat * m.servings, 0);
  const xpPct = Math.round((levelInfo.currentXP / levelInfo.nextLevelXP) * 100);
  const completedChallenges = challenges.filter(c => c.completed).length;

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-28">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Greeting + Level + Streak */}
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-5 -mx-4 px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-700">
                {getGreeting()}, {profile.name}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {/* Streak badge */}
            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-bold">{stats.currentStreak}</span>
              </div>
            )}
          </div>

          {/* Level bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-violet-600">Lv.{stats.level}</span>
              <span className="text-[10px] text-gray-400">{getLevelTitle(stats.level)}</span>
            </div>
            <div className="flex-1 h-2 rounded-full" style={{ boxShadow: 'inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #c084fc, #8b5cf6)' }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{levelInfo.currentXP}/{levelInfo.nextLevelXP} XP</span>
          </div>

          {/* Companion message */}
          <p className="text-xs text-violet-500 mt-2 font-medium">{companionMsg}</p>
        </div>

        {/* Life Happens Banner */}
        {gapAnalysis && <LifeHappensBanner gap={gapAnalysis} onDismiss={() => updateLastActive()} />}

        {/* Daily Challenges */}
        <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #fef3c7 50%, #ede9fe 100%)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Daily Challenges
            </h2>
            <span className="text-xs font-bold text-amber-500">{completedChallenges}/{challenges.length} done</span>
          </div>
          <div className="space-y-2">
            {challenges.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  c.completed ? 'bg-green-50' : 'bg-white/30'
                }`}
              >
                <span className="text-lg">{c.completed ? '✅' : c.emoji}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${c.completed ? 'text-green-600 line-through' : 'text-gray-700'}`}>
                    {c.title}
                  </div>
                  <div className="text-[10px] text-gray-400">{c.description}</div>
                </div>
                <span className="text-[10px] font-bold text-amber-500">+{c.xpReward} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Rings */}
        <div className="neu-flat-purple p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Today&apos;s Nutrition
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <MacroRing label="Calories" current={loggedCalories} target={macroTargets.calories} unit="kcal" color="#f43f5e" />
            <MacroRing label="Protein" current={loggedProtein} target={macroTargets.protein} unit="g" color="#8b5cf6" />
            <MacroRing label="Carbs" current={loggedCarbs} target={macroTargets.carbs} unit="g" color="#f59e0b" />
            <MacroRing label="Fat" current={loggedFat} target={macroTargets.fat} unit="g" color="#10b981" />
          </div>
        </div>

        {/* Virtual Pet */}
        <VirtualPet />

        {/* Today's Workout */}
        <Link href="/workouts" className="block">
          <div className="neu-flat-rose p-5 hover:shadow-none transition-shadow" style={{ borderLeft: '4px solid #f43f5e' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Today&apos;s Workout</h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {todayWorkout ? (
              <div>
                <h3 className="text-lg font-bold text-gray-700">{todayWorkout.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-500">{todayWorkout.exercises.length} exercises</span>
                  <span className="text-sm text-gray-500">~{todayWorkout.estimatedMinutes} min</span>
                  <span className={`neu-badge ${todayWorkout.intensity === 'light' ? 'text-green-600' : todayWorkout.intensity === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {todayWorkout.intensity}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Rest day - enjoy your recovery!</p>
            )}
          </div>
        </Link>

        {/* Running */}
        <Link href="/running" className="block">
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)', borderLeft: '4px solid #14b8a6' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Running</h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Track runs, set goals, beat your PRs 🏃</p>
          </div>
        </Link>

        {/* Wellness */}
        <Link href="/wellness" className="block">
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #e0e7ff 100%)', borderLeft: '4px solid #6366f1' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Wellness</h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Breathe, check in, sleep better 🧘</p>
          </div>
        </Link>

        {/* Recovery */}
        <Link href="/recovery" className="block">
          <div className="neu-flat-blue p-5 hover:shadow-none transition-shadow" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recovery</h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {todayRecovery ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${todayRecovery.total >= 80 ? 'text-green-500' : todayRecovery.total >= 60 ? 'text-yellow-500' : todayRecovery.total >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                    {todayRecovery.total}
                  </span>
                  <span className="text-gray-400 text-sm">/100</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{todayRecovery.recommendation}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Log your recovery to get today&apos;s score</p>
            )}
          </div>
        </Link>

        {/* Journal */}
        <Link href="/journal" className="block">
          <div className="neu-flat p-5 hover:shadow-none transition-shadow" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Food Journal</h2>
                <p className="text-gray-500 text-sm mt-1">How did your meals make you feel today?</p>
              </div>
              <div className="text-2xl">&#128221;</div>
            </div>
          </div>
        </Link>

        {/* Achievements preview */}
        <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #fef3c7 50%, #fce4ec 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Achievements</h2>
              <p className="text-gray-500 text-sm mt-1">{achievementCount} badges unlocked · {stats.xp} total XP</p>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>
    </div>
  );
}
