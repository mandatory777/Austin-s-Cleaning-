'use client';

import { useState } from 'react';

interface JournalCheckInProps {
  onSubmit: (
    energy: 1 | 2 | 3,
    mood: 1 | 2 | 3,
    digestion: 1 | 2 | 3,
    foodNames: string[],
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => void;
}

type Rating = 1 | 2 | 3;
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MEAL_TYPES: { type: MealType; label: string; emoji: string }[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: '\u{1F373}' },
  { type: 'lunch', label: 'Lunch', emoji: '\u{1F96A}' },
  { type: 'dinner', label: 'Dinner', emoji: '\u{1F35D}' },
  { type: 'snack', label: 'Snack', emoji: '\u{1F34E}' },
];

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
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [submitted, setSubmitted] = useState(false);

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
    onSubmit(energy!, mood!, digestion!, foodNames, mealType);
    setSubmitted(true);
    setTimeout(() => {
      setEnergy(null);
      setMood(null);
      setDigestion(null);
      setFoodText('');
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="neu-flat p-6 text-center">
        <div className="text-4xl mb-2">{'\u2705'}</div>
        <h3 className="text-lg font-bold text-green-600">Check-in Logged!</h3>
        <p className="text-sm text-gray-500 mt-1">Thanks for tracking how you feel.</p>
      </div>
    );
  }

  return (
    <div className="neu-flat p-5">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        Quick Check-In
      </h3>

      {/* Meal Type Selector */}
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-500 mb-1.5 block">
          Meal
        </span>
        <div className="grid grid-cols-4 gap-2">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.type}
              onClick={() => setMealType(mt.type)}
              className={`py-2 rounded-xl text-center transition-all ${
                mealType === mt.type
                  ? 'neu-pressed text-amber-600'
                  : 'neu-btn text-gray-500'
              }`}
            >
              <div className="text-lg">{mt.emoji}</div>
              <div className="text-[10px] font-medium mt-0.5">{mt.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {ROWS.map((row) => (
          <div key={row.key}>
            <span className="text-xs font-medium text-gray-500 mb-1.5 block">
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
                    className={`flex-1 rounded-xl py-2.5 text-2xl transition-all ${
                      isSelected
                        ? 'neu-pressed text-[#a78bfa] scale-105'
                        : 'neu-btn hover:scale-[1.02]'
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
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">
          What did you eat? (comma-separated)
        </label>
        <input
          type="text"
          value={foodText}
          onChange={(e) => setFoodText(e.target.value)}
          placeholder="e.g. oatmeal, chicken salad, rice"
          className="neu-input text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full neu-btn-amber text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Check-In
      </button>
    </div>
  );
}
