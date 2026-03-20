'use client';

import { GapAnalysis } from '@/lib/lifeHappens';

interface LifeHappensBannerProps {
  gap: GapAnalysis;
  onDismiss: () => void;
}

export default function LifeHappensBanner({
  gap,
  onDismiss,
}: LifeHappensBannerProps) {
  if (gap.severity === 'none') return null;

  return (
    <div className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 p-5 text-white shadow-md">
      <p className="text-sm font-medium leading-relaxed mb-4">{gap.message}</p>
      <button
        onClick={onDismiss}
        className="rounded-lg bg-white/25 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/35 active:bg-white/45 transition-colors"
      >
        Let&apos;s Go
      </button>
    </div>
  );
}
