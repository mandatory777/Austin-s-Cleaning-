'use client';

import { MealSlot } from '@/lib/meals';

interface MealCardProps {
  meal: MealSlot;
  onLog: () => void;
  onSwap: () => void;
}

export default function MealCard({ meal, onLog, onSwap }: MealCardProps) {
  const cals = Math.round(meal.food.calories * meal.servings);
  const protein = Math.round(meal.food.protein * meal.servings);
  const carbs = Math.round(meal.food.carbs * meal.servings);
  const fat = Math.round(meal.food.fat * meal.servings);

  return (
    <div
      className={`rounded-xl border bg-white p-4 transition-opacity ${
        meal.logged ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {meal.label}
          </span>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            {meal.food.name}
            {meal.logged && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </h3>
        </div>
      </div>

      <div className="flex gap-3 text-xs text-slate-500 mb-3">
        <span className="font-medium text-slate-700">{cals} cal</span>
        <span>P: {protein}g</span>
        <span>C: {carbs}g</span>
        <span>F: {fat}g</span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        {meal.servings} x {meal.food.serving}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onLog}
          disabled={meal.logged}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            meal.logged
              ? 'bg-green-100 text-green-600 cursor-default'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
          }`}
        >
          {meal.logged ? 'Logged' : 'Log'}
        </button>
        <button
          onClick={onSwap}
          disabled={meal.logged}
          className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-default"
        >
          Swap
        </button>
      </div>
    </div>
  );
}
