'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getShoppingList } from '@/lib/meals';
import { generateMealPlan } from '@/lib/meals';
import ShoppingList from '@/components/ShoppingList';
import Link from 'next/link';

export default function ShoppingPage() {
  const { profile, todayMealPlan, getTodayDate } = useApp();
  const [includeFamily, setIncludeFamily] = useState(false);

  const shoppingItems = useMemo(() => {
    if (!todayMealPlan || !profile) return [];

    const plans = [todayMealPlan];

    if (includeFamily && profile.household.length > 0) {
      for (const member of profile.household) {
        const memberPlan = generateMealPlan(getTodayDate(), member.macros);
        plans.push(memberPlan);
      }
    }

    return getShoppingList(plans);
  }, [todayMealPlan, profile, includeFamily, getTodayDate]);

  if (!profile || !todayMealPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/meals"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Shopping List</h1>
            <p className="text-sm text-slate-500">{shoppingItems.length} items</p>
          </div>
        </div>

        {/* Family toggle */}
        {profile.household.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Include family plans</p>
              <p className="text-xs text-slate-500">
                Add items for {profile.household.map(m => m.name).join(', ')}
              </p>
            </div>
            <button
              onClick={() => setIncludeFamily(!includeFamily)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                includeFamily ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                  includeFamily ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}

        {/* Shopping list */}
        <ShoppingList items={shoppingItems} />
      </div>
    </div>
  );
}
