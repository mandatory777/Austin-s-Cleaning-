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
    <div className="neu-flat p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa]/10 to-[#f472b6]/10 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#a78bfa] to-[#f472b6]" />
      <div className="relative">
        <p className="text-sm font-medium leading-relaxed mb-4 text-gray-700">{gap.message}</p>
        <button
          onClick={onDismiss}
          className="neu-btn-accent text-sm"
        >
          Let&apos;s Go
        </button>
      </div>
    </div>
  );
}
