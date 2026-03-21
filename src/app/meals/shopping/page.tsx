'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getStored } from '@/lib/storage';
import { AIMealPlan, getAIShoppingList } from '@/lib/ai-meals';
import Link from 'next/link';

export default function ShoppingPage() {
  const { profile, getTodayDate } = useApp();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const today = getTodayDate();

  const shoppingItems = useMemo(() => {
    const aiPlan = getStored<AIMealPlan | null>(`pulse_ai_meals_${today}`, null);
    if (aiPlan) {
      return getAIShoppingList(aiPlan);
    }
    return [];
  }, [today]);

  const toggleItem = (name: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!profile) return null;

  // Group by category
  const grouped = shoppingItems.reduce<Record<string, typeof shoppingItems>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryIcons: Record<string, string> = {
    produce: '🥬',
    protein: '🥩',
    dairy: '🧀',
    grains: '🌾',
    pantry: '🫙',
    spices: '🧂',
    oils: '🫒',
    frozen: '🧊',
  };

  const checkedCount = checkedItems.size;

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-24">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/meals"
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' }}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-700">Shopping List</h1>
            <p className="text-xs text-gray-500">
              {shoppingItems.length} items · {checkedCount} checked
            </p>
          </div>
        </div>

        {shoppingItems.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
            <div className="text-3xl mb-2">🛒</div>
            <p className="text-gray-500 text-sm">Generate a meal plan first to see your shopping list</p>
            <Link href="/meals" className="text-emerald-600 text-sm font-medium mt-2 inline-block">
              Go to Meals →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="rounded-2xl p-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3 flex items-center gap-1.5">
                  <span>{categoryIcons[category] || '📦'}</span>
                  {category}
                </h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => toggleItem(item.name)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        checkedItems.has(item.name) ? 'opacity-50' : ''
                      }`}
                      style={{
                        boxShadow: checkedItems.has(item.name)
                          ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                          : '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
                      }}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        checkedItems.has(item.name)
                          ? 'bg-emerald-500'
                          : ''
                      }`}
                      style={checkedItems.has(item.name) ? {} : { boxShadow: 'inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff' }}
                      >
                        {checkedItems.has(item.name) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${checkedItems.has(item.name) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400">{item.quantity}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
