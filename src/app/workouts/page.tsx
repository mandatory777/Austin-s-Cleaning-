'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { WorkoutSession, ExerciseLog, getProgressiveOverload } from '@/lib/workouts';
import WorkoutCard from '@/components/WorkoutCard';
import PlaylistCard from '@/components/PlaylistCard';
import WeightChart from '@/components/WeightChart';
import { getPlaylistForWorkout } from '@/lib/playlists';

export default function WorkoutsPage() {
  const {
    profile,
    todayWorkout,
    weeklyWorkouts,
    todayRecovery,
    adjustedMacros,
    workoutSessions,
    logWorkout,
    getTodayDate,
  } = useApp();

  const [exerciseLogs, setExerciseLogs] = useState<Record<string, { reps: number; weight: number }[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const dayOfWeek = new Date().getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calculate progressive overload suggestions
  const overloadSuggestions = useMemo(() => {
    if (!todayWorkout) return {};
    const suggestions: Record<string, { suggestedWeight: number; suggestedReps: number } | null> = {};
    for (const exercise of todayWorkout.exercises) {
      const previousLogs = workoutSessions
        .flatMap(s => s.exercises)
        .filter(e => e.exerciseId === exercise.id);
      suggestions[exercise.id] = getProgressiveOverload(exercise.name, previousLogs);
    }
    return suggestions;
  }, [todayWorkout, workoutSessions]);

  const handleComplete = () => {
    if (!todayWorkout) return;

    const exercises: ExerciseLog[] = todayWorkout.exercises.map(ex => ({
      exerciseId: ex.id,
      sets: exerciseLogs[ex.id] || Array.from({ length: ex.sets }, () => ({ reps: 0, weight: 0 })),
      date: getTodayDate(),
    }));

    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      workoutPlanId: todayWorkout.id,
      date: getTodayDate(),
      exercises,
      completed: true,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    logWorkout(session);
    setIsCompleted(true);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-28">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl p-5 -mx-4 px-4">
          <h1 className="text-2xl font-bold text-rose-700">
            {todayWorkout ? todayWorkout.name : 'Rest Day'}
          </h1>
          <p className="text-sm text-gray-500">{dayNames[adjustedDay]}</p>
        </div>

        {/* Weight Progress Chart */}
        <WeightChart
          currentWeightKg={profile.weight}
          goalWeight={profile.goalWeight}
          startWeight={Math.round(profile.weight * 2.205)}
        />

        {/* Intensity badge */}
        {todayWorkout && (
          <div className="flex items-center gap-3">
            <span className={`neu-badge ${
              todayWorkout.intensity === 'light'
                ? 'text-green-600 bg-green-100'
                : todayWorkout.intensity === 'moderate'
                ? 'text-yellow-600 bg-yellow-100'
                : 'text-red-600 bg-red-100'
            }`}>
              {todayWorkout.intensity.charAt(0).toUpperCase() + todayWorkout.intensity.slice(1)} Intensity
            </span>
            <span className="text-sm text-gray-500">
              ~{todayWorkout.estimatedMinutes} min
            </span>
          </div>
        )}

        {/* Recovery warning */}
        {todayRecovery?.shouldRest && (
          <div className="neu-flat p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-600">Your recovery score suggests a rest day</p>
              <p className="text-xs text-amber-500 mt-0.5">
                Consider lighter activity or stretching instead.
              </p>
            </div>
          </div>
        )}

        {/* Adjusted macros note */}
        {adjustedMacros && todayWorkout && todayWorkout.intensity !== 'light' && (
          <div className="neu-flat px-4 py-3">
            <p className="text-xs text-purple-500">
              Nutrition adjusted: {adjustedMacros.calories} kcal / {adjustedMacros.protein}g protein for today&apos;s {todayWorkout.intensity} session
            </p>
          </div>
        )}

        {/* Completed state */}
        {isCompleted && (
          <div className="neu-flat p-5 text-center">
            <div className="text-4xl mb-2">&#127881;</div>
            <h3 className="text-lg font-bold text-green-600">Workout Complete!</h3>
            <p className="text-sm text-green-500 mt-1">Great job. Your session has been logged.</p>
          </div>
        )}

        {/* Exercise list */}
        {todayWorkout && !isCompleted && (
          <div className="space-y-3">
            {todayWorkout.exercises.map(exercise => (
              <WorkoutCard
                key={exercise.id}
                exercise={exercise}
                suggestion={overloadSuggestions[exercise.id] ?? null}
                onLog={(sets) => {
                  setExerciseLogs(prev => ({ ...prev, [exercise.id]: sets }));
                }}
                logged={exerciseLogs[exercise.id]}
              />
            ))}
          </div>
        )}

        {!todayWorkout && (
          <div className="neu-flat p-8 text-center">
            <div className="text-4xl mb-3">&#128524;</div>
            <h3 className="text-lg font-bold text-gray-700">Rest Day</h3>
            <p className="text-sm text-gray-500 mt-1">
              Take it easy today. Recovery is when your body gets stronger.
            </p>
          </div>
        )}

        {/* Workout Playlist */}
        {todayWorkout && !isCompleted && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Workout Playlist
            </h2>
            <PlaylistCard
              playlist={getPlaylistForWorkout(todayWorkout.intensity)}
              compact
            />
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="neu-flat-rose p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Weekly Schedule
          </h2>
          <div className="space-y-2">
            {dayNames.map((dayName, i) => {
              const workout = i < weeklyWorkouts.length ? weeklyWorkouts[i] : null;
              const isToday = i === adjustedDay;
              return (
                <div
                  key={dayName}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${
                    isToday ? 'neu-pressed' : 'bg-[#e0e5ec]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium w-8 ${
                      isToday ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {dayName.slice(0, 3)}
                    </span>
                    <span className={`text-sm ${
                      isToday ? 'font-semibold text-purple-600' : 'text-gray-500'
                    }`}>
                      {workout ? workout.name : 'Rest'}
                    </span>
                  </div>
                  {workout && (
                    <span className={`neu-badge ${
                      workout.intensity === 'light'
                        ? 'text-green-600'
                        : workout.intensity === 'moderate'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {workout.intensity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complete button */}
      {todayWorkout && !isCompleted && (
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleComplete}
              className="neu-btn-rose w-full py-4 font-bold text-lg"
            >
              Complete Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
