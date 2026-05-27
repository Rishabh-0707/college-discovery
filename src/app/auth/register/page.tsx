'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
        <div>
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <span className="font-serif text-xl font-bold text-[#E81A2D]">Q</span>
          </div>
          <h2 className="text-center text-3xl font-serif font-medium text-slate-900">
            Join CollegeQ
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
              <label className="sr-only">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="relative block w-full border border-slate-200 bg-[#FAFAFA] px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] sm:text-sm transition-all"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="sr-only">Email address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="relative block w-full border border-slate-200 bg-[#FAFAFA] px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="relative block w-full border border-slate-200 bg-[#FAFAFA] px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] sm:text-sm transition-all"
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center bg-[#E81A2D] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#c91525] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E81A2D] disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-600 mt-8 pt-6 border-t border-slate-100">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold uppercase tracking-widest text-xs text-[#E81A2D] hover:underline ml-2">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
