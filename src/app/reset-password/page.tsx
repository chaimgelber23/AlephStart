'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

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
            <h1 className="text-2xl font-bold text-[#2D3142]">Reset Password</h1>
            <p className="text-sm text-gray-500">
              Enter your email and we&apos;ll send a reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="bg-[#4A7C59]/10 text-[#4A7C59] rounded-xl px-4 py-4">
                <p className="font-medium">Check your email</p>
                <p className="text-sm mt-1">
                  If an account exists with <strong>{email}</strong>, we&apos;ve sent a
                  password reset link.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block text-[#1B4965] font-medium hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-[#C17767]/10 text-[#C17767] text-sm rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B4965] text-white py-3.5 rounded-xl text-base font-medium hover:bg-[#163d55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                <Link
                  href="/login"
                  className="text-[#1B4965] font-medium hover:underline"
                >
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
