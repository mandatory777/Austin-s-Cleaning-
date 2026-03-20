'use client';

import { useState } from 'react';

interface JournalCheckInProps {
  onSubmit: (
    energy: 1 | 2 | 3,
    mood: 1 | 2 | 3,
    digestion: 1 | 2 | 3,
    foodNames: string[]
  ) => void;
}

type Rating = 1 | 2 | 3;

const ROWS: { label: string; emojis: [string, string, string]; key: string }[] = [
  { label: 'Energy', emojis: ['\u{1F50B}', '\u26A1', '\u{1F680}'], key: 'energy' },
  { label: 'Mood', emojis: ['\u{1F614}', '\u{1F610}', '\u{1F60A}'], key: 'mood' },
  { label: 'Digestion', emojis: ['\u{1F623}', '\u{1F60C}', '\u2728'], key: 'digestion' },
];

export default function JournalCheckIn({ onSubmit }: JournalCheckInProps) {
  const [energy, setEnergy] = useState<Rating | null>(null);
  const [mood, setMood] = useState<Rating | null>(null);
  const [digestion, setDigestion] = useState<Rating | null>(null);
  const [foodText, setFoodText] = useState('');

  const setters: Record<string, (v: Rating) => void> = {
    energy: setEnergy,
    mood: setMood,
    digestion: setDigestion,
  };

  const values: Record<string, Rating | null> = {
    energy,
    mood,
    digestion,
  };

  const canSubmit = energy !== null && mood !== null && digestion !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const foodNames = foodText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit(energy!, mood!, digestion!, foodNames);
    setEnergy(null);
    setMood(null);
    setDigestion(null);
    setFoodText('');
  };

  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Quick Check-In
      </h3>

      <div className="space-y-4 mb-4">
        {ROWS.map((row) => (
          <div key={row.key}>
            <span className="text-xs font-medium text-slate-500 mb-1.5 block">
              {row.label}
            </span>
            <div className="flex gap-2">
              {row.emojis.map((emoji, i) => {
                const rating = (i + 1) as Rating;
                const isSelected = values[row.key] === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => setters[row.key](rating)}
                    className={`flex-1 rounded-lg border-2 py-2.5 text-2xl transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50 scale-105'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
          What did you eat? (comma-separated)
        </label>
        <input
          type="text"
          value={foodText}
          onChange={(e) => setFoodText(e.target.value)}
          placeholder="e.g. oatmeal, chicken salad, rice"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600 active:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Check-In
      </button>
    </div>
  );
}
