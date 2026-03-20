'use client';

interface MacroRingProps {
  current: number;
  target: number;
  label: string;
  color: string;
  size?: number;
  unit?: string;
}

export default function MacroRing({
  current,
  target,
  label,
  color,
  size = 100,
}: MacroRingProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="neu-circle relative flex items-center justify-center"
        style={{ width: size + 16, height: size + 16 }}
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
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-[10px] text-gray-400">
        {Math.round(current)} / {Math.round(target)}
      </span>
    </div>
  );
}
