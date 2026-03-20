'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/workouts';

interface WorkoutCardProps {
  exercise: Exercise;
  logged?: { reps: number; weight: number }[];
  onLog: (sets: { reps: number; weight: number }[]) => void;
  suggestion?: { suggestedWeight: number; suggestedReps: number } | null;
}

const MUSCLE_GROUP_COLORS: Record<string, string> = {
  chest: 'bg-blue-100 text-blue-700',
  back: 'bg-purple-100 text-purple-700',
  shoulders: 'bg-orange-100 text-orange-700',
  legs: 'bg-emerald-100 text-emerald-700',
  arms: 'bg-pink-100 text-pink-700',
  core: 'bg-yellow-100 text-yellow-700',
  full_body: 'bg-indigo-100 text-indigo-700',
  cardio: 'bg-red-100 text-red-700',
};

export default function WorkoutCard({
  exercise,
  logged,
  onLog,
  suggestion,
}: WorkoutCardProps) {
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>(
    () =>
      Array.from({ length: exercise.sets }, (_, i) => ({
        reps: logged?.[i]?.reps?.toString() ?? '',
        weight: logged?.[i]?.weight?.toString() ?? '',
      }))
  );

  const isLogged = !!logged && logged.length > 0;

  const handleSetChange = (
    index: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = () => {
    const parsed = sets.map((s) => ({
      reps: parseInt(s.reps) || 0,
      weight: parseFloat(s.weight) || 0,
    }));
    onLog(parsed);
  };

  const badgeColor =
    MUSCLE_GROUP_COLORS[exercise.muscleGroup] || 'bg-slate-100 text-slate-700';

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            {exercise.name}
          </h3>
          <span
            className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}
          >
            {exercise.muscleGroup.replace('_', ' ')}
          </span>
        </div>
        <span className="text-sm text-slate-400">
          {exercise.sets} x {exercise.reps}
        </span>
      </div>

      {suggestion && !isLogged && (
        <p className="text-xs text-green-600 font-medium mb-3">
          Suggestion: {suggestion.suggestedWeight}kg x {suggestion.suggestedReps}{' '}
          reps (progressive overload)
        </p>
      )}

      {isLogged ? (
        <div className="mt-3 space-y-1">
          {logged.map((s, i) => (
            <div key={i} className="flex gap-4 text-sm text-slate-500">
              <span className="text-slate-400 w-12">Set {i + 1}</span>
              <span>{s.weight}kg</span>
              <span>{s.reps} reps</span>
            </div>
          ))}
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Logged
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-12">Set {i + 1}</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="kg"
                value={set.weight}
                onChange={(e) => handleSetChange(i, 'weight', e.target.value)}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="reps"
                value={set.reps}
                onChange={(e) => handleSetChange(i, 'reps', e.target.value)}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-2 w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 active:bg-rose-700 transition-colors"
          >
            Log Exercise
          </button>
        </div>
      )}
    </div>
  );
}
