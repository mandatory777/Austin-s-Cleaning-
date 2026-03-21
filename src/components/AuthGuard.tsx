'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getStored } from '@/lib/storage';

const PUBLIC_PATHS = ['/login', '/onboarding'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip auth check on public pages
    if (PUBLIC_PATHS.includes(pathname)) {
      setChecked(true);
      return;
    }

    const session = getStored<{ loggedIn: boolean; email: string } | null>('pulse_session', null);
    if (!session?.loggedIn) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // On public pages, always render
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // On protected pages, wait until auth is verified
  if (!checked) return null;

  return <>{children}</>;
}
