'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import MealCard from '@/components/MealCard';
import Link from 'next/link';

export default function MealsPage() {
  const {
    profile,
    todayMealPlan,
    adjustedMacros,
    logMeal,
    swapMealInPlan,
    regenerateMealPlan,
  } = useApp();

  const [pantryInput, setPantryInput] = useState('');

  if (!profile || !todayMealPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading your meal plan...</p>
      </div>
    );
  }

  const macrosAdjusted = adjustedMacros &&
    (adjustedMacros.calories !== profile.macros.calories ||
     adjustedMacros.protein !== profile.macros.protein);

  const handlePantryMode = () => {
    const items = pantryInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (items.length > 0) {
      regenerateMealPlan(items);
      setPantryInput('');
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Today&apos;s Meals</h1>
            <p className="text-sm text-slate-500">{todayStr}</p>
          </div>
          <Link
            href="/meals/shopping"
            className="text-sm font-medium text-rose-500 hover:text-rose-600"
          >
            Shopping List
          </Link>
        </div>

        {/* Adjusted macros info */}
        {macrosAdjusted && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-700">Macros adjusted for today&apos;s workout</p>
              <p className="text-xs text-blue-600 mt-0.5">
                {adjustedMacros!.calories} kcal | {adjustedMacros!.protein}g protein | {adjustedMacros!.carbs}g carbs | {adjustedMacros!.fat}g fat
              </p>
            </div>
          </div>
        )}

        {/* Macro totals summary */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-rose-500">{Math.round(todayMealPlan.totalCalories)}</p>
              <p className="text-xs text-slate-500">kcal</p>
            </div>
            <div>
              <p className="text-lg font-bold text-violet-500">{Math.round(todayMealPlan.totalProtein)}g</p>
              <p className="text-xs text-slate-500">protein</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-500">{Math.round(todayMealPlan.totalCarbs)}g</p>
              <p className="text-xs text-slate-500">carbs</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-500">{Math.round(todayMealPlan.totalFat)}g</p>
              <p className="text-xs text-slate-500">fat</p>
            </div>
          </div>
        </div>

        {/* Meal cards */}
        <div className="space-y-3">
          {todayMealPlan.meals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onLog={() => logMeal(meal.id, meal.food.id, meal.servings)}
              onSwap={() => swapMealInPlan(meal.id)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => regenerateMealPlan()}
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
          >
            Regenerate Plan
          </button>

          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Pantry Mode
            </label>
            <p className="text-xs text-slate-500">
              Enter ingredients you have, and we&apos;ll build a plan around them.
            </p>
            <input
              type="text"
              value={pantryInput}
              onChange={e => setPantryInput(e.target.value)}
              placeholder="chicken, rice, broccoli, eggs..."
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <button
              onClick={handlePantryMode}
              disabled={!pantryInput.trim()}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50 transition-colors"
            >
              Generate from Pantry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
