'use client';

import { useState } from 'react';
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
import { removeStored } from '@/lib/storage';

export default function ProfilePage() {
  const { profile, saveProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Editable fields
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age ?? 25);
  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'female');
  const [weight, setWeight] = useState(profile?.weight ?? 65);
  const [height, setHeight] = useState(profile?.height ?? 165);
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'wellness');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile?.activityLevel ?? 'moderate');
  const [fitnessExperience, setFitnessExperience] = useState<FitnessExperience>(profile?.fitnessExperience ?? 'beginner');

  // New member
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState(25);
  const [memberSex, setMemberSex] = useState<Sex>('female');
  const [memberWeight, setMemberWeight] = useState(65);
  const [memberHeight, setMemberHeight] = useState(165);
  const [memberGoal, setMemberGoal] = useState<Goal>('wellness');

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const handleSave = () => {
    const bmr = calculateBMR(sex, weight, height, age);
    const tdee = calculateTDEE(bmr, activityLevel);
    const macros = calculateMacros(tdee, goal);
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      age,
      sex,
      weight,
      height,
      goal,
      activityLevel,
      fitnessExperience,
      tdee,
      macros,
    };
    saveProfile(updated);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setName(profile.name);
    setAge(profile.age);
    setSex(profile.sex);
    setWeight(profile.weight);
    setHeight(profile.height);
    setGoal(profile.goal);
    setActivityLevel(profile.activityLevel);
    setFitnessExperience(profile.fitnessExperience);
    setIsEditing(true);
  };

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    const bmr = calculateBMR(memberSex, memberWeight, memberHeight, memberAge);
    const tdee = calculateTDEE(bmr, 'moderate');
    const macros = calculateMacros(tdee, memberGoal);
    const member: HouseholdMember = {
      id: `member-${Date.now()}`,
      name: memberName.trim(),
      age: memberAge,
      sex: memberSex,
      weight: memberWeight,
      height: memberHeight,
      goal: memberGoal,
      activityLevel: 'moderate',
      tdee,
      macros,
    };
    const updated: UserProfile = {
      ...profile,
      household: [...profile.household, member],
    };
    saveProfile(updated);
    setMemberName('');
    setMemberAge(25);
    setMemberSex('female');
    setMemberWeight(65);
    setMemberHeight(165);
    setMemberGoal('wellness');
    setShowAddMember(false);
  };

  const handleRemoveMember = (id: string) => {
    const updated: UserProfile = {
      ...profile,
      household: profile.household.filter(m => m.id !== id),
    };
    saveProfile(updated);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('pulse_'));
      keys.forEach(k => removeStored(k));
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-700">Profile</h1>

        {/* Profile card */}
        <div className="neu-flat p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="neu-input text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(parseFloat(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['female', 'male'] as Sex[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setSex(s)}
                      className={`py-2 rounded-xl text-sm font-medium ${
                        sex === s ? 'neu-pressed text-purple-600' : 'neu-btn text-gray-500'
                      }`}
                    >
                      {s === 'female' ? 'Female' : 'Male'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(GOAL_LABELS) as Goal[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`py-2 rounded-xl text-xs font-medium ${
                        goal === g ? 'neu-pressed text-purple-600' : 'neu-btn text-gray-500'
                      }`}
                    >
                      {GOAL_LABELS[g]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
                  className="neu-input text-sm"
                >
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map(level => (
                    <option key={level} value={level}>{ACTIVITY_LABELS[level]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Experience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(EXPERIENCE_LABELS) as FitnessExperience[]).map(exp => (
                    <button
                      key={exp}
                      onClick={() => setFitnessExperience(exp)}
                      className={`py-2 rounded-xl text-xs font-medium ${
                        fitnessExperience === exp ? 'neu-pressed text-purple-600' : 'neu-btn text-gray-500'
                      }`}
                    >
                      {exp.charAt(0).toUpperCase() + exp.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="neu-btn flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="neu-btn-accent flex-1 py-2.5 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-700">{profile.name}</h2>
                  <p className="text-sm text-gray-500">
                    {profile.age}y, {profile.sex === 'female' ? 'Female' : 'Male'} &middot; {profile.weight}kg &middot; {profile.height}cm
                  </p>
                </div>
                <button
                  onClick={handleStartEdit}
                  className="neu-btn text-sm text-purple-500"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="neu-pressed rounded-xl p-3">
                  <p className="text-xs text-gray-400">Goal</p>
                  <p className="text-sm font-medium text-gray-700">{GOAL_LABELS[profile.goal]}</p>
                </div>
                <div className="neu-pressed rounded-xl p-3">
                  <p className="text-xs text-gray-400">Activity</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{profile.activityLevel.replace('_', ' ')}</p>
                </div>
                <div className="neu-pressed rounded-xl p-3">
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{profile.fitnessExperience}</p>
                </div>
                <div className="neu-pressed rounded-xl p-3">
                  <p className="text-xs text-gray-400">Member since</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(profile.onboardedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TDEE & Macros */}
        <div className="neu-flat p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Daily Targets
          </h2>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-gray-700">{profile.tdee}</p>
            <p className="text-xs text-gray-500">TDEE (kcal/day)</p>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="neu-pressed rounded-xl p-3">
              <p className="text-lg font-bold text-rose-500">{profile.macros.calories}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div className="neu-pressed rounded-xl p-3">
              <p className="text-lg font-bold text-violet-500">{profile.macros.protein}g</p>
              <p className="text-xs text-gray-500">protein</p>
            </div>
            <div className="neu-pressed rounded-xl p-3">
              <p className="text-lg font-bold text-amber-500">{profile.macros.carbs}g</p>
              <p className="text-xs text-gray-500">carbs</p>
            </div>
            <div className="neu-pressed rounded-xl p-3">
              <p className="text-lg font-bold text-emerald-500">{profile.macros.fat}g</p>
              <p className="text-xs text-gray-500">fat</p>
            </div>
          </div>
        </div>

        {/* Household Members */}
        <div className="neu-flat p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Household Members
            </h2>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="neu-btn text-sm text-purple-500 !py-1.5 !px-3"
            >
              {showAddMember ? 'Cancel' : '+ Add'}
            </button>
          </div>

          {showAddMember && (
            <div className="neu-pressed rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                placeholder="Name"
                className="neu-input text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
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
                  <label className="block text-xs text-gray-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={memberWeight}
                    onChange={e => setMemberWeight(parseFloat(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={memberHeight}
                    onChange={e => setMemberHeight(parseFloat(e.target.value) || 0)}
                    className="neu-input text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sex</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['female', 'male'] as Sex[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setMemberSex(s)}
                        className={`py-1.5 rounded-xl text-xs font-medium ${
                          memberSex === s ? 'neu-pressed text-purple-600' : 'neu-btn text-gray-500'
                        }`}
                      >
                        {s === 'female' ? 'F' : 'M'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Goal</label>
                  <select
                    value={memberGoal}
                    onChange={e => setMemberGoal(e.target.value as Goal)}
                    className="neu-input text-xs !py-1.5"
                  >
                    {(Object.keys(GOAL_LABELS) as Goal[]).map(g => (
                      <option key={g} value={g}>{GOAL_LABELS[g]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddMember}
                disabled={!memberName.trim()}
                className="neu-btn-accent w-full py-2 text-sm disabled:opacity-50"
              >
                Add Member
              </button>
            </div>
          )}

          {profile.household.length > 0 ? (
            <div className="space-y-3">
              {profile.household.map(member => (
                <div key={member.id} className="neu-flat p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-700">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        {member.age}y, {member.sex === 'female' ? 'F' : 'M'} &middot; {member.weight}kg &middot; {GOAL_LABELS[member.goal]}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-rose-500">{member.macros.calories}</p>
                      <p className="text-[10px] text-gray-400">kcal</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-violet-500">{member.macros.protein}g</p>
                      <p className="text-[10px] text-gray-400">protein</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-500">{member.macros.carbs}g</p>
                      <p className="text-[10px] text-gray-400">carbs</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-500">{member.macros.fat}g</p>
                      <p className="text-[10px] text-gray-400">fat</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">No household members yet</p>
          )}
        </div>

        {/* Danger zone */}
        <div className="neu-flat p-5">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
            Danger Zone
          </h2>
          {showConfirmReset ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                This will permanently delete all your data, including profile, meal logs, workout history, recovery data, and journal entries. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="neu-btn flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="neu-btn-rose flex-1 py-2.5 text-sm"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="neu-btn w-full py-2.5 text-sm text-red-500"
            >
              Reset All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
