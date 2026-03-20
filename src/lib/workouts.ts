import { Goal, FitnessExperience } from './profile';

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core' | 'full_body' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  day: string;
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
  intensity: 'light' | 'moderate' | 'hard';
  estimatedMinutes: number;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: { reps: number; weight: number }[];
  date: string;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;
  date: string;
  exercises: ExerciseLog[];
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

const EXERCISE_LIBRARY: Record<MuscleGroup, { name: string; repsRange: string }[]> = {
  chest: [
    { name: 'Bench Press', repsRange: '8-12' },
    { name: 'Push-Ups', repsRange: '10-20' },
    { name: 'Incline Dumbbell Press', repsRange: '8-12' },
    { name: 'Chest Flyes', repsRange: '10-15' },
    { name: 'Dips', repsRange: '8-12' },
  ],
  back: [
    { name: 'Pull-Ups', repsRange: '5-12' },
    { name: 'Barbell Rows', repsRange: '8-12' },
    { name: 'Lat Pulldown', repsRange: '10-12' },
    { name: 'Seated Cable Row', repsRange: '10-12' },
    { name: 'Dumbbell Rows', repsRange: '8-12' },
  ],
  shoulders: [
    { name: 'Overhead Press', repsRange: '8-12' },
    { name: 'Lateral Raises', repsRange: '12-15' },
    { name: 'Front Raises', repsRange: '12-15' },
    { name: 'Face Pulls', repsRange: '12-15' },
    { name: 'Arnold Press', repsRange: '8-12' },
  ],
  legs: [
    { name: 'Squats', repsRange: '6-10' },
    { name: 'Romanian Deadlifts', repsRange: '8-12' },
    { name: 'Leg Press', repsRange: '10-12' },
    { name: 'Lunges', repsRange: '10-12' },
    { name: 'Leg Curls', repsRange: '10-15' },
    { name: 'Calf Raises', repsRange: '15-20' },
  ],
  arms: [
    { name: 'Bicep Curls', repsRange: '10-15' },
    { name: 'Tricep Pushdowns', repsRange: '10-15' },
    { name: 'Hammer Curls', repsRange: '10-12' },
    { name: 'Skull Crushers', repsRange: '8-12' },
    { name: 'Concentration Curls', repsRange: '10-12' },
  ],
  core: [
    { name: 'Plank', repsRange: '30-60s' },
    { name: 'Crunches', repsRange: '15-25' },
    { name: 'Russian Twists', repsRange: '20-30' },
    { name: 'Leg Raises', repsRange: '10-15' },
    { name: 'Mountain Climbers', repsRange: '20-30' },
  ],
  full_body: [
    { name: 'Deadlifts', repsRange: '5-8' },
    { name: 'Clean & Press', repsRange: '6-8' },
    { name: 'Burpees', repsRange: '10-15' },
    { name: 'Thrusters', repsRange: '8-12' },
    { name: 'Kettlebell Swings', repsRange: '15-20' },
  ],
  cardio: [
    { name: 'Running', repsRange: '20-40 min' },
    { name: 'Cycling', repsRange: '20-40 min' },
    { name: 'Jump Rope', repsRange: '10-20 min' },
    { name: 'Rowing', repsRange: '15-30 min' },
    { name: 'HIIT Circuit', repsRange: '15-25 min' },
  ],
};

interface WeekPlanConfig {
  days: { name: string; groups: MuscleGroup[]; intensity: 'light' | 'moderate' | 'hard' }[];
}

