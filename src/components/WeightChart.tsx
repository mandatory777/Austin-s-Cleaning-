'use client';

import { useState, useMemo } from 'react';
import { WeightEntry } from '@/lib/profile';
import { getStored, setStored } from '@/lib/storage';

interface WeightChartProps {
  currentWeightKg: number;
  goalWeight?: number; // lbs
  startWeight: number; // lbs (from onboarding)
}

export default function WeightChart({ currentWeightKg, goalWeight, startWeight }: WeightChartProps) {
  const [entries, setEntries] = useState<WeightEntry[]>(() =>
    getStored<WeightEntry[]>('pulse_weight_log', [])
  );
  const [newWeight, setNewWeight] = useState('');
  const [showInput, setShowInput] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const currentWeightLbs = Math.round(currentWeightKg * 2.205);

  // Make sure we have at least the starting weight
  const allEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    // If no entries, use current weight as first entry
    if (sorted.length === 0) {
      return [{ date: today, weight: currentWeightLbs }];
    }
    return sorted;
  }, [entries, currentWeightLbs, today]);

  const latestWeight = allEntries[allEntries.length - 1]?.weight ?? currentWeightLbs;
  const loggedToday = entries.some(e => e.date === today);

  const handleLog = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 50 || w > 700) return;

    const entry: WeightEntry = { date: today, weight: w };
    const updated = [...entries.filter(e => e.date !== today), entry];
    setEntries(updated);
    setStored('pulse_weight_log', updated);
    setNewWeight('');
    setShowInput(false);
  };

  // Chart calculations
  const chartEntries = allEntries.slice(-14); // Last 14 entries
  const weights = chartEntries.map(e => e.weight);
  const allWeights = [...weights];
  if (goalWeight) allWeights.push(goalWeight);
  allWeights.push(startWeight);

  const minW = Math.min(...allWeights) - 3;
  const maxW = Math.max(...allWeights) + 3;
  const range = maxW - minW || 1;

  // Progress toward goal
  const progressPct = goalWeight
    ? Math.min(100, Math.max(0, Math.round(((startWeight - latestWeight) / (startWeight - goalWeight)) * 100)))
    : null;

  const weightDiff = startWeight - latestWeight;
  const toGo = goalWeight ? latestWeight - goalWeight : null;

  // SVG chart dimensions
  const chartW = 320;
  const chartH = 120;
  const padX = 10;
  const padY = 10;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  // Build line path
  const points = chartEntries.map((e, i) => {
    const x = padX + (chartEntries.length > 1 ? (i / (chartEntries.length - 1)) * plotW : plotW / 2);
    const y = padY + plotH - ((e.weight - minW) / range) * plotH;
    return { x, y, weight: e.weight, date: e.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Area fill path
  const areaPath = linePath + ` L${points[points.length - 1]?.x ?? 0},${chartH - padY} L${points[0]?.x ?? 0},${chartH - padY} Z`;

  // Goal weight line Y position
  const goalY = goalWeight ? padY + plotH - ((goalWeight - minW) / range) * plotH : null;

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Weight Progress
          </h2>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-700">{latestWeight}</span>
          <span className="text-xs text-gray-400 ml-1">lbs</span>
        </div>
      </div>

      {/* Progress bar toward goal */}
      {goalWeight && progressPct !== null && (
        <div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
            <span>Start: {startWeight} lbs</span>
            <span>Goal: {goalWeight} lbs</span>
          </div>
          <div className="h-3 rounded-full" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(2, progressPct)}%`,
                background: progressPct >= 100
                  ? 'linear-gradient(90deg, #34d399, #10b981)'
                  : progressPct >= 50
                  ? 'linear-gradient(90deg, #60a5fa, #8b5cf6)'
                  : 'linear-gradient(90deg, #c084fc, #8b5cf6)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] font-bold text-violet-500">
              {progressPct >= 100 ? 'Goal reached! 🎉' : `${progressPct}% there`}
            </span>
            {toGo !== null && toGo > 0 && (
              <span className="text-[10px] text-gray-400">
                {weightDiff > 0 ? `${Math.abs(weightDiff).toFixed(1)} lost` : ''} · {toGo.toFixed(1)} to go
              </span>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-xl p-2" style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: '140px' }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(pct => (
            <line
              key={pct}
              x1={padX} y1={padY + plotH * (1 - pct)}
              x2={chartW - padX} y2={padY + plotH * (1 - pct)}
              stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="4,4"
            />
          ))}

          {/* Goal weight line */}
          {goalY !== null && goalWeight && (
            <>
              <line
                x1={padX} y1={goalY}
                x2={chartW - padX} y2={goalY}
                stroke="#10b981" strokeWidth="1" strokeDasharray="6,3"
              />
              <text x={chartW - padX - 2} y={goalY - 4} textAnchor="end" className="text-[8px]" fill="#10b981" fontWeight="600">
                Goal {goalWeight}
              </text>
            </>
          )}

          {/* Area fill */}
          {points.length > 1 && (
            <path d={areaPath} fill="url(#weightGradient)" opacity="0.3" />
          )}

          {/* Line */}
          {points.length > 1 && (
            <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="white" strokeWidth="2" />
              {/* Show weight label on first, last, and every 3rd point */}
              {(i === 0 || i === points.length - 1 || i % 3 === 0) && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[8px]"
                  fill="#6b7280"
                  fontWeight="600"
                >
                  {p.weight}
                </text>
              )}
            </g>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Date labels */}
      {chartEntries.length > 1 && (
        <div className="flex justify-between px-2">
          <span className="text-[9px] text-gray-400">
            {new Date(chartEntries[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-[9px] text-gray-400">
            {new Date(chartEntries[chartEntries.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      )}

      {/* Log weight button / input */}
      {showInput ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="Enter weight (lbs)"
            className="flex-1 px-3 py-2 rounded-xl text-sm text-gray-700"
            style={{ boxShadow: 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff' }}
            autoFocus
            step="0.1"
            min="50"
            max="700"
          />
          <button
            onClick={handleLog}
            disabled={!newWeight}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
          >
            Save
          </button>
          <button
            onClick={() => { setShowInput(false); setNewWeight(''); }}
            className="px-3 py-2 rounded-xl text-sm text-gray-500"
            style={{ boxShadow: '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff' }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' }}
        >
          <span className={loggedToday ? 'text-green-600' : 'text-violet-600'}>
            {loggedToday ? '✓ Logged Today — Update' : '+ Log Today\'s Weight'}
          </span>
        </button>
      )}
    </div>
  );
}
