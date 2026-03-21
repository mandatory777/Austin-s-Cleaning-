'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
  UserProfile,
  Sex,
  Goal,
  ActivityLevel,
  FitnessExperience,
  HouseholdMember,
  GOAL_LABELS,
  ACTIVITY_LABELS,
  EXPERIENCE_LABELS,
  calculateBMR,
  calculateTDEE,
  calculateMacros,
} from '@/lib/profile';

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useApp();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [sex, setSex] = useState<Sex>('female');

  // Step 2
  const [weight, setWeight] = useState<number>(143);
  const [goalWeightVal, setGoalWeightVal] = useState<number>(130);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(5);

  // Step 3
  const [goal, setGoal] = useState<Goal>('wellness');

  // Step 4
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [fitnessExperience, setFitnessExperience] = useState<FitnessExperience>('beginner');

  // Step 5
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(3);

  // Step 6
  const [household, setHousehold] = useState<HouseholdMember[]>([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState<number>(25);
  const [memberSex, setMemberSex] = useState<Sex>('female');
  const [memberWeight, setMemberWeight] = useState<number>(143);
  const [memberHeightFeet, setMemberHeightFeet] = useState<number>(5);
  const [memberHeightInches, setMemberHeightInches] = useState<number>(5);
  const [memberGoal, setMemberGoal] = useState<Goal>('wellness');

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0 && age > 0;
      case 2: return weight > 0 && heightFeet > 0;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    const memberWeightKg = memberWeight / 2.205;
    const memberHeightCm = (memberHeightFeet * 12 + memberHeightInches) * 2.54;
    const bmr = calculateBMR(memberSex, memberWeightKg, memberHeightCm, memberAge);
    const tdee = calculateTDEE(bmr, 'moderate');
    const macros = calculateMacros(tdee, memberGoal);
    const member: HouseholdMember = {
      id: `member-${Date.now()}`,
      name: memberName.trim(),
      age: memberAge,
      sex: memberSex,
      weight: memberWeightKg,
      height: memberHeightCm,
      goal: memberGoal,
      activityLevel: 'moderate',
      tdee,
      macros,
    };
    setHousehold([...household, member]);
    setMemberName('');
    setMemberAge(25);
    setMemberSex('female');
    setMemberWeight(143);
    setMemberHeightFeet(5);
    setMemberHeightInches(5);
    setMemberGoal('wellness');
    setShowMemberForm(false);
  };

  const handleFinish = () => {
    const weightKg = weight / 2.205;
    const heightCm = (heightFeet * 12 + heightInches) * 2.54;
    const bmr = calculateBMR(sex, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, activityLevel);
    const macros = calculateMacros(tdee, goal);
    const profile: UserProfile = {
      name: name.trim(),
      age,
      sex,
      weight: weightKg,
      height: heightCm,
      goalWeight: goalWeightVal,
      goal,
      activityLevel,
      fitnessExperience,
      sleepHours,
      stressLevel,
      tdee,
      macros,
      household,
      onboardedAt: new Date().toISOString(),
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    saveProfile(profile);
    router.replace('/');
  };

  const goalIcons: Record<Goal, string> = {
    weight_loss: '🔥',
    muscle_gain: '💪',
    wellness: '🧘',
  };

  const goalDescriptions: Record<Goal, string> = {
    weight_loss: 'Lose fat while maintaining muscle with a calorie deficit and high-protein meals.',
    muscle_gain: 'Build strength and size with a calorie surplus and progressive training.',
    wellness: 'Feel your best with balanced nutrition, movement, and recovery.',
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col">
      {/* Progress bar */}
      <div className="bg-[#e0e5ec] px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-700">Set Up Your Profile</h1>
            <span className="text-sm text-gray-400">Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="neu-pressed w-full h-3 !rounded-full">
            <div
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        {/* Step 1: Name, Age, Sex */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Welcome to Pulse</h2>
              <p className="text-gray-500 mt-2">Let&apos;s get to know you a bit</p>
            </div>
            <div className="neu-flat p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="neu-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 0)}
                  min={10}
                  max={100}
                  className="neu-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sex</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['female', 'male'] as Sex[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setSex(s)}
                      className={`py-3 rounded-xl font-medium text-sm transition-all ${
                        sex === s
                          ? 'neu-pressed text-purple-600'
                          : 'neu-btn text-gray-500'
                      }`}
                    >
                      {s === 'female' ? 'Female' : 'Male'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Weight, Height */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Your Body</h2>
              <p className="text-gray-500 mt-2">Used to calculate your personalized nutrition</p>
            </div>
            <div className="neu-flat p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (lbs)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                  min={66}
                  max={660}
                  step={1}
                  className="neu-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Weight (lbs)</label>
                <input
                  type="number"
                  value={goalWeightVal}
                  onChange={e => setGoalWeightVal(parseFloat(e.target.value) || 0)}
                  min={66}
                  max={660}
                  step={1}
                  className="neu-input"
                />
                <p className="text-xs text-gray-400 mt-1">What weight are you working toward?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Height</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Feet</label>
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={e => setHeightFeet(parseInt(e.target.value) || 0)}
                      min={3}
                      max={8}
                      className="neu-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Inches</label>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={e => setHeightInches(parseInt(e.target.value) || 0)}
                      min={0}
                      max={11}
                      className="neu-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Your Goal</h2>
              <p className="text-gray-500 mt-2">This shapes your meal plans and workouts</p>
            </div>
            <div className="space-y-3">
              {(Object.keys(GOAL_LABELS) as Goal[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full text-left p-5 transition-all ${
                    goal === g
                      ? 'neu-pressed'
                      : 'neu-flat'
                  }`}
                  style={goal === g ? {
                    background: g === 'weight_loss'
                      ? 'linear-gradient(135deg, #e0e5ec 0%, #fce4ec 100%)'
                      : g === 'muscle_gain'
                      ? 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 100%)'
                      : 'linear-gradient(135deg, #e0e5ec 0%, #d1fae5 100%)'
                  } : {}}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{goalIcons[g]}</span>
                    <div className="flex-1">
                      <h3 className={`font-bold ${goal === g ? 'text-purple-600' : 'text-gray-700'}`}>{GOAL_LABELS[g]}</h3>
                      <p className="text-sm text-gray-500 mt-1">{goalDescriptions[g]}</p>
                    </div>
                    {goal === g && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center mt-1" style={{ background: 'linear-gradient(145deg, #c084fc, #a78bfa)' }}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Activity Level & Experience */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Activity & Experience</h2>
              <p className="text-gray-500 mt-2">Helps us tailor your workout plan</p>
            </div>
            <div className="neu-flat p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
                <div className="space-y-2">
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map(level => (
                    <button
                      key={level}
                      onClick={() => setActivityLevel(level)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        activityLevel === level
                          ? 'neu-pressed text-purple-600 font-medium'
                          : 'neu-btn text-gray-500'
                      }`}
                    >
                      {ACTIVITY_LABELS[level]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Fitness Experience</label>
                <div className="space-y-2">
                  {(Object.keys(EXPERIENCE_LABELS) as FitnessExperience[]).map(exp => (
                    <button
                      key={exp}
                      onClick={() => setFitnessExperience(exp)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        fitnessExperience === exp
                          ? 'neu-pressed text-purple-600 font-medium'
                          : 'neu-btn text-gray-500'
                      }`}
                    >
                      {EXPERIENCE_LABELS[exp]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Sleep & Stress */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Lifestyle</h2>
              <p className="text-gray-500 mt-2">Sleep and stress affect your recovery and results</p>
            </div>
            <div className="neu-flat p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Average Sleep: <span className="text-purple-500 font-bold">{sleepHours}h</span>
                </label>
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={0.5}
                  value={sleepHours}
                  onChange={e => setSleepHours(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>4h</span>
                  <span>8h</span>
                  <span>12h</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Typical Stress Level
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setStressLevel(level)}
                      className={`py-3 rounded-xl font-medium text-sm transition-all ${
                        stressLevel === level
                          ? 'neu-pressed text-purple-600'
                          : 'neu-btn text-gray-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Household Members */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700">Household</h2>
              <p className="text-gray-500 mt-2">
                Add family members for combined shopping lists (optional)
              </p>
            </div>

            {household.length > 0 && (
              <div className="space-y-3">
                {household.map(m => (
                  <div key={m.id} className="neu-flat p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{m.name}</p>
                      <p className="text-sm text-gray-500">
                        {m.age}y, {Math.round(m.weight * 2.205)}lbs — {GOAL_LABELS[m.goal]}
                      </p>
                    </div>
                    <button
                      onClick={() => setHousehold(household.filter(h => h.id !== m.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showMemberForm ? (
              <div className="neu-flat p-6 space-y-4">
                <input
                  type="text"
                  value={memberName}
                  onChange={e => setMemberName(e.target.value)}
                  placeholder="Name"
                  className="neu-input"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Age</label>
                    <input
                      type="number"
                      value={memberAge}
                      onChange={e => setMemberAge(parseInt(e.target.value) || 0)}
                      className="neu-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Sex</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['female', 'male'] as Sex[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setMemberSex(s)}
                          className={`py-2 rounded-xl text-xs font-medium ${
                            memberSex === s
                              ? 'neu-pressed text-purple-600'
                              : 'neu-btn text-gray-500'
                          }`}
                        >
                          {s === 'female' ? 'F' : 'M'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={memberWeight}
                    onChange={e => setMemberWeight(parseFloat(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Height</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Feet</label>
                      <input
                        type="number"
                        value={memberHeightFeet}
                        onChange={e => setMemberHeightFeet(parseInt(e.target.value) || 0)}
                        className="neu-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Inches</label>
                      <input
                        type="number"
                        value={memberHeightInches}
                        onChange={e => setMemberHeightInches(parseInt(e.target.value) || 0)}
                        className="neu-input text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Goal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(GOAL_LABELS) as Goal[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setMemberGoal(g)}
                        className={`py-2 rounded-xl text-xs font-medium ${
                          memberGoal === g
                            ? 'neu-pressed text-purple-600'
                            : 'neu-btn text-gray-500'
                        }`}
                      >
                        {GOAL_LABELS[g]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMemberForm(false)}
                    className="neu-btn flex-1 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMember}
                    disabled={!memberName.trim()}
                    className="neu-btn-accent flex-1 py-2.5 text-sm disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowMemberForm(true)}
                className="neu-btn w-full py-3 text-sm text-gray-500 hover:text-purple-500 transition-colors"
              >
                + Add Household Member
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-[#e0e5ec] p-4" style={{ boxShadow: '0 -4px 12px rgba(184, 190, 199, 0.3)' }}>
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="neu-btn flex-1 py-3 font-medium"
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="neu-btn-accent flex-1 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="neu-btn-accent flex-1 py-3 font-medium"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