const WEEK_PLANS: Record<Goal, Record<FitnessExperience, WeekPlanConfig>> = {
  weight_loss: {
    beginner: {
      days: [
        { name: 'Full Body A', groups: ['full_body', 'core'], intensity: 'moderate' },
        { name: 'Cardio', groups: ['cardio'], intensity: 'light' },
        { name: 'Full Body B', groups: ['full_body', 'core'], intensity: 'moderate' },
      ],
    },
    intermediate: {
      days: [
        { name: 'Upper Body + Cardio', groups: ['chest', 'back', 'cardio'], intensity: 'moderate' },
        { name: 'Lower Body', groups: ['legs', 'core'], intensity: 'hard' },
        { name: 'HIIT + Arms', groups: ['cardio', 'arms'], intensity: 'hard' },
        { name: 'Full Body', groups: ['full_body'], intensity: 'moderate' },
      ],
    },
    advanced: {
      days: [
        { name: 'Push + HIIT', groups: ['chest', 'shoulders', 'cardio'], intensity: 'hard' },
        { name: 'Legs', groups: ['legs', 'core'], intensity: 'hard' },
        { name: 'Pull + Cardio', groups: ['back', 'arms', 'cardio'], intensity: 'hard' },
        { name: 'Full Body HIIT', groups: ['full_body', 'cardio'], intensity: 'hard' },
        { name: 'Active Recovery', groups: ['cardio', 'core'], intensity: 'light' },
      ],
    },
  },
  muscle_gain: {
    beginner: {
      days: [
        { name: 'Full Body A', groups: ['chest', 'back', 'legs'], intensity: 'moderate' },
        { name: 'Full Body B', groups: ['shoulders', 'arms', 'core'], intensity: 'moderate' },
        { name: 'Full Body C', groups: ['legs', 'back', 'chest'], intensity: 'moderate' },
      ],
    },
    intermediate: {
      days: [
        { name: 'Chest & Triceps', groups: ['chest', 'arms'], intensity: 'hard' },
        { name: 'Back & Biceps', groups: ['back', 'arms'], intensity: 'hard' },
        { name: 'Legs', groups: ['legs', 'core'], intensity: 'hard' },
        { name: 'Shoulders & Arms', groups: ['shoulders', 'arms'], intensity: 'moderate' },
      ],
    },
    advanced: {
      days: [
        { name: 'Chest', groups: ['chest', 'core'], intensity: 'hard' },
        { name: 'Back', groups: ['back'], intensity: 'hard' },
        { name: 'Legs', groups: ['legs'], intensity: 'hard' },
        { name: 'Shoulders', groups: ['shoulders', 'core'], intensity: 'hard' },
        { name: 'Arms', groups: ['arms'], intensity: 'moderate' },
      ],
    },
  },
  wellness: {
    beginner: {
      days: [
        { name: 'Full Body', groups: ['full_body', 'core'], intensity: 'light' },
        { name: 'Cardio', groups: ['cardio'], intensity: 'light' },
        { name: 'Full Body', groups: ['full_body'], intensity: 'light' },
      ],
    },
    intermediate: {
      days: [
        { name: 'Upper Body', groups: ['chest', 'back', 'shoulders'], intensity: 'moderate' },
        { name: 'Cardio & Core', groups: ['cardio', 'core'], intensity: 'moderate' },
        { name: 'Lower Body', groups: ['legs'], intensity: 'moderate' },
        { name: 'Active Recovery', groups: ['cardio', 'core'], intensity: 'light' },
      ],
    },
    advanced: {
      days: [
        { name: 'Push', groups: ['chest', 'shoulders', 'arms'], intensity: 'moderate' },
        { name: 'Pull', groups: ['back', 'arms'], intensity: 'moderate' },
        { name: 'Legs', groups: ['legs', 'core'], intensity: 'moderate' },
        { name: 'Cardio', groups: ['cardio', 'core'], intensity: 'moderate' },
      ],
    },
  },
};

export function generateWeeklyWorkouts(goal: Goal, experience: FitnessExperience): WorkoutPlan[] {
  const config = WEEK_PLANS[goal][experience];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return config.days.map((day, i) => {
    const exercises: Exercise[] = [];
    let exId = 0;

    for (const group of day.groups) {
      const lib = EXERCISE_LIBRARY[group];
      const count = experience === 'beginner' ? 2 : experience === 'intermediate' ? 3 : 4;
      const selected = lib.slice(0, Math.min(count, lib.length));

      for (const ex of selected) {
        exercises.push({
          id: `ex-${i}-${exId++}`,
          name: ex.name,
          muscleGroup: group,
          sets: experience === 'beginner' ? 3 : experience === 'intermediate' ? 3 : 4,
          reps: ex.repsRange,
          restSeconds: group === 'cardio' ? 0 : 60,
        });
      }
    }

    return {
      id: `workout-${i}`,
      name: day.name,
      day: dayNames[i],
      muscleGroups: day.groups,
      exercises,
      intensity: day.intensity,
      estimatedMinutes: exercises.length * 5 + 10,
    };
  });
}

export function getProgressiveOverload(
  exerciseName: string,
  previousSessions: ExerciseLog[]
): { suggestedWeight: number; suggestedReps: number } | null {
  if (previousSessions.length === 0) return null;
  const last = previousSessions[previousSessions.length - 1];
  if (last.sets.length === 0) return null;

  const lastSet = last.sets[last.sets.length - 1];
  const allRepsHit = last.sets.every(s => s.reps >= 12);

  if (allRepsHit) {
    return {
      suggestedWeight: lastSet.weight + 2.5,
      suggestedReps: 8,
    };
  }

  return {
    suggestedWeight: lastSet.weight,
    suggestedReps: lastSet.reps + 1,
  };
}

export function getWorkoutIntensity(workout: WorkoutPlan): 'light' | 'moderate' | 'hard' {
  return workout.intensity;
}
