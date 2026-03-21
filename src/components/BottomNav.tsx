'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    label: 'Dashboard',
    href: '/',
    activeColor: 'text-violet-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Meals',
    href: '/meals',
    activeColor: 'text-emerald-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
  },
  {
    label: 'Workout',
    href: '/workouts',
    activeColor: 'text-rose-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" />
        <path d="M6.5 17.5h11" />
        <path d="M12 6.5v11" />
        <rect x="2" y="8" width="4" height="8" rx="1" />
        <rect x="18" y="8" width="4" height="8" rx="1" />
        <rect x="0.5" y="10" width="2" height="4" rx="0.5" />
        <rect x="21.5" y="10" width="2" height="4" rx="0.5" />
      </svg>
    ),
  },
  {
    label: 'Recovery',
    href: '/recovery',
    activeColor: 'text-blue-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Running',
    href: '/running',
    activeColor: 'text-teal-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="17" cy="4" r="2" />
        <path d="M15.59 13.51l-4.09 4.09a2 2 0 0 1-2.83 0L7 16" />
        <path d="M9.5 5.5L14 10l-3.5 3.5" />
        <path d="M6.5 8.5L3 12" />
        <path d="M14 10l4.5-1" />
      </svg>
    ),
  },
  {
    label: 'Wellness',
    href: '/wellness',
    activeColor: 'text-indigo-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on onboarding and login pages
  if (pathname === '/onboarding' || pathname === '/login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#e0e5ec] z-50" style={{ boxShadow: '0 -6px 12px #b8bec7' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive
                  ? `${tab.activeColor} neu-pressed`
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: 'currentColor' }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
