'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-24 left-6 inline-flex items-center gap-2 text-slate-500 hover:text-[#E81A2D] transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-[2.5px] border-[#0A1A3A] shrink-0 bg-white">
              <Landmark className="w-6 h-6 md:w-7 md:h-7 text-[#0A1A3A] stroke-[2.5]" />
              <div className="absolute -bottom-1 -right-0.5 text-[#E81A2D] drop-shadow-sm">
                 <svg width="12" height="16" viewBox="0 0 10 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-5 md:w-4 md:h-6">
                   <path d="M0 0H10V14L5 11L0 14V0Z" />
                 </svg>
              </div>
            </div>
            <div className="w-[1.5px] h-10 md:h-12 bg-slate-200" />
            <span className="font-serif text-4xl md:text-5xl font-medium text-[#0A1A3A] tracking-tight leading-none mt-1">
              college<span className="text-[#E81A2D]">Q</span>
            </span>
          </div>
          <h2 className="text-center text-3xl font-serif font-medium text-slate-900">
            Sign in to collegeQ
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#E81A2D] p-4 text-sm text-center font-medium">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full border border-slate-200 bg-[#FAFAFA] px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full border border-slate-200 bg-[#FAFAFA] px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center bg-[#E81A2D] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#c91525] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E81A2D] disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-600 mt-8 pt-6 border-t border-slate-100">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-bold uppercase tracking-widest text-xs text-[#E81A2D] hover:underline ml-2">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
