'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCompareStore } from '@/store/useCompareStore';
import { GitCompareArrows, Bookmark, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const compareCount = useCompareStore((s) => s.colleges.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo - Red Block Style */}
          <Link href="/" className="flex items-center h-full">
            <div className="bg-[#E81A2D] h-full flex items-center justify-center px-6 lg:px-8">
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                CollegeDiscover
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <Link href="/colleges" className="text-sm font-medium text-slate-800 hover:text-[#E81A2D] transition-colors h-full flex items-center border-b-2 border-transparent hover:border-[#E81A2D]">
              Explore
            </Link>
            <Link href="/compare" className="relative text-sm font-medium text-slate-800 hover:text-[#E81A2D] transition-colors h-full flex items-center gap-1.5 border-b-2 border-transparent hover:border-[#E81A2D]">
              <GitCompareArrows className="h-4 w-4" />
              Compare
              {compareCount > 0 && (
                <span className="ml-1 bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {compareCount}
                </span>
              )}
            </Link>
            
            <div className="flex items-center gap-6 border-l border-slate-200 pl-8 ml-2">
              {session ? (
                <>
                  <Link href="/saved" className="text-sm font-medium text-slate-800 hover:text-[#E81A2D] transition-colors flex items-center gap-1.5">
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">Hi, {session.user?.name?.split(' ')[0]}</span>
                    <button
                      onClick={() => signOut()}
                      className="text-xs border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/auth/login" className="text-sm font-medium border border-slate-900 text-slate-900 px-5 py-2 hover:bg-slate-900 hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-6 pt-4 space-y-4">
          <Link href="/colleges" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-slate-800">
            Explore
          </Link>
          <Link href="/compare" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-slate-800">
            Compare ({compareCount})
          </Link>
          {session ? (
            <>
              <Link href="/saved" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-slate-800">
                Saved Colleges
              </Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left text-base font-medium text-slate-500 pt-4 border-t border-slate-100">
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block w-full text-center text-sm font-medium border border-slate-900 text-slate-900 px-4 py-3">
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
