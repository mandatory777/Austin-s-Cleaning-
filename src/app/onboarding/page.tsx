'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
  UserProfile,
  Sex,
  Goal,
  ActivityLevel,
  FitnessExperience,
  GOAL_LABELS,
  calculateBMR,
  calculateTDEE,
  calculateMacros,
} from '@/lib/profile';

const TOTAL_STEPS = 6;

// Assessment option type
interface Option {
  id: string;
  emoji: string;
  label: string;
  desc: string;
}

const MOTIVATION_OPTIONS: Option[] = [
  { id: 'lose_fat', emoji: '🔥', label: 'Lose Weight', desc: 'Burn fat and feel lighter' },
  { id: 'build_muscle', emoji: '💪', label: 'Build Muscle', desc: 'Get stronger and more toned' },
  { id: 'feel_better', emoji: '✨', label: 'Feel Better', desc: 'More energy and less stress' },
  { id: 'get_fit', emoji: '🏃', label: 'Get Fit', desc: 'Improve endurance and stamina' },
  { id: 'eat_healthier', emoji: '🥗', label: 'Eat Healthier', desc: 'Better relationship with food' },
  { id: 'look_better', emoji: '🪞', label: 'Look My Best', desc: 'Body confidence and aesthetics' },
];

const WORKOUT_FREQ_OPTIONS: Option[] = [
  { id: 'rarely', emoji: '🛋️', label: '0-1 days', desc: 'I barely work out' },
  { id: 'sometimes', emoji: '🚶', label: '2-3 days', desc: 'A few times a week' },
  { id: 'often', emoji: '🏋️', label: '4-5 days', desc: 'Most days of the week' },
  { id: 'daily', emoji: '⚡', label: '6-7 days', desc: 'Almost every day' },
];

const EXPERIENCE_OPTIONS: Option[] = [
  { id: 'beginner', emoji: '🌱', label: 'Just Starting', desc: 'New to fitness or getting back into it' },
  { id: 'intermediate', emoji: '🌿', label: 'Some Experience', desc: '1-3 years of working out' },
  { id: 'advanced', emoji: '🌳', label: 'Experienced', desc: '3+ years, I know my way around' },
];

const DIET_OPTIONS: Option[] = [
  { id: 'poor', emoji: '🍔', label: 'Needs Work', desc: 'Lots of fast food and snacking' },
  { id: 'okay', emoji: '🍝', label: 'It\'s Okay', desc: 'Could be better, could be worse' },
  { id: 'good', emoji: '🥑', label: 'Pretty Good', desc: 'I try to eat clean most days' },
  { id: 'great', emoji: '🥦', label: 'Dialed In', desc: 'I track what I eat carefully' },
];

