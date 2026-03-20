'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { RecoveryEntry, calculateRecoveryScore, getCyclePhase, getRecoveryTrend } from '@/lib/recovery';
import RecoveryGauge from '@/components/RecoveryGauge';

export default function RecoveryPage() {
  const {
    profile,
    todayRecovery,
    recoveryEntries,
    logRecovery,
    getTodayDate,
  } = useApp();

  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [soreness, setSoreness] = useState(2);
  const [stressLevel, setStressLevel] = useState(3);
  const [cycleDay, setCycleDay] = useState<string>('');

  const trend = useMemo(() => getRecoveryTrend(recoveryEntries), [recoveryEntries]);

  const last7 = useMemo(() => {
    const days: { date: string; score: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = recoveryEntries.find(e => e.date === dateStr);
      days.push({
        date: dateStr,
        score: entry ? calculateRecoveryScore(entry).total : null,
      });
    }
    return days;
  }, [recoveryEntries]);

  const handleSubmit = () => {
    const entry: RecoveryEntry = {
      date: getTodayDate(),
      sleepHours,
      sleepQuality,
      soreness,
      stressLevel,
    };

    if (cycleDay && parseInt(cycleDay) > 0) {
      entry.cycleDay = parseInt(cycleDay);
      entry.cyclePhase = getCyclePhase(parseInt(cycleDay));
    }

    logRecovery(entry);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const trendIcon = trend.trend === 'improving' ? '&#9650;' : trend.trend === 'declining' ? '&#9660;' : '&#8212;';
  const trendColor = trend.trend === 'improving' ? 'text-green-500' : trend.trend === 'declining' ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-700">Recovery</h1>

        {/* Recovery gauge */}
        {todayRecovery && (
          <div className="neu-flat p-6">
            <RecoveryGauge score={todayRecovery} />
          </div>
        )}

        {/* Input form (only if no entry today) */}
        {!todayRecovery && (
          <div className="neu-flat p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-700">How are you feeling?</h2>

            {/* Sleep hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep: <span className="text-purple-500 font-bold">{sleepHours}h</span>
              </label>
              <input
                type="number"
                min={0}
                max={14}
                step={0.5}
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value) || 0)}
                className="neu-input"
              />
            </div>

            {/* Sleep quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => setSleepQuality(v)}
                    className={`flex-1 py-2.5 rounded-xl text-lg transition-all ${
                      v <= sleepQuality
                        ? 'neu-pressed text-amber-400'
                        : 'neu-btn text-gray-400'
                    }`}
                  >
                    &#9733;
                  </button>
                ))}
              </div>
            </div>

            {/* Soreness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muscle Soreness
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => setSoreness(v)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      soreness === v
                        ? v <= 2 ? 'neu-pressed text-green-500' : v <= 3 ? 'neu-pressed text-yellow-500' : 'neu-pressed text-red-500'
                        : 'neu-btn text-gray-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Stress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => setStressLevel(v)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      stressLevel === v
                        ? v <= 2 ? 'neu-pressed text-green-500' : v <= 3 ? 'neu-pressed text-yellow-500' : 'neu-pressed text-red-500'
                        : 'neu-btn text-gray-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Cycle day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cycle Day <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min={1}
                max={35}
                value={cycleDay}
                onChange={e => setCycleDay(e.target.value)}
                placeholder="e.g. 14"
                className="neu-input"
              />
              {cycleDay && parseInt(cycleDay) > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Phase: <span className="font-medium capitalize">{getCyclePhase(parseInt(cycleDay))}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="neu-btn-accent w-full py-3 font-medium"
            >
              Log Recovery
            </button>
          </div>
        )}

        {/* 7-day history */}
        <div className="neu-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Last 7 Days
            </h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${trendColor}`} dangerouslySetInnerHTML={{ __html: trendIcon }} />
              <span className="neu-badge capitalize">{trend.trend}</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2">
            {last7.map(day => {
              const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' });
              const hasScore = day.score !== null;
              const scoreColor = hasScore
                ? day.score! >= 70 ? 'text-green-500' : day.score! >= 45 ? 'text-yellow-500' : 'text-red-500'
                : 'text-gray-400';
              return (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    hasScore ? 'neu-circle-pressed' : 'neu-circle'
                  }`}>
                    {hasScore && (
                      <span className={`text-[10px] font-bold ${scoreColor}`}>{day.score}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
