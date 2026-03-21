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

  const workoutLabel = todayWorkout
    ? `${todayWorkout.name} · ${todayWorkout.exercises.length} exercises`
    : 'Rest day 😌';

  const recoveryLabel = todayRecovery
    ? `Score: ${todayRecovery.total}/100`
    : 'Log today\'s recovery';

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-24">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* ── Header: Greeting + Level + Streak ── */}
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-4 -mx-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-700 truncate">
                {getGreeting()}, {profile.name}
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {stats.currentStreak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                  <span className="text-xs">🔥</span>
                  <span className="text-[11px] font-bold">{stats.currentStreak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
                <span className="text-[11px] font-bold">Lv.{stats.level}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-gray-400 shrink-0">{getLevelTitle(stats.level)}</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ boxShadow: 'inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #c084fc, #8b5cf6)' }}
              />
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">{levelInfo.currentXP}/{levelInfo.nextLevelXP} XP</span>
          </div>

          {/* Companion message */}
          <p className="text-[11px] text-violet-500 mt-1.5 font-medium">{companionMsg}</p>
        </div>

        {/* Life Happens Banner */}
        {gapAnalysis && <LifeHappensBanner gap={gapAnalysis} onDismiss={() => updateLastActive()} />}

        {/* ── Daily Challenges — horizontal scroll ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Daily Challenges
            </h2>
            <span className="text-[11px] font-bold text-amber-500">{completedChallenges}/{challenges.length}</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {challenges.map(c => (
              <div
                key={c.id}
                className={`flex-shrink-0 w-36 rounded-xl p-3 transition-all ${
                  c.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-white/50 border border-white/60'
                }`}
                style={{ boxShadow: '2px 2px 6px #b8bec7, -2px -2px 6px #ffffff' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{c.completed ? '✅' : c.emoji}</span>
                  <span className="text-[10px] font-bold text-amber-500">+{c.xpReward}</span>
                </div>
                <div className={`text-xs font-medium leading-tight ${c.completed ? 'text-green-600 line-through' : 'text-gray-700'}`}>
                  {c.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nutrition Rings ── */}
        <div className="neu-flat-purple p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Today&apos;s Nutrition
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <MacroRing label="Calories" current={loggedCalories} target={macroTargets.calories} unit="kcal" color="#f43f5e" />
            <MacroRing label="Protein" current={loggedProtein} target={macroTargets.protein} unit="g" color="#8b5cf6" />
            <MacroRing label="Carbs" current={loggedCarbs} target={macroTargets.carbs} unit="g" color="#f59e0b" />
            <MacroRing label="Fat" current={loggedFat} target={macroTargets.fat} unit="g" color="#10b981" />
          </div>
        </div>

        {/* ── Virtual Pet (Water Tracker) ── */}
        <VirtualPet />

        {/* ── Quick Access Grid — 2 columns ── */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-3">

            {/* Workout */}
            <Link href="/workouts" className="block">
              <div className="rounded-2xl p-3.5 h-full hover:scale-[0.98] transition-transform" style={{
                background: 'linear-gradient(135deg, #e0e5ec 0%, #fce4ec 100%)',
                boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M12 6.5v11" />
                      <rect x="2" y="8" width="4" height="8" rx="1" /><rect x="18" y="8" width="4" height="8" rx="1" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Workout</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">{workoutLabel}</p>
              </div>
            </Link>

            {/* Running */}
            <Link href="/running" className="block">
              <div className="rounded-2xl p-3.5 h-full hover:scale-[0.98] transition-transform" style={{
                background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)',
                boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="17" cy="4" r="2" /><path d="M15.59 13.51l-4.09 4.09a2 2 0 0 1-2.83 0L7 16" />
                      <path d="M9.5 5.5L14 10l-3.5 3.5" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Running</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">Track runs & beat PRs 🏃</p>
              </div>
            </Link>

            {/* Recovery */}
            <Link href="/recovery" className="block">
              <div className="rounded-2xl p-3.5 h-full hover:scale-[0.98] transition-transform" style={{
                background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 100%)',
                boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Recovery</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">{recoveryLabel}</p>
              </div>
            </Link>

            {/* Wellness */}
            <Link href="/wellness" className="block">
              <div className="rounded-2xl p-3.5 h-full hover:scale-[0.98] transition-transform" style={{
                background: 'linear-gradient(135deg, #e0e5ec 0%, #e0e7ff 100%)',
                boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Wellness</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">Breathe & check in 🧘</p>
              </div>
            </Link>

            {/* Journal */}
            <Link href="/journal" className="block">
              <div className="rounded-2xl p-3.5 h-full hover:scale-[0.98] transition-transform" style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <span className="text-sm">📝</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Journal</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">How do you feel today?</p>
              </div>
            </Link>

            {/* Achievements */}
            <div className="rounded-2xl p-3.5 h-full" style={{
              background: 'linear-gradient(135deg, #e0e5ec 0%, #fef3c7 50%, #fce4ec 100%)',
              boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
            }}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
                  <span className="text-sm">🏆</span>
                </div>
                <h3 className="text-sm font-bold text-gray-700">Badges</h3>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">{achievementCount} unlocked · {stats.xp} XP</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
