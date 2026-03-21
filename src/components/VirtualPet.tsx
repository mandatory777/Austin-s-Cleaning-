'use client';

import { useState, useEffect } from 'react';
import { WaterLog, PetState, getPetMood, getPetMessage, PET_TYPES } from '@/lib/water';
import { getStored, setStored } from '@/lib/storage';

// Pet face SVG drawings based on mood
function PetFace({ type, mood }: { type: PetState['type']; mood: PetState['mood'] }) {
  const isHappy = mood === 'thriving' || mood === 'happy';
  const isOkay = mood === 'okay';

  // Eye style based on mood
  const eyeStyle = isHappy ? 'happy' : isOkay ? 'neutral' : 'sad';

  // Bounce animation for happy pets
  const bounceClass = mood === 'thriving' ? 'animate-bounce' : '';

  return (
    <div className={`relative ${bounceClass}`} style={{ animationDuration: '2s' }}>
      <div className="relative w-24 h-24 mx-auto">
        {/* Body */}
        <div className="absolute inset-0 rounded-full" style={{
          background: type === 'cat' ? 'linear-gradient(145deg, #fbbf24, #f59e0b)' :
                     type === 'dog' ? 'linear-gradient(145deg, #a78bfa, #8b5cf6)' :
                     type === 'bunny' ? 'linear-gradient(145deg, #f9a8d4, #ec4899)' :
                     'linear-gradient(145deg, #6ee7b7, #10b981)',
          boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
        }} />

        {/* Ears */}
        {type === 'cat' && (
          <>
            <div className="absolute -top-3 left-3 w-5 h-7 rounded-t-full" style={{ background: 'linear-gradient(145deg, #fbbf24, #f59e0b)', transform: 'rotate(-15deg)' }} />
            <div className="absolute -top-3 right-3 w-5 h-7 rounded-t-full" style={{ background: 'linear-gradient(145deg, #fbbf24, #f59e0b)', transform: 'rotate(15deg)' }} />
          </>
        )}
        {type === 'dog' && (
          <>
            <div className="absolute -top-1 left-0 w-6 h-8 rounded-t-full rounded-bl-full" style={{ background: 'linear-gradient(145deg, #c4b5fd, #a78bfa)', transform: 'rotate(-20deg)' }} />
            <div className="absolute -top-1 right-0 w-6 h-8 rounded-t-full rounded-br-full" style={{ background: 'linear-gradient(145deg, #c4b5fd, #a78bfa)', transform: 'rotate(20deg)' }} />
          </>
        )}
        {type === 'bunny' && (
          <>
            <div className="absolute -top-8 left-5 w-4 h-12 rounded-full" style={{ background: 'linear-gradient(145deg, #f9a8d4, #ec4899)' }} />
            <div className="absolute -top-8 right-5 w-4 h-12 rounded-full" style={{ background: 'linear-gradient(145deg, #f9a8d4, #ec4899)' }} />
          </>
        )}

        {/* Eyes */}
        <div className="absolute top-7 left-0 right-0 flex justify-center gap-5">
          {eyeStyle === 'happy' ? (
            <>
              <div className="w-3.5 h-2 border-t-[2.5px] border-gray-800 rounded-t-full" />
              <div className="w-3.5 h-2 border-t-[2.5px] border-gray-800 rounded-t-full" />
            </>
          ) : eyeStyle === 'neutral' ? (
            <>
              <div className="w-3 h-3 bg-gray-800 rounded-full" />
              <div className="w-3 h-3 bg-gray-800 rounded-full" />
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-3.5 h-3 bg-gray-800 rounded-full" />
                {mood === 'parched' && <div className="absolute -bottom-2 left-3 w-1.5 h-2 bg-blue-400 rounded-full opacity-70" />}
              </div>
              <div className="relative">
                <div className="w-3.5 h-3 bg-gray-800 rounded-full" />
                {mood === 'parched' && <div className="absolute -bottom-2 right-3 w-1.5 h-2 bg-blue-400 rounded-full opacity-70" />}
              </div>
            </>
          )}
        </div>

        {/* Mouth */}
        <div className="absolute top-[52px] left-0 right-0 flex justify-center">
          {isHappy ? (
            <div className="w-5 h-3 border-b-[2.5px] border-gray-800 rounded-b-full" />
          ) : isOkay ? (
            <div className="w-4 h-[2.5px] bg-gray-800 rounded-full" />
          ) : (
            <div className="w-4 h-2.5 border-t-[2.5px] border-gray-800 rounded-t-full" />
          )}
        </div>

        {/* Cheeks (blush when happy) */}
        {isHappy && (
          <>
            <div className="absolute top-11 left-3 w-4 h-2.5 rounded-full bg-pink-300/40" />
            <div className="absolute top-11 right-3 w-4 h-2.5 rounded-full bg-pink-300/40" />
          </>
        )}

        {/* Frog spots */}
        {type === 'frog' && (
          <>
            <div className="absolute top-3 left-5 w-5 h-5 rounded-full border-2 border-emerald-700/20" />
            <div className="absolute top-3 right-5 w-5 h-5 rounded-full border-2 border-emerald-700/20" />
          </>
        )}
      </div>

      {/* Water drops floating up when thriving */}
      {mood === 'thriving' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="text-xs animate-pulse" style={{ animationDelay: '0s' }}>💧</span>
          <span className="text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
          <span className="text-xs animate-pulse" style={{ animationDelay: '1s' }}>💧</span>
        </div>
      )}
    </div>
  );
}