const CHALLENGE_OPTIONS: Option[] = [
  { id: 'time', emoji: '⏰', label: 'Finding Time', desc: 'Too busy to work out or cook' },
  { id: 'motivation', emoji: '😴', label: 'Staying Motivated', desc: 'Starting is easy, sticking is hard' },
  { id: 'knowledge', emoji: '🤔', label: 'Knowing What to Do', desc: 'Not sure what to eat or how to train' },
  { id: 'consistency', emoji: '📅', label: 'Being Consistent', desc: 'I start and stop too often' },
  { id: 'nutrition', emoji: '🍽️', label: 'Eating Right', desc: 'Struggle with cravings or portions' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useApp();
  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [sex, setSex] = useState<Sex>('female');

  // Step 2: Body
  const [weight, setWeight] = useState<number>(143);
  const [goalWeightVal, setGoalWeightVal] = useState<number>(130);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(5);

  // Step 3: Motivation
  const [motivation, setMotivation] = useState('');

  // Step 4: Activity
  const [workoutFreq, setWorkoutFreq] = useState('');
  const [experience, setExperience] = useState('');

  // Step 5: Habits
  const [dietQuality, setDietQuality] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(3);
  const [biggestChallenge, setBiggestChallenge] = useState('');

  // Derive goal from answers
  const derivedGoal = useMemo((): Goal => {
    // Weight difference tells us a lot
    const wantToLose = goalWeightVal < weight;
    const wantToGain = goalWeightVal > weight;
    const bigDiff = Math.abs(weight - goalWeightVal) > 10;

    // Score each goal
    let lossScore = 0;
    let gainScore = 0;
    let wellnessScore = 0;

    // Motivation
    if (motivation === 'lose_fat') lossScore += 3;
    if (motivation === 'build_muscle') gainScore += 3;
    if (motivation === 'feel_better') wellnessScore += 3;
    if (motivation === 'get_fit') { wellnessScore += 2; lossScore += 1; }
    if (motivation === 'eat_healthier') wellnessScore += 2;
    if (motivation === 'look_better') { lossScore += 1; gainScore += 1; wellnessScore += 1; }

    // Weight goal
    if (wantToLose && bigDiff) lossScore += 3;
    else if (wantToLose) lossScore += 2;
    if (wantToGain && bigDiff) gainScore += 3;
    else if (wantToGain) gainScore += 2;
    if (!wantToLose && !wantToGain) wellnessScore += 2;

    // Diet quality
    if (dietQuality === 'poor') lossScore += 1;
    if (dietQuality === 'great') gainScore += 1;

    // Challenge
    if (biggestChallenge === 'nutrition') lossScore += 1;

    if (gainScore > lossScore && gainScore > wellnessScore) return 'muscle_gain';
    if (lossScore > wellnessScore) return 'weight_loss';
    return 'wellness';
  }, [motivation, weight, goalWeightVal, dietQuality, biggestChallenge]);

  const derivedActivity = useMemo((): ActivityLevel => {
    switch (workoutFreq) {
      case 'rarely': return 'sedentary';
      case 'sometimes': return 'light';
      case 'often': return 'active';
      case 'daily': return 'very_active';
      default: return 'moderate';
    }
  }, [workoutFreq]);

  const derivedExperience = useMemo((): FitnessExperience => {
    switch (experience) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return 'beginner';
    }
  }, [experience]);

  // Calculate preview macros for Step 6
  const previewMacros = useMemo(() => {
    const weightKg = weight / 2.205;
    const heightCm = (heightFeet * 12 + heightInches) * 2.54;
    const bmr = calculateBMR(sex, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, derivedActivity);
    return calculateMacros(tdee, derivedGoal);
  }, [weight, heightFeet, heightInches, sex, age, derivedActivity, derivedGoal]);

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0 && age > 0;
      case 2: return weight > 0 && heightFeet > 0 && goalWeightVal > 0;
      case 3: return motivation !== '';
      case 4: return workoutFreq !== '' && experience !== '';
      case 5: return dietQuality !== '' && biggestChallenge !== '';
      case 6: return true;
      default: return false;
    }
  };

  const handleFinish = () => {
    const weightKg = weight / 2.205;
    const heightCm = (heightFeet * 12 + heightInches) * 2.54;
    const bmr = calculateBMR(sex, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, derivedActivity);
    const macros = calculateMacros(tdee, derivedGoal);
    const profile: UserProfile = {
      name: name.trim(),
      age,
      sex,
      weight: weightKg,
      height: heightCm,
      goalWeight: goalWeightVal,
      goal: derivedGoal,
      activityLevel: derivedActivity,
      fitnessExperience: derivedExperience,
      sleepHours,
      stressLevel,
      tdee,
      macros,
      household: [],
      onboardedAt: new Date().toISOString(),
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    saveProfile(profile);
    router.replace('/');
  };

  const goalColors: Record<Goal, string> = {
    weight_loss: 'from-rose-500 to-orange-500',
    muscle_gain: 'from-blue-500 to-violet-500',
    wellness: 'from-emerald-500 to-teal-500',
  };

  const goalIcons: Record<Goal, string> = {
    weight_loss: '🔥',
    muscle_gain: '💪',
    wellness: '🧘',
  };

  const goalDescriptions: Record<Goal, string> = {
    weight_loss: 'We\'ll focus on a calorie deficit with high-protein meals to help you burn fat while keeping muscle.',
    muscle_gain: 'We\'ll fuel your gains with a calorie surplus, plenty of protein, and progressive training.',
    wellness: 'We\'ll build balanced nutrition, mindful movement, and recovery into your daily routine.',
  };

  // Reusable option card
  const OptionCard = ({ opt, selected, onSelect }: { opt: Option; selected: boolean; onSelect: () => void }) => (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl transition-all ${selected ? 'scale-[0.98]' : ''}`}
      style={{
        boxShadow: selected
          ? 'inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff'
          : '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff',
        background: selected ? 'linear-gradient(135deg, #ede9fe 0%, #e0e5ec 100%)' : '#e0e5ec',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{opt.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold ${selected ? 'text-violet-600' : 'text-gray-700'}`}>{opt.label}</h3>
          <p className="text-xs text-gray-500">{opt.desc}</p>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(145deg, #c084fc, #8b5cf6)' }}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );

  const stepTitles = [
    '', 'Welcome', 'Your Body', 'What Drives You?', 'Your Activity', 'Daily Habits', 'Your Plan',
  ];

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col">
      {/* Progress bar */}
      <div className="bg-[#e0e5ec] px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-700">{stepTitles[step]}</h1>
            <span className="text-sm text-gray-400">{step} of {TOTAL_STEPS}</span>
          </div>
          <div className="h-2 rounded-full" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 overflow-y-auto">

        {/* ── Step 1: Name, Age, Sex ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-2xl font-bold text-gray-700">Welcome to Pulse</h2>
              <p className="text-gray-500 text-sm mt-1">Let&apos;s build your personalized plan</p>
            </div>
            <div className="rounded-2xl p-5 space-y-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">What should we call you?</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="neu-input"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 0)}
                    min={13}
                    max={100}
                    className="neu-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sex</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['female', 'male'] as Sex[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setSex(s)}
                        className={`py-2.5 rounded-xl font-medium text-sm transition-all ${
                          sex === s ? 'text-violet-600' : 'text-gray-500'
                        }`}
                        style={{
                          boxShadow: sex === s
                            ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                            : '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
                        }}
                      >
                        {s === 'female' ? 'F' : 'M'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Body ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📏</div>
              <h2 className="text-2xl font-bold text-gray-700">Your Body</h2>
              <p className="text-gray-500 text-sm mt-1">This helps us calculate your nutrition</p>
            </div>
            <div className="rounded-2xl p-5 space-y-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Weight</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                      min={66} max={660} step={1}
                      className="neu-input !pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">lbs</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Weight</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={goalWeightVal}
                      onChange={e => setGoalWeightVal(parseFloat(e.target.value) || 0)}
                      min={66} max={660} step={1}
                      className="neu-input !pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">lbs</span>
                  </div>
                </div>
              </div>
              {weight > 0 && goalWeightVal > 0 && weight !== goalWeightVal && (
                <div className="text-center py-2 px-3 rounded-xl bg-violet-50/50">
                  <p className="text-xs text-violet-600 font-medium">
                    {goalWeightVal < weight
                      ? `Goal: Lose ${Math.round(weight - goalWeightVal)} lbs`
                      : `Goal: Gain ${Math.round(goalWeightVal - weight)} lbs`
                    }
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Height</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Feet</label>
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={e => setHeightFeet(parseInt(e.target.value) || 0)}
                      min={3} max={8}
                      className="neu-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Inches</label>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={e => setHeightInches(parseInt(e.target.value) || 0)}
                      min={0} max={11}
                      className="neu-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Motivation ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">What&apos;s your #1 motivation?</h2>
              <p className="text-gray-500 text-sm mt-1">Pick the one that resonates most</p>
            </div>
            <div className="space-y-2.5">
              {MOTIVATION_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={motivation === opt.id}
                  onSelect={() => setMotivation(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Activity & Experience ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">How active are you?</h2>
              <p className="text-gray-500 text-sm mt-1">Be honest — we&apos;ll meet you where you are</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                Weekly Workouts
              </label>
              <div className="space-y-2">
                {WORKOUT_FREQ_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    opt={opt}
                    selected={workoutFreq === opt.id}
                    onSelect={() => setWorkoutFreq(opt.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                Fitness Experience
              </label>
              <div className="space-y-2">
                {EXPERIENCE_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    opt={opt}
                    selected={experience === opt.id}
                    onSelect={() => setExperience(opt.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Habits ── */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Your Daily Habits</h2>
              <p className="text-gray-500 text-sm mt-1">Helps us understand your starting point</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                How&apos;s Your Diet?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setDietQuality(opt.id)}
                    className="text-left p-3 rounded-xl transition-all"
                    style={{
                      boxShadow: dietQuality === opt.id
                        ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                        : '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
                      background: dietQuality === opt.id ? 'linear-gradient(135deg, #ede9fe, #e0e5ec)' : '#e0e5ec',
                    }}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <p className={`text-xs font-bold mt-1 ${dietQuality === opt.id ? 'text-violet-600' : 'text-gray-700'}`}>{opt.label}</p>
                    <p className="text-[10px] text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 space-y-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep: <span className="text-violet-500 font-bold">{sleepHours}h / night</span>
                </label>
                <input
                  type="range" min={4} max={12} step={0.5}
                  value={sleepHours}
                  onChange={e => setSleepHours(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>4h</span><span>8h</span><span>12h</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                <div className="flex gap-2">
                  {[
                    { val: 1, emoji: '😌', label: 'Low' },
                    { val: 2, emoji: '🙂', label: 'Mild' },
                    { val: 3, emoji: '😐', label: 'Medium' },
                    { val: 4, emoji: '😰', label: 'High' },
                    { val: 5, emoji: '🤯', label: 'Very High' },
                  ].map(s => (
                    <button
                      key={s.val}
                      onClick={() => setStressLevel(s.val)}
                      className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all"
                      style={{
                        boxShadow: stressLevel === s.val
                          ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                          : '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
                      }}
                    >
                      <span className="text-lg">{s.emoji}</span>
                      <span className={`text-[9px] font-medium ${stressLevel === s.val ? 'text-violet-600' : 'text-gray-400'}`}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                Biggest Challenge
              </label>
              <div className="space-y-2">
                {CHALLENGE_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    opt={opt}
                    selected={biggestChallenge === opt.id}
                    onSelect={() => setBiggestChallenge(opt.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 6: Your Plan (Summary) ── */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{goalIcons[derivedGoal]}</div>
              <h2 className="text-2xl font-bold text-gray-700">Your Plan is Ready!</h2>
              <p className="text-gray-500 text-sm mt-1">
                Based on your answers, here&apos;s what we recommend
              </p>
            </div>

            {/* Goal card */}
            <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${goalColors[derivedGoal]}`} style={{ boxShadow: '4px 4px 12px #b8bec7' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{goalIcons[derivedGoal]}</span>
                <h3 className="text-lg font-bold">{GOAL_LABELS[derivedGoal]}</h3>
              </div>
              <p className="text-sm opacity-90">{goalDescriptions[derivedGoal]}</p>
            </div>

            {/* Macros preview */}
            <div className="rounded-2xl p-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Daily Targets</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center bg-rose-50 rounded-xl py-3">
                  <p className="text-lg font-bold text-rose-500">{previewMacros.calories}</p>
                  <p className="text-[10px] text-gray-500">kcal</p>
                </div>
                <div className="text-center bg-violet-50 rounded-xl py-3">
                  <p className="text-lg font-bold text-violet-500">{previewMacros.protein}g</p>
                  <p className="text-[10px] text-gray-500">protein</p>
                </div>
                <div className="text-center bg-amber-50 rounded-xl py-3">
                  <p className="text-lg font-bold text-amber-500">{previewMacros.carbs}g</p>
                  <p className="text-[10px] text-gray-500">carbs</p>
                </div>
                <div className="text-center bg-emerald-50 rounded-xl py-3">
                  <p className="text-lg font-bold text-emerald-500">{previewMacros.fat}g</p>
                  <p className="text-[10px] text-gray-500">fat</p>
                </div>
              </div>
            </div>

            {/* Weight goal */}
            <div className="rounded-2xl p-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Weight Goal</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-700">{weight}</p>
                  <p className="text-[10px] text-gray-400">Current</p>
                </div>
                <div className="flex-1 mx-4 h-2 rounded-full" style={{ boxShadow: 'inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff' }}>
                  <div className="h-full w-1/12 rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', minWidth: '8px' }} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-500">{goalWeightVal}</p>
                  <p className="text-[10px] text-gray-400">Goal</p>
                </div>
              </div>
            </div>

            {/* What you'll get */}
            <div className="rounded-2xl p-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What You&apos;ll Get</h3>
              <div className="space-y-2.5">
                {[
                  { emoji: '🍽️', text: 'AI-powered meal plans with recipes & cooking instructions' },
                  { emoji: '🏋️', text: 'Personalized workout plan based on your experience' },
                  { emoji: '📊', text: 'Weight tracking with progress chart toward your goal' },
                  { emoji: '💧', text: 'Hydration tracking with a virtual pet companion' },
                  { emoji: '🧘', text: 'Wellness hub with breathing exercises & mood tracking' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.emoji}</span>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-[#e0e5ec] p-4" style={{ boxShadow: '0 -4px 12px rgba(184, 190, 199, 0.3)' }}>
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 font-medium text-gray-600 rounded-xl"
              style={{ boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' }}
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 py-3 font-bold text-white rounded-xl disabled:opacity-40 transition-all"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: canProceed() ? '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' : 'none',
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-3.5 font-bold text-white rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff',
              }}
            >
              Let&apos;s Go! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
