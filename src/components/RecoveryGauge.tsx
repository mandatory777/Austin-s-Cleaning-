'use client';

import { RecoveryScore } from '@/lib/recovery';

interface RecoveryGaugeProps {
  score: RecoveryScore;
}

function getScoreColor(total: number): string {
  if (total > 80) return '#059669';  // emerald-600
  if (total > 60) return '#16a34a';  // green-600
  if (total > 40) return '#ca8a04';  // yellow-600
  return '#dc2626';                  // red-600
}

function getScoreColorClass(total: number): string {
  if (total > 80) return 'text-emerald-600';
  if (total > 60) return 'text-green-600';
  if (total > 40) return 'text-yellow-600';
  return 'text-red-600';
}

function BreakdownBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    pct > 80 ? 'bg-emerald-400' :
    pct > 60 ? 'bg-green-400' :
    pct > 40 ? 'bg-yellow-400' :
    'bg-red-400';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 neu-pressed !rounded-full overflow-hidden !p-0">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
    </div>
  );
}

export default function RecoveryGauge({ score }: RecoveryGaugeProps) {
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score.total, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const color = getScoreColor(score.total);

  return (
    <div className="neu-flat p-6">
      <div className="flex flex-col items-center mb-6">
        <div
          className="neu-circle relative flex items-center justify-center"
          style={{ width: size + 24, height: size + 24 }}
        >
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColorClass(score.total)}`}>
              {score.total}
            </span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center max-w-xs">
          {score.recommendation}
        </p>
      </div>

      <div className="space-y-3">
        <BreakdownBar label="Sleep" value={score.sleepScore} />
        <BreakdownBar label="Soreness" value={score.sorenessScore} />
        <BreakdownBar label="Stress" value={score.stressScore} />
        <BreakdownBar label="Cycle" value={score.cycleScore} />
      </div>
    </div>
  );
}