// Water progress bar
function WaterProgress({ glasses, goal }: { glasses: number; goal: number }) {
  const pct = Math.min((glasses / goal) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{glasses} of {goal} glasses</span>
        <span>{glasses * 8} oz</span>
      </div>
      <div className="h-3 rounded-full" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct >= 100
              ? 'linear-gradient(90deg, #34d399, #10b981)'
              : pct >= 50
              ? 'linear-gradient(90deg, #60a5fa, #3b82f6)'
              : 'linear-gradient(90deg, #93c5fd, #60a5fa)',
          }}
        />
      </div>
    </div>
  );
}

export default function VirtualPet() {
  const [waterLog, setWaterLog] = useState<WaterLog | null>(null);
  const [pet, setPet] = useState<PetState | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [petName, setPetName] = useState('');
  const [selectedType, setSelectedType] = useState<PetState['type']>('cat');
  const [ripple, setRipple] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedPet = getStored<PetState | null>('pulse_pet', null);
    const storedWater = getStored<WaterLog | null>(`pulse_water_${today}`, null);

    if (storedPet) {
      setPet(storedPet);
    }

    if (storedWater) {
      setWaterLog(storedWater);
    } else {
      // Create new day's water log
      const newLog: WaterLog = { date: today, glasses: 0, goal: 8, lastLoggedAt: '' };
      setWaterLog(newLog);
      setStored(`pulse_water_${today}`, newLog);
    }
  }, [today]);

  const addWater = () => {
    if (!waterLog || !pet) return;
    const updated: WaterLog = {
      ...waterLog,
      glasses: waterLog.glasses + 1,
      lastLoggedAt: new Date().toISOString(),
    };
    setWaterLog(updated);
    setStored(`pulse_water_${today}`, updated);

    // Update streak if just hit goal
    if (updated.glasses === updated.goal && pet.streak >= 0) {
      const updatedPet = { ...pet, streak: pet.streak + 1 };
      setPet(updatedPet);
      setStored('pulse_pet', updatedPet);
    }

    // Ripple effect
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  };

  const removeWater = () => {
    if (!waterLog || waterLog.glasses <= 0) return;
    const updated: WaterLog = { ...waterLog, glasses: waterLog.glasses - 1 };
    setWaterLog(updated);
    setStored(`pulse_water_${today}`, updated);
  };

  const createPet = () => {
    if (!petName.trim()) return;
    const newPet: PetState = {
      name: petName.trim(),
      type: selectedType,
      mood: 'parched',
      streak: 0,
      createdAt: new Date().toISOString(),
    };
    setPet(newPet);
    setStored('pulse_pet', newPet);
    setShowSetup(false);
  };

  // No pet yet — show adopt button or setup
  if (!pet) {
    if (showSetup) {
      return (
        <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 50%, #ede9fe 100%)' }}>
          <h3 className="text-sm font-bold text-gray-700 mb-4">🐾 Adopt Your Hydration Buddy</h3>

          {/* Pet type selection */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PET_TYPES.map(pt => (
              <button
                key={pt.type}
                onClick={() => setSelectedType(pt.type)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  selectedType === pt.type ? 'neu-pressed' : 'neu-flat'
                }`}
              >
                <span className="text-2xl">{pt.emoji}</span>
                <span className="text-[10px] font-medium text-gray-500">{pt.label}</span>
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            type="text"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            placeholder="Name your pet..."
            className="neu-input mb-4 text-sm"
            maxLength={15}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowSetup(false)}
              className="neu-btn flex-1 text-sm py-2.5"
            >
              Cancel
            </button>
            <button
              onClick={createPet}
              className="neu-btn-blue flex-1 text-sm py-2.5"
              disabled={!petName.trim()}
            >
              Adopt! 🎉
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowSetup(true)}
        className="w-full neu-flat p-5 text-center hover:shadow-none transition-shadow"
        style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 50%, #ede9fe 100%)' }}
      >
        <div className="text-3xl mb-2">🐾</div>
        <h3 className="text-sm font-bold text-gray-700">Adopt a Hydration Buddy!</h3>
        <p className="text-xs text-gray-400 mt-1">A virtual pet that thrives when you drink water</p>
      </button>
    );
  }

  // Pet exists — show pet + water tracker
  const mood = getPetMood(waterLog?.glasses ?? 0, waterLog?.goal ?? 8);
  const message = getPetMessage(mood, pet.name, waterLog?.glasses ?? 0, waterLog?.goal ?? 8);

  return (
    <div className="neu-flat p-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 50%, #ede9fe 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            💧 {pet.name}
            {pet.streak > 0 && (
              <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                🔥 {pet.streak} day streak
              </span>
            )}
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {PET_TYPES.find(p => p.type === pet.type)?.emoji}
        </span>
      </div>

      {/* Pet face */}
      <div className="flex items-center justify-center py-2">
        <div className={`transition-transform duration-300 ${ripple ? 'scale-110' : 'scale-100'}`}>
          <PetFace type={pet.type} mood={mood} />
        </div>
      </div>

      {/* Message */}
      <p className="text-center text-xs text-gray-500 mt-2 mb-4 font-medium">{message}</p>

      {/* Water progress */}
      <WaterProgress glasses={waterLog?.glasses ?? 0} goal={waterLog?.goal ?? 8} />

      {/* Water buttons */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={removeWater}
          disabled={!waterLog || waterLog.glasses <= 0}
          className="neu-btn w-10 h-10 flex items-center justify-center rounded-full !p-0 text-gray-500 disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>

        <button
          onClick={addWater}
          className="neu-btn-blue w-14 h-14 flex items-center justify-center rounded-full !p-0 text-lg font-bold relative"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {ripple && (
            <span className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping" />
          )}
        </button>

        <button
          onClick={removeWater}
          disabled
          className="w-10 h-10 opacity-0"
          aria-hidden
        >
          {/* spacer for centering */}
        </button>
      </div>

      {/* Glass indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: waterLog?.goal ?? 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-4 rounded-sm transition-all duration-300"
            style={{
              background: i < (waterLog?.glasses ?? 0)
                ? 'linear-gradient(180deg, #60a5fa, #3b82f6)'
                : '#d1d5db',
              boxShadow: i < (waterLog?.glasses ?? 0)
                ? '0 1px 3px rgba(59,130,246,0.4)'
                : 'inset 1px 1px 2px #b8bec7',
            }}
          />
        ))}
      </div>
    </div>
  );
}
