'use client';

import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  JournalEntry,
  analyzeFoodCorrelations,
  getTopFoods,
  getWorstFoods,
  ENERGY_EMOJIS,
  MOOD_EMOJIS,
  DIGESTION_EMOJIS,
} from '@/lib/journal';
import JournalCheckIn from '@/components/JournalCheckIn';

export default function JournalPage() {
  const { profile, journalEntries, logJournal } = useApp();

  const correlations = useMemo(() => analyzeFoodCorrelations(journalEntries), [journalEntries]);
  const topFoods = useMemo(() => getTopFoods(correlations), [correlations]);
  const worstFoods = useMemo(() => getWorstFoods(correlations), [correlations]);
  const hasInsights = journalEntries.length >= 5;

  const handleSubmit = (energy: 1 | 2 | 3, mood: 1 | 2 | 3, digestion: 1 | 2 | 3, foodNames: string[]) => {
    const fullEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType: 'snack',
      foodNames,
      energy,
      mood,
      digestion,
      timestamp: new Date().toISOString(),
    };
    logJournal(fullEntry);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-700">Food Journal</h1>

        {/* Check-in form */}
        <JournalCheckIn onSubmit={handleSubmit} />

        {/* Food Insights */}
        {hasInsights && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Your Food Insights</h2>

            {topFoods.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                  Top Foods
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {topFoods.map(food => (
                    <div
                      key={food.foodName}
                      className="neu-flat px-4 py-2.5"
                    >
                      <p className="text-sm font-medium text-green-600 capitalize">{food.foodName}</p>
                      <p className="text-xs text-gray-500">
                        Score: {food.overallScore}/3 ({food.entries} entries)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worstFoods.length > 0 && worstFoods.some(f => f.verdict === 'poor' || f.verdict === 'neutral') && (
              <div>
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
                  Foods to Watch
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {worstFoods
                    .filter(f => f.verdict === 'poor' || f.verdict === 'neutral')
                    .map(food => (
                      <div
                        key={food.foodName}
                        className="neu-flat px-4 py-2.5"
                      >
                        <p className="text-sm font-medium text-red-600 capitalize">{food.foodName}</p>
                        <p className="text-xs text-gray-500">
                          Score: {food.overallScore}/3 ({food.entries} entries)
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasInsights && journalEntries.length > 0 && (
          <div className="neu-pressed p-4 text-center">
            <p className="text-sm text-gray-500">
              Log {5 - journalEntries.length} more entries to unlock food insights
            </p>
          </div>
        )}

        {/* Recent entries */}
        {journalEntries.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-3">Recent Entries</h2>
            <div className="space-y-3">
              {[...journalEntries]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 20)
                .map(entry => (
                  <div key={entry.id} className="neu-flat p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{entry.mealType}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex gap-1 text-lg">
                        <span>{ENERGY_EMOJIS[entry.energy]}</span>
                        <span>{MOOD_EMOJIS[entry.mood]}</span>
                        <span>{DIGESTION_EMOJIS[entry.digestion]}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.foodNames.map((food, i) => (
                        <span
                          key={i}
                          className="neu-badge"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {journalEntries.length === 0 && (
          <div className="neu-flat p-8 text-center">
            <div className="text-4xl mb-3">&#128221;</div>
            <h3 className="text-lg font-bold text-gray-700">Start Your Journal</h3>
            <p className="text-sm text-gray-500 mt-1">
              Track how foods make you feel. After 5 entries, you&apos;ll start seeing personalized insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
