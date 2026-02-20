'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { track } from '@vercel/analytics';

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, displayName || undefined);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      track('signup');
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
            <div className="text-5xl">✉️</div>
            <h2 className="text-2xl font-bold text-[#2D3142]">Check Your Email</h2>
            <p className="text-gray-600">
              We sent a verification link to <strong>{email}</strong>. Click the link to
              activate your account.
            </p>
            <p className="text-sm text-gray-400">
              Didn&apos;t get it? Check your spam folder.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-[#1B4965] font-medium hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center space-y-3 mb-8">
            <div className="font-[var(--font-hebrew-serif)] text-6xl text-[#1B4965] leading-none">
              א
            </div>
            <h1 className="text-2xl font-bold text-[#2D3142]">Create Your Account</h1>
            <p className="text-sm text-gray-500">
              Save your progress across devices
            </p>
          </div>

          {error && (
            <div className="bg-[#C17767]/10 text-[#C17767] text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D3142] mb-1.5">
                Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 outline-none text-base"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3142] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 outline-none text-base"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3142] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 outline-none text-base"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3142] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 outline-none text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4965] text-white py-3.5 rounded-xl text-base font-medium hover:bg-[#163d55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1B4965] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
