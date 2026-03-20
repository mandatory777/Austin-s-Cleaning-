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
  chest: 'text-blue-600',
  back: 'text-purple-600',
  shoulders: 'text-orange-600',
  legs: 'text-emerald-600',
  arms: 'text-pink-600',
  core: 'text-yellow-600',
  full_body: 'text-indigo-600',
  cardio: 'text-red-600',
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

  const badgeTextColor =
    MUSCLE_GROUP_COLORS[exercise.muscleGroup] || 'text-gray-500';

  return (
    <div className="neu-flat p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-gray-700">
            {exercise.name}
          </h3>
          <span
            className={`inline-block mt-1 neu-badge ${badgeTextColor}`}
          >
            {exercise.muscleGroup.replace('_', ' ')}
          </span>
        </div>
        <span className="text-sm text-gray-400">
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
            <div key={i} className="flex gap-4 text-sm text-gray-500">
              <span className="text-gray-400 w-12">Set {i + 1}</span>
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
              <span className="text-xs text-gray-400 w-12">Set {i + 1}</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="kg"
                value={set.weight}
                onChange={(e) => handleSetChange(i, 'weight', e.target.value)}
                className="w-20 neu-input !p-2 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="reps"
                value={set.reps}
                onChange={(e) => handleSetChange(i, 'reps', e.target.value)}
                className="w-20 neu-input !p-2 text-sm"
              />
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-2 w-full neu-btn-rose text-sm"
          >
            Log Exercise
          </button>
        </div>
      )}
    </div>
  );
}
