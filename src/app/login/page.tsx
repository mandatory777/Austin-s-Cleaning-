'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStored, setStored } from '@/lib/storage';

interface StoredAuth {
  email: string;
  passwordHash: string;
  createdAt: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const hash = simpleHash(password);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const existing = getStored<StoredAuth | null>('pulse_auth', null);
      if (existing && existing.email === email.toLowerCase()) {
        setError('An account with this email already exists');
        return;
      }

      const auth: StoredAuth = {
        email: email.toLowerCase(),
        passwordHash: hash,
        createdAt: new Date().toISOString(),
      };
      setStored('pulse_auth', auth);
      setStored('pulse_session', { loggedIn: true, email: email.toLowerCase() });

      // Check if profile exists
      const profile = getStored('pulse_profile', null);
      if (profile) {
        router.replace('/');
      } else {
        router.replace('/onboarding');
      }
    } else {
      const stored = getStored<StoredAuth | null>('pulse_auth', null);
      if (!stored) {
        setError('No account found. Please sign up first.');
        return;
      }

      if (stored.email !== email.toLowerCase() || stored.passwordHash !== hash) {
        setError('Invalid email or password');
        return;
      }

      setStored('pulse_session', { loggedIn: true, email: email.toLowerCase() });

      const profile = getStored('pulse_profile', null);
      if (profile) {
        router.replace('/');
      } else {
        router.replace('/onboarding');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, #ede9fe 0%, #e0e5ec 50%, #e0e5ec 100%)' }}>
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mx-auto" style={{
            background: 'linear-gradient(145deg, #c084fc, #8b5cf6)',
            boxShadow: '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-700">Pulse</h1>
          <p className="text-gray-400 text-sm">Your Health & Fitness Companion</p>
        </div>

        {/* Toggle Sign In / Sign Up */}
        <div className="neu-pressed rounded-xl p-1 flex">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              !isSignUp
                ? 'bg-[#e0e5ec] text-purple-600'
                : 'text-gray-400'
            }`}
            style={!isSignUp ? { boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' } : {}}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isSignUp
                ? 'bg-[#e0e5ec] text-purple-600'
                : 'text-gray-400'
            }`}
            style={isSignUp ? { boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' } : {}}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="neu-flat p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="neu-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="neu-input !pr-12"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="neu-input"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="neu-btn-accent w-full py-3.5 font-semibold text-base"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-400">
          {isSignUp
            ? 'Already have an account? '
            : "Don't have an account? "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-purple-500 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
