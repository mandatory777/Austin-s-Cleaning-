'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  RunLog,
  RunningGoal,
  RUN_TYPES,
  RACE_GOALS,
  calculatePace,
  formatPace,
  formatDuration,
  estimateCalories,
  getWeeklySummary,
  getPersonalRecords,
  generateWeeklyPlan,
} from '@/lib/running';
import { getStored, setStored } from '@/lib/storage';

export default function RunningPage() {
  const { profile, getTodayDate } = useApp();
  const [runs, setRuns] = useState<RunLog[]>([]);
  const [goal, setGoal] = useState<RunningGoal | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'plan' | 'stats'>('log');

  // Log form state
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [runType, setRunType] = useState<RunLog['type']>('easy');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setRuns(getStored<RunLog[]>('pulse_runs', []));
    setGoal(getStored<RunningGoal | null>('pulse_running_goal', null));
  }, []);

  // Weekly summary
  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    return monday.toISOString().split('T')[0];
  }, []);

  const weeklySummary = useMemo(() => getWeeklySummary(runs, weekStart), [runs, weekStart]);
  const records = useMemo(() => getPersonalRecords(runs), [runs]);
  const weeklyPlan = useMemo(() => goal ? generateWeeklyPlan(goal) : null, [goal]);

  // Monthly distance chart data (last 4 weeks)
  const monthlyData = useMemo(() => {
    const weeks: { label: string; miles: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - (i * 7 + start.getDay() - 1));
      const startStr = start.toISOString().split('T')[0];
      const summary = getWeeklySummary(runs, startStr);
      weeks.push({
        label: `W${4 - i}`,
        miles: summary.totalMiles,
      });
    }
    return weeks;
  }, [runs]);

  const maxWeeklyMiles = Math.max(...monthlyData.map(w => w.miles), 1);

  const handleLogRun = () => {
    const dist = parseFloat(distance);
    const totalMinutes = (parseInt(hours || '0') * 60) + parseInt(minutes || '0') + (parseInt(seconds || '0') / 60);

    if (!dist || dist <= 0 || totalMinutes <= 0) return;

    const pace = calculatePace(dist, totalMinutes);
    const cals = estimateCalories(dist, profile?.weight || 70);

    const newRun: RunLog = {
      id: `run-${Date.now()}`,
      date: getTodayDate(),
      distance: Math.round(dist * 100) / 100,
      duration: Math.round(totalMinutes * 100) / 100,
      pace,
      type: runType,
      notes,
      caloriesBurned: cals,
      loggedAt: new Date().toISOString(),
    };

    const updated = [newRun, ...runs];
    setRuns(updated);
    setStored('pulse_runs', updated);

    // Reset form
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setRunType('easy');
    setNotes('');
    setShowLog(false);
    setActiveTab('history');
  };

  const setRunningGoal = (raceType: typeof RACE_GOALS[number]) => {
    const newGoal: RunningGoal = {
      type: raceType.type,
      targetDistance: raceType.distance,
      weeklyMileageTarget: raceType.weeklyBase,
      startDate: getTodayDate(),
    };
    setGoal(newGoal);
    setStored('pulse_running_goal', newGoal);
    setShowGoalPicker(false);
  };

  // Run history grouped by date
  const groupedRuns = useMemo(() => {
    const groups: Record<string, RunLog[]> = {};
    runs.forEach(r => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [runs]);

  // All-time stats
  const allTimeStats = useMemo(() => {
    const totalMiles = runs.reduce((s, r) => s + r.distance, 0);
    const totalMinutes = runs.reduce((s, r) => s + r.duration, 0);
    const totalCals = runs.reduce((s, r) => s + r.caloriesBurned, 0);
    return {
      totalRuns: runs.length,
      totalMiles: Math.round(totalMiles * 10) / 10,
      totalTime: totalMinutes,
      totalCals,
      avgDistance: runs.length > 0 ? Math.round((totalMiles / runs.length) * 10) / 10 : 0,
      avgPace: totalMiles > 0 ? calculatePace(totalMiles, totalMinutes) : 0,
    };
  }, [runs]);

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
        <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl p-5 -mx-4 px-4">
          <h1 className="text-2xl font-bold text-teal-700">🏃 Running</h1>
          <p className="text-sm text-gray-500">Track your runs, set goals, beat PRs</p>
        </div>

        {/* This Week Summary */}
        <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)' }}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">This Week</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">{weeklySummary.totalMiles}</div>
              <div className="text-[10px] text-gray-400 font-medium">MILES</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">{weeklySummary.totalRuns}</div>
              <div className="text-[10px] text-gray-400 font-medium">RUNS</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">{formatPace(weeklySummary.avgPace)}</div>
              <div className="text-[10px] text-gray-400 font-medium">AVG PACE</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">{formatDuration(weeklySummary.totalMinutes)}</div>
              <div className="text-[10px] text-gray-400 font-medium">TIME</div>
            </div>
          </div>

          {/* Weekly mileage goal progress */}
          {goal && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Weekly target</span>
                <span>{weeklySummary.totalMiles} / {goal.weeklyMileageTarget} mi</span>
              </div>
              <div className="h-2.5 rounded-full" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((weeklySummary.totalMiles / goal.weeklyMileageTarget) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #2dd4bf, #14b8a6)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="neu-pressed rounded-xl p-1 flex">
          {[
            { key: 'log', label: 'Log Run' },
            { key: 'history', label: 'History' },
            { key: 'plan', label: 'Plan' },
            { key: 'stats', label: 'Stats' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#e0e5ec] text-teal-600'
                  : 'text-gray-400'
              }`}
              style={activeTab === tab.key ? { boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============ LOG RUN TAB ============ */}
        {activeTab === 'log' && (
          <div className="space-y-4">
            {/* Run Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Run Type</label>
              <div className="grid grid-cols-3 gap-2">
                {RUN_TYPES.map(rt => (
                  <button
                    key={rt.type}
                    onClick={() => setRunType(rt.type)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                      runType === rt.type ? 'neu-pressed' : 'neu-flat'
                    }`}
                  >
                    <span className="text-lg">{rt.emoji}</span>
                    <span className={`text-[10px] font-semibold ${runType === rt.type ? rt.color : 'text-gray-500'}`}>
                      {rt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Distance (miles)</label>
              <input
                type="number"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="neu-input text-lg font-bold"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="23"
                    className="neu-input text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Hours</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={minutes}
                    onChange={e => setMinutes(e.target.value)}
                    placeholder="00"
                    min="0"
                    max="59"
                    className="neu-input text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Minutes</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={seconds}
                    onChange={e => setSeconds(e.target.value)}
                    placeholder="00"
                    min="0"
                    max="59"
                    className="neu-input text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Seconds</span>
                </div>
              </div>
            </div>

            {/* Live pace calc */}
            {distance && (parseInt(hours || '0') * 60 + parseInt(minutes || '0') + parseInt(seconds || '0') / 60) > 0 && (
              <div className="neu-flat p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)' }}>
                <span className="text-sm text-gray-500">Estimated Pace</span>
                <span className="text-xl font-bold text-teal-600">
                  {formatPace(calculatePace(
                    parseFloat(distance || '0'),
                    parseInt(hours || '0') * 60 + parseInt(minutes || '0') + parseInt(seconds || '0') / 60
                  ))}
                  <span className="text-xs text-gray-400 ml-1">/mi</span>
                </span>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="How did it feel? Weather, terrain..."
                className="neu-input resize-none h-20 text-sm"
              />
            </div>

            {/* Log Button */}
            <button
              onClick={handleLogRun}
              disabled={!distance || parseFloat(distance) <= 0}
              className="w-full py-3.5 font-semibold text-base rounded-xl text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(145deg, #2dd4bf, #14b8a6)', boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}
            >
              Log Run 🏃
            </button>
          </div>
        )}

        {/* ============ HISTORY TAB ============ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Weekly Distance Chart */}
            <div className="neu-flat p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Weekly Distance</h3>
              <div className="flex items-end justify-around h-32 gap-2">
                {monthlyData.map((week, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[10px] font-bold text-teal-600">{week.miles > 0 ? `${week.miles}` : ''}</span>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${Math.max((week.miles / maxWeeklyMiles) * 100, 4)}%`,
                        background: i === 3
                          ? 'linear-gradient(180deg, #2dd4bf, #14b8a6)'
                          : 'linear-gradient(180deg, #99f6e4, #5eead4)',
                        minHeight: '4px',
                      }}
                    />
                    <span className="text-[10px] text-gray-400 font-medium">{week.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Run History List */}
            {groupedRuns.length === 0 ? (
              <div className="neu-flat p-8 text-center">
                <div className="text-4xl mb-3">🏃</div>
                <h3 className="text-lg font-bold text-gray-700">No runs yet</h3>
                <p className="text-sm text-gray-400 mt-1">Log your first run to start tracking!</p>
                <button
                  onClick={() => setActiveTab('log')}
                  className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(145deg, #2dd4bf, #14b8a6)', boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}
                >
                  Log a Run
                </button>
              </div>
            ) : (
              groupedRuns.map(([date, dayRuns]) => (
                <div key={date}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                  <div className="space-y-2">
                    {dayRuns.map(run => {
                      const typeInfo = RUN_TYPES.find(t => t.type === run.type);
                      return (
                        <div key={run.id} className="neu-flat p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{typeInfo?.emoji}</span>
                              <span className={`text-sm font-semibold ${typeInfo?.color || 'text-gray-600'}`}>
                                {typeInfo?.label}
                              </span>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo?.bg} ${typeInfo?.color}`}>
                              {formatPace(run.pace)} /mi
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-lg font-bold text-gray-700">{run.distance}</div>
                              <div className="text-[10px] text-gray-400">MILES</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-700">{formatDuration(run.duration)}</div>
                              <div className="text-[10px] text-gray-400">TIME</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-700">{run.caloriesBurned}</div>
                              <div className="text-[10px] text-gray-400">CALS</div>
                            </div>
                          </div>
                          {run.notes && (
                            <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{run.notes}&rdquo;</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ============ PLAN TAB ============ */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            {/* Goal selector */}
            {!goal ? (
              <div className="neu-flat p-5 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-gray-700">Set a Running Goal</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">Choose a race distance to generate your training plan</p>
                <div className="grid grid-cols-2 gap-3">
                  {RACE_GOALS.map(rg => (
                    <button
                      key={rg.type}
                      onClick={() => setRunningGoal(rg)}
                      className="neu-flat p-4 text-center hover:shadow-none transition-shadow"
                    >
                      <div className="text-lg font-bold text-teal-600">{rg.label}</div>
                      <div className="text-xs text-gray-400">{rg.distance} miles</div>
                      <div className="text-[10px] text-gray-400 mt-1">{rg.weeklyBase} mi/week</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Current goal */}
                <div className="neu-flat p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)' }}>
                  <div>
                    <span className="text-sm font-bold text-teal-600">
                      {RACE_GOALS.find(r => r.type === goal.type)?.label || 'Custom'} Training
                    </span>
                    <p className="text-xs text-gray-400">{goal.weeklyMileageTarget} miles/week target</p>
                  </div>
                  <button
                    onClick={() => { setGoal(null); setStored('pulse_running_goal', null); }}
                    className="text-xs text-gray-400 hover:text-red-400"
                  >
                    Change
                  </button>
                </div>

                {/* Weekly plan */}
                {weeklyPlan && (
                  <div className="neu-flat p-5">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Weekly Plan</h3>
                    <div className="space-y-2">
                      {weeklyPlan.map((day, i) => {
                        const typeInfo = RUN_TYPES.find(t => t.type === day.type);
                        const dayOfWeek = new Date().getDay();
                        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                        const isToday = i === adjustedDay;

                        return (
                          <div
                            key={day.day}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${
                              isToday ? 'neu-pressed' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-medium w-8 ${isToday ? 'text-teal-600' : 'text-gray-400'}`}>
                                {day.day.slice(0, 3)}
                              </span>
                              <span className="text-sm">{typeInfo?.emoji}</span>
                              <div>
                                <span className={`text-sm ${isToday ? 'font-semibold text-teal-600' : 'text-gray-500'}`}>
                                  {day.description}
                                </span>
                              </div>
                            </div>
                            {day.miles > 0 && (
                              <span className={`text-xs font-bold ${isToday ? 'text-teal-600' : 'text-gray-400'}`}>
                                {day.miles} mi
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ============ STATS TAB ============ */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* All-Time Stats */}
            <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ccfbf1 100%)' }}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">All-Time Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{allTimeStats.totalRuns}</div>
                  <div className="text-[10px] text-gray-400 font-medium">TOTAL RUNS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{allTimeStats.totalMiles}</div>
                  <div className="text-[10px] text-gray-400 font-medium">TOTAL MILES</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{formatDuration(allTimeStats.totalTime)}</div>
                  <div className="text-[10px] text-gray-400 font-medium">TOTAL TIME</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{allTimeStats.avgDistance}</div>
                  <div className="text-[10px] text-gray-400 font-medium">AVG DIST</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{formatPace(allTimeStats.avgPace)}</div>
                  <div className="text-[10px] text-gray-400 font-medium">AVG PACE</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{allTimeStats.totalCals.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 font-medium">CALORIES</div>
                </div>
              </div>
            </div>

            {/* Personal Records */}
            <div className="neu-flat p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">🏆 Personal Records</h3>
              {runs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Log runs to see your PRs!</p>
              ) : (
                <div className="space-y-3">
                  {records.fastestPace && (
                    <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">⚡</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-700">Fastest Pace</div>
                          <div className="text-[10px] text-gray-400">
                            {records.fastestPace.distance} mi on{' '}
                            {new Date(records.fastestPace.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-amber-600">{formatPace(records.fastestPace.pace)} /mi</span>
                    </div>
                  )}
                  {records.longestRun && (
                    <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🛣️</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-700">Longest Run</div>
                          <div className="text-[10px] text-gray-400">
                            {formatDuration(records.longestRun.duration)} on{' '}
                            {new Date(records.longestRun.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{records.longestRun.distance} mi</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Run Type Breakdown */}
            {runs.length > 0 && (
              <div className="neu-flat p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Run Breakdown</h3>
                <div className="space-y-2">
                  {RUN_TYPES.map(rt => {
                    const count = runs.filter(r => r.type === rt.type).length;
                    const miles = runs.filter(r => r.type === rt.type).reduce((s, r) => s + r.distance, 0);
                    if (count === 0) return null;
                    return (
                      <div key={rt.type} className="flex items-center justify-between px-3 py-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span>{rt.emoji}</span>
                          <span className={`text-sm font-medium ${rt.color}`}>{rt.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-700">{Math.round(miles * 10) / 10} mi</span>
                          <span className="text-xs text-gray-400 ml-2">({count} runs)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
