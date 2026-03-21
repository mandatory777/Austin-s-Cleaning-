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
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <p className="text-gray-400">Loading your meal plan...</p>
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
    <div className="min-h-screen bg-[#e0e5ec] pb-28">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-700">Today&apos;s Meals</h1>
            <p className="text-sm text-gray-500">{todayStr}</p>
          </div>
          <Link
            href="/meals/shopping"
            className="neu-btn-accent text-sm py-2 px-4"
          >
            Shopping List
          </Link>
        </div>

        {/* Adjusted macros info */}
        {macrosAdjusted && (
          <div className="neu-flat p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-purple-600">Macros adjusted for today&apos;s workout</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {adjustedMacros!.calories} kcal | {adjustedMacros!.protein}g protein | {adjustedMacros!.carbs}g carbs | {adjustedMacros!.fat}g fat
              </p>
            </div>
          </div>
        )}

        {/* Macro totals summary */}
        <div className="neu-flat p-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-rose-500">{Math.round(todayMealPlan.totalCalories)}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div>
              <p className="text-lg font-bold text-violet-500">{Math.round(todayMealPlan.totalProtein)}g</p>
              <p className="text-xs text-gray-500">protein</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-500">{Math.round(todayMealPlan.totalCarbs)}g</p>
              <p className="text-xs text-gray-500">carbs</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-500">{Math.round(todayMealPlan.totalFat)}g</p>
              <p className="text-xs text-gray-500">fat</p>
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
            className="neu-btn w-full py-3 text-gray-500 font-medium"
          >
            Regenerate Plan
          </button>

          <div className="neu-flat p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Pantry Mode
            </label>
            <p className="text-xs text-gray-500">
              Enter ingredients you have, and we&apos;ll build a plan around them.
            </p>
            <input
              type="text"
              value={pantryInput}
              onChange={e => setPantryInput(e.target.value)}
              placeholder="chicken, rice, broccoli, eggs..."
              className="neu-input text-sm"
            />
            <button
              onClick={handlePantryMode}
              disabled={!pantryInput.trim()}
              className="neu-btn-accent w-full py-2.5 text-sm disabled:opacity-50"
            >
              Generate from Pantry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
