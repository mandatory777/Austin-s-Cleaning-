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

type Tab = 'recipe' | 'nutrition' | 'tips';

export default function MealCard({ meal, onLog, onSwap }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('recipe');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleIngredient = (i: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Support both old string[] and new InstructionStep[] formats
  const instructions = meal.instructions.map(inst =>
    typeof inst === 'string' ? { step: inst } : inst
  );

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
          {meal.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-600">
              {tag}
            </span>
          ))}
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
          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
            {([
              { id: 'recipe' as Tab, label: 'Recipe', icon: '🍳' },
              { id: 'nutrition' as Tab, label: 'Nutrition', icon: '📊' },
              { id: 'tips' as Tab, label: 'Tips', icon: '💡' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-violet-700'
                    : 'text-gray-400'
                }`}
                style={activeTab === tab.id
                  ? { boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff', background: '#e0e5ec' }
                  : {}
                }
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* RECIPE TAB */}
          {activeTab === 'recipe' && (
            <div className="space-y-4">
              {/* Prep/Cook time */}
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Prep</p>
                    <p className="text-sm font-bold text-gray-700">{meal.prepTime} min</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Cook</p>
                    <p className="text-sm font-bold text-gray-700">{meal.cookTime} min</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Serves</p>
                    <p className="text-sm font-bold text-gray-700">{meal.servings}</p>
                  </div>
                </div>
              </div>

              {/* Ingredients with checkboxes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2.5 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="2" />
                  </svg>
                  Ingredients
                  <span className="text-[10px] font-normal text-gray-400 ml-auto">
                    {checkedIngredients.size}/{meal.ingredients.length}
                  </span>
                </h4>
                <ul className="space-y-1.5">
                  {meal.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      onClick={() => toggleIngredient(i)}
                      className={`flex items-start gap-2.5 text-sm cursor-pointer py-1.5 px-2 rounded-lg transition-all ${
                        checkedIngredients.has(i) ? 'bg-green-50/70' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <span className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        checkedIngredients.has(i)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {checkedIngredients.has(i) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`transition-all ${checkedIngredients.has(i) ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-semibold">{ing.amount} {ing.unit}</span> {ing.item}
                      </span>
                      <span className="text-[9px] ml-auto px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 shrink-0">
                        {ing.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-step instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2.5 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  How to Cook
                  <span className="text-[10px] font-normal text-gray-400 ml-auto">
                    {completedSteps.size}/{instructions.length} steps
                  </span>
                </h4>
                <ol className="space-y-3">
                  {instructions.map((inst, i) => (
                    <li
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={`rounded-xl p-3 cursor-pointer transition-all ${
                        completedSteps.has(i)
                          ? 'bg-green-50/70'
                          : ''
                      }`}
                      style={!completedSteps.has(i) ? { boxShadow: 'inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff' } : {}}
                    >
                      <div className="flex gap-2.5">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 transition-all ${
                          completedSteps.has(i)
                            ? 'bg-green-500 text-white'
                            : 'bg-violet-100 text-violet-600'
                        }`}>
                          {completedSteps.has(i) ? '✓' : i + 1}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed transition-all ${
                            completedSteps.has(i) ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            {inst.step}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            {inst.duration && (
                              <span className="text-[10px] text-blue-500 flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                {inst.duration}
                              </span>
                            )}
                          </div>
                          {inst.tip && (
                            <div className="mt-2 bg-amber-50 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5">
                              <span className="text-[10px]">💡</span>
                              <p className="text-[11px] text-amber-700 leading-snug">{inst.tip}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Serving suggestion */}
              {meal.servingSuggestion && (
                <div className="rounded-xl p-3 bg-gradient-to-r from-orange-50 to-amber-50">
                  <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                    <span>🍽️</span> Serving Suggestion
                  </p>
                  <p className="text-xs text-amber-600 leading-relaxed">{meal.servingSuggestion}</p>
                </div>
              )}
            </div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              {/* Detailed macro breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-1.5">
                  <span>📊</span> Full Nutrition Breakdown
                </h4>

                {/* Macro bars */}
                {[
                  { label: 'Calories', value: meal.macros.calories, unit: 'kcal', max: meal.macros.calories, color: '#f43f5e', bg: 'bg-rose-50' },
                  { label: 'Protein', value: meal.macros.protein, unit: 'g', max: Math.max(meal.macros.protein, meal.macros.carbs, meal.macros.fat), color: '#8b5cf6', bg: 'bg-violet-50' },
                  { label: 'Carbs', value: meal.macros.carbs, unit: 'g', max: Math.max(meal.macros.protein, meal.macros.carbs, meal.macros.fat), color: '#f59e0b', bg: 'bg-amber-50' },
                  { label: 'Fat', value: meal.macros.fat, unit: 'g', max: Math.max(meal.macros.protein, meal.macros.carbs, meal.macros.fat), color: '#10b981', bg: 'bg-emerald-50' },
                  ...(meal.macros.fiber ? [{ label: 'Fiber', value: meal.macros.fiber, unit: 'g', max: 40, color: '#6366f1', bg: 'bg-indigo-50' }] : []),
                  ...(meal.macros.sugar !== undefined ? [{ label: 'Sugar', value: meal.macros.sugar, unit: 'g', max: 50, color: '#ec4899', bg: 'bg-pink-50' }] : []),
                  ...(meal.macros.sodium !== undefined ? [{ label: 'Sodium', value: meal.macros.sodium, unit: 'mg', max: 2300, color: '#78716c', bg: 'bg-stone-50' }] : []),
                ].map(macro => (
                  <div key={macro.label} className={`rounded-xl px-3 py-2.5 ${macro.bg}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">{macro.label}</span>
                      <span className="text-sm font-bold" style={{ color: macro.color }}>
                        {macro.value}{macro.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (macro.value / macro.max) * 100)}%`,
                          backgroundColor: macro.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Calorie source breakdown */}
              <div className="rounded-xl p-3" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
                <h4 className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Calorie Sources</h4>
                <div className="flex gap-1.5 h-4 rounded-full overflow-hidden">
                  <div
                    className="rounded-l-full"
                    style={{
                      width: `${Math.round((meal.macros.protein * 4 / meal.macros.calories) * 100)}%`,
                      background: '#8b5cf6',
                    }}
                  />
                  <div
                    style={{
                      width: `${Math.round((meal.macros.carbs * 4 / meal.macros.calories) * 100)}%`,
                      background: '#f59e0b',
                    }}
                  />
                  <div
                    className="rounded-r-full"
                    style={{
                      width: `${Math.round((meal.macros.fat * 9 / meal.macros.calories) * 100)}%`,
                      background: '#10b981',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Protein {Math.round((meal.macros.protein * 4 / meal.macros.calories) * 100)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Carbs {Math.round((meal.macros.carbs * 4 / meal.macros.calories) * 100)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Fat {Math.round((meal.macros.fat * 9 / meal.macros.calories) * 100)}%
                  </span>
                </div>
              </div>

              {/* Goal tip */}
              <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-3">
                <p className="text-xs font-bold text-violet-700 mb-1 flex items-center gap-1.5">
                  <span>🎯</span> Goal Fit
                </p>
                <p className="text-xs text-violet-600 leading-relaxed">{meal.goalTip}</p>
              </div>

              {/* Nutrition notes */}
              {meal.nutritionNotes && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1.5">
                    <span>🔬</span> Nutrition Deep Dive
                  </p>
                  <p className="text-xs text-blue-600 leading-relaxed">{meal.nutritionNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TIPS TAB */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              {/* Chef tips */}
              {meal.chefTips && meal.chefTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2.5 flex items-center gap-1.5">
                    <span>👨‍🍳</span> Chef Tips
                  </h4>
                  <div className="space-y-2">
                    {meal.chefTips.map((tip, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3 flex items-start gap-2.5"
                        style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}
                      >
                        <span className="text-amber-500 text-sm shrink-0 mt-0.5">💡</span>
                        <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Substitutions */}
              {meal.substitutions && meal.substitutions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2.5 flex items-center gap-1.5">
                    <span>🔄</span> Ingredient Swaps
                  </h4>
                  <div className="space-y-2">
                    {meal.substitutions.map((sub, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3"
                        style={{ boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-400 line-through">{sub.original}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                          <span className="text-xs font-semibold text-green-600">{sub.alternative}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">{sub.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Serving suggestion */}
              {meal.servingSuggestion && (
                <div className="rounded-xl p-3 bg-gradient-to-r from-orange-50 to-amber-50">
                  <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                    <span>🍽️</span> Serving Suggestion
                  </p>
                  <p className="text-xs text-amber-600 leading-relaxed">{meal.servingSuggestion}</p>
                </div>
              )}

              {/* Tags */}
              {meal.tags && meal.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
                    <span>🏷️</span> Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.tags.map(tag => (
                      <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
