'use client';

import { useState } from 'react';
import { AIRecipe } from '@/lib/ai-meals';

const slotColors: Record<string, string> = {
  breakfast: '#fb923c',
  snack_am: '#facc15',
  lunch: '#34d399',
  snack_pm: '#facc15',
  dinner: '#818cf8',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

interface MealCardProps {
  meal: AIRecipe;
  onLog: () => void;
  onSwap: () => void;
}

export default function MealCard({ meal, onLog, onSwap }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl transition-all overflow-hidden ${
        meal.logged ? 'opacity-60' : ''
      }`}
      style={{
        boxShadow: meal.logged
          ? 'inset 2px 2px 5px #b8bec7, inset -2px -2px 5px #ffffff'
          : '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
        borderLeft: `4px solid ${slotColors[meal.slotType] || '#9ca3af'}`,
        background: '#e0e5ec',
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {meal.slotLabel}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 font-semibold flex items-center gap-0.5">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                AI
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-700 leading-tight flex items-center gap-2">
              {meal.name}
              {meal.logged && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{meal.description}</p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 mt-1 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{meal.cuisineType}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColors[meal.difficulty]}`}>{meal.difficulty}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {meal.prepTime + meal.cookTime} min
          </span>
        </div>

        {/* Macros */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 text-center bg-rose-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-rose-500">{meal.macros.calories}</p>
            <p className="text-[9px] text-gray-400">kcal</p>
          </div>
          <div className="flex-1 text-center bg-violet-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-violet-500">{meal.macros.protein}g</p>
            <p className="text-[9px] text-gray-400">protein</p>
          </div>
          <div className="flex-1 text-center bg-amber-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-amber-500">{meal.macros.carbs}g</p>
            <p className="text-[9px] text-gray-400">carbs</p>
          </div>
          <div className="flex-1 text-center bg-emerald-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-emerald-500">{meal.macros.fat}g</p>
            <p className="text-[9px] text-gray-400">fat</p>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200/50 pt-3">
          {/* Ingredients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
              </svg>
              Ingredients
            </h4>
            <ul className="space-y-1">
              {meal.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <span className="font-medium">{ing.amount} {ing.unit}</span> {ing.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              How to Cook
            </h4>
            <ol className="space-y-2">
              {meal.instructions.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Goal tip */}
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-3">
            <p className="text-xs text-violet-600 font-medium flex items-start gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              {meal.goalTip}
            </p>
          </div>

          {/* Prep/Cook time detail */}
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Prep: {meal.prepTime} min
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Cook: {meal.cookTime} min
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onLog(); }}
          disabled={meal.logged}
          className={`flex-1 text-sm font-medium transition-all py-2 rounded-xl ${
            meal.logged
              ? 'text-green-600 cursor-default'
              : 'text-white'
          }`}
          style={meal.logged
            ? { boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }
            : { background: 'linear-gradient(135deg, #34d399, #10b981)', boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' }
          }
        >
          {meal.logged ? '✓ Logged' : 'Log Meal'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSwap(); }}
          disabled={meal.logged}
          className="flex-1 text-sm font-medium py-2 rounded-xl text-gray-600 disabled:opacity-40"
          style={{ boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' }}
        >
          Swap
        </button>
      </div>
    </div>
  );
}
