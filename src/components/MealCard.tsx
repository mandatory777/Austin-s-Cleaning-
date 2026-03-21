'use client';

import { MealSlot } from '@/lib/meals';

const mealTypeColors: Record<string, string> = {
  breakfast: '#fb923c',
  snack_am: '#facc15',
  lunch: '#34d399',
  snack_pm: '#facc15',
  dinner: '#818cf8',
};

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
      className={`neu-flat p-4 transition-opacity ${
        meal.logged ? 'neu-pressed opacity-60' : ''
      }`}
      style={{ borderLeft: `4px solid ${mealTypeColors[meal.type] || '#9ca3af'}` }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {meal.label}
          </span>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
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

      <div className="flex gap-3 text-xs text-gray-500 mb-3">
        <span className="font-medium text-gray-700">{cals} cal</span>
        <span>P: {protein}g</span>
        <span>C: {carbs}g</span>
        <span>F: {fat}g</span>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        {meal.servings} x {meal.food.serving}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onLog}
          disabled={meal.logged}
          className={`flex-1 text-sm font-medium transition-all ${
            meal.logged
              ? 'neu-pressed text-green-600 cursor-default px-3 py-2 rounded-xl'
              : 'neu-btn-green'
          }`}
        >
          {meal.logged ? 'Logged' : 'Log'}
        </button>
        <button
          onClick={onSwap}
          disabled={meal.logged}
          className="flex-1 neu-btn text-sm disabled:opacity-50 disabled:cursor-default"
        >
          Swap
        </button>
      </div>
    </div>
  );
}
