'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import MealCard from '@/components/MealCard';
import { AIMealPlan, AIRecipe } from '@/lib/ai-meals';
import { getStored, setStored } from '@/lib/storage';
import Link from 'next/link';

const CUISINE_OPTIONS = ['American', 'Mediterranean', 'Asian', 'Mexican', 'Indian', 'Japanese', 'Italian', 'Korean', 'Middle Eastern'];
const AVOID_OPTIONS = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Shellfish', 'Eggs', 'Pork', 'Red Meat'];

export default function MealsPage() {
  const { profile, adjustedMacros, getTodayDate } = useApp();

  const [aiPlan, setAiPlan] = useState<AIMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrefs, setShowPrefs] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedAvoid, setSelectedAvoid] = useState<string[]>([]);
  const [swappingId, setSwappingId] = useState<string | null>(null);

  const today = getTodayDate();

  // Load cached plan on mount
  useEffect(() => {
    const cached = getStored<AIMealPlan | null>(`pulse_ai_meals_${today}`, null);
    if (cached) {
      setAiPlan(cached);
    }
  }, [today]);

  const generatePlan = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    setError('');

    try {
      const macros = adjustedMacros || profile.macros;
      const res = await fetch('/api/meals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: profile.goal,
          macros,
          profile: {
            age: profile.age,
            sex: profile.sex,
            weight: profile.weight,
            height: profile.height,
            activityLevel: profile.activityLevel,
            name: profile.name,
          },
          preferences: {
            cuisines: selectedCuisines.length > 0 ? selectedCuisines : undefined,
            avoid: selectedAvoid.length > 0 ? selectedAvoid : undefined,
          },
          date: today,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate');
      }

      const plan: AIMealPlan = await res.json();
      setAiPlan(plan);
      setStored(`pulse_ai_meals_${today}`, plan);
      setShowPrefs(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [profile, adjustedMacros, selectedCuisines, selectedAvoid, today]);

  const logMeal = (mealId: string) => {
    if (!aiPlan) return;
    const updated: AIMealPlan = {
      ...aiPlan,
      meals: aiPlan.meals.map(m =>
        m.id === mealId ? { ...m, logged: true } : m
      ),
    };
    setAiPlan(updated);
    setStored(`pulse_ai_meals_${today}`, updated);
  };

  const swapMeal = async (mealId: string) => {
    if (!profile || !aiPlan) return;
    setSwappingId(mealId);
    setError('');

    try {
      const mealToSwap = aiPlan.meals.find(m => m.id === mealId);
      if (!mealToSwap) return;

      const macros = adjustedMacros || profile.macros;
      const res = await fetch('/api/meals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: profile.goal,
          macros,
          profile: {
            age: profile.age,
            sex: profile.sex,
            weight: profile.weight,
            height: profile.height,
            activityLevel: profile.activityLevel,
            name: profile.name,
          },
          preferences: {
            cuisines: selectedCuisines.length > 0 ? selectedCuisines : undefined,
            avoid: selectedAvoid.length > 0 ? selectedAvoid : undefined,
          },
          date: today + '-swap-' + Date.now(),
        }),
      });

      if (!res.ok) throw new Error('Failed to swap');

      const newPlan: AIMealPlan = await res.json();
      const replacement = newPlan.meals.find(m => m.slotType === mealToSwap.slotType);

      if (replacement) {
        const updated: AIMealPlan = {
          ...aiPlan,
          meals: aiPlan.meals.map(m =>
            m.id === mealId ? { ...replacement, id: mealId, logged: false } : m
          ),
        };
        // Recalculate totals
        updated.totalCalories = updated.meals.reduce((s, m) => s + m.macros.calories, 0);
        updated.totalProtein = updated.meals.reduce((s, m) => s + m.macros.protein, 0);
        updated.totalCarbs = updated.meals.reduce((s, m) => s + m.macros.carbs, 0);
        updated.totalFat = updated.meals.reduce((s, m) => s + m.macros.fat, 0);

        setAiPlan(updated);
        setStored(`pulse_ai_meals_${today}`, updated);
      }
    } catch {
      setError('Failed to swap meal. Try again.');
    } finally {
      setSwappingId(null);
    }
  };

  const toggleCuisine = (c: string) => {
    setSelectedCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const toggleAvoid = (a: string) => {
    setSelectedAvoid(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  if (!profile) return null;

  const macros = adjustedMacros || profile.macros;
  const goalLabel = profile.goal === 'weight_loss' ? 'Weight Loss' : profile.goal === 'muscle_gain' ? 'Muscle Gain' : 'Wellness';
  const loggedCount = aiPlan?.meals.filter(m => m.logged).length ?? 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // No plan yet — show generation screen
  if (!aiPlan) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] pb-24">
        <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <h1 className="text-2xl font-bold text-gray-700">Meal Planner</h1>
            </div>
            <p className="text-sm text-gray-500">{todayStr}</p>
          </div>

          {/* Goal banner */}
          <div className="rounded-2xl p-5 text-center" style={{ boxShadow: '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff' }}>
            <div className="text-4xl mb-3">🍽️</div>
            <h2 className="text-lg font-bold text-gray-700 mb-1">
              Personalized for {goalLabel}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              {macros.calories} kcal · {macros.protein}g protein · {macros.carbs}g carbs · {macros.fat}g fat
            </p>
            <p className="text-xs text-gray-400">
              AI will create 5 meals with full recipes & cooking instructions tailored to your goals
            </p>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl p-5 space-y-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
            <button
              onClick={() => setShowPrefs(!showPrefs)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-sm font-semibold text-gray-600">Customize Preferences</h3>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPrefs ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPrefs && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Preferred Cuisines
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_OPTIONS.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleCuisine(c)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                          selectedCuisines.includes(c)
                            ? 'bg-emerald-500 text-white'
                            : 'text-gray-600'
                        }`}
                        style={selectedCuisines.includes(c) ? {} : { boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff' }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Avoid / Allergies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVOID_OPTIONS.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAvoid(a)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                          selectedAvoid.includes(a)
                            ? 'bg-red-500 text-white'
                            : 'text-gray-600'
                        }`}
                        style={selectedAvoid.includes(a) ? {} : { boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff' }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate button */}
          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Crafting your meals...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                Generate Meal Plan
              </span>
            )}
          </button>

          {error && (
            <div className="rounded-xl p-3 bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Has a plan — show it
  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-24">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-700">Today&apos;s Meals</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center gap-0.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{todayStr} · {goalLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/meals/shopping" className="text-xs font-semibold text-emerald-600 px-3 py-1.5 rounded-xl" style={{ boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff' }}>
                Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Macro summary */}
        <div className="rounded-2xl p-3" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff', background: 'linear-gradient(135deg, #e0e5ec 0%, #d1fae5 100%)' }}>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Daily Totals</span>
            <span className="text-[10px] font-bold text-emerald-500">{loggedCount}/{aiPlan.meals.length} logged</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center bg-white/50 rounded-xl py-2">
              <p className="text-sm font-bold text-rose-500">{Math.round(aiPlan.totalCalories)}</p>
              <p className="text-[9px] text-gray-400">kcal</p>
            </div>
            <div className="text-center bg-white/50 rounded-xl py-2">
              <p className="text-sm font-bold text-violet-500">{Math.round(aiPlan.totalProtein)}g</p>
              <p className="text-[9px] text-gray-400">protein</p>
            </div>
            <div className="text-center bg-white/50 rounded-xl py-2">
              <p className="text-sm font-bold text-amber-500">{Math.round(aiPlan.totalCarbs)}g</p>
              <p className="text-[9px] text-gray-400">carbs</p>
            </div>
            <div className="text-center bg-white/50 rounded-xl py-2">
              <p className="text-sm font-bold text-emerald-500">{Math.round(aiPlan.totalFat)}g</p>
              <p className="text-[9px] text-gray-400">fat</p>
            </div>
          </div>
        </div>

        {/* Adjusted macros notice */}
        {adjustedMacros && adjustedMacros.calories !== profile.macros.calories && (
          <div className="rounded-xl p-3 bg-purple-50/50 flex items-center gap-2" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
            <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-purple-600 font-medium">Macros boosted for today&apos;s workout</p>
          </div>
        )}

        {/* Meal cards */}
        <div className="space-y-3">
          {aiPlan.meals.map((meal: AIRecipe) => (
            <div key={meal.id} className="relative">
              {swappingId === meal.id && (
                <div className="absolute inset-0 bg-[#e0e5ec]/80 rounded-2xl z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Finding a new recipe...
                  </div>
                </div>
              )}
              <MealCard
                meal={meal}
                onLog={() => logMeal(meal.id)}
                onSwap={() => swapMeal(meal.id)}
              />
            </div>
          ))}
        </div>

        {/* Regenerate */}
        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full py-3 rounded-2xl text-gray-600 font-medium text-sm transition-all disabled:opacity-50"
          style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Regenerating...
            </span>
          ) : (
            'Regenerate Plan'
          )}
        </button>

        {error && (
          <div className="rounded-xl p-3 bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
