'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCompareStore } from '@/store/useCompareStore';
import { GitCompareArrows, Bookmark, Menu, X, Compass, LogIn, LogOut, Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const colleges = useCompareStore((s) => s.colleges);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const compareCount = mounted ? colleges.length : 0;

  return (
    <>
      {/* Top Logo - Clean and minimal */}
      <header className="fixed top-0 left-0 w-full z-40 p-6 md:p-8 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="pointer-events-auto flex items-center gap-4 bg-white/70 backdrop-blur-2xl px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-[2px] md:border-[2.5px] border-[#0A1A3A] shrink-0 bg-white">
                <Landmark className="w-5 h-5 md:w-6 md:h-6 text-[#0A1A3A] stroke-[2.5]" />
                <div className="absolute -bottom-1 -right-0.5 text-[#E81A2D] drop-shadow-sm">
                   <svg width="12" height="16" viewBox="0 0 10 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-3 h-4 md:w-3.5 md:h-5">
                     <path d="M0 0H10V14L5 11L0 14V0Z" />
                   </svg>
                </div>
              </div>
              
              {/* Separator */}
              <div className="w-[1.5px] h-8 md:h-10 bg-slate-200" />
              
              {/* Text */}
              <span className="font-serif text-3xl md:text-4xl font-medium text-[#0A1A3A] tracking-tight leading-none mt-1">
                college<span className="text-[#E81A2D]">Q</span>
              </span>
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden pointer-events-auto p-4 bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full text-slate-800 hover:scale-105 transition-all"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Floating Apple-Glass Dock (Desktop) */}
      <nav className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/60 backdrop-blur-xl saturate-150 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full px-6 py-3 flex items-center gap-2 transition-all">
          
          <Link href="/colleges" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all">
            <Compass className="h-4 w-4" />
            Explore
          </Link>
          
          <Link href="/compare" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all">
            <GitCompareArrows className="h-4 w-4" />
            Compare
            {compareCount > 0 && (
              <span className="bg-[#E81A2D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 shadow-sm">
                {compareCount}
              </span>
            )}
          </Link>
          
          <div className="w-[1px] h-6 bg-slate-300/50 mx-2"></div>
          
          {session ? (
            <>
              <Link href="/saved" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all">
                <Bookmark className="h-4 w-4" />
                Saved
              </Link>
              
              <div className="flex items-center pl-2 ml-2 border-l border-slate-300/50 gap-1">
                <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                  {session.user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-[#E81A2D] hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 ml-2 px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8 pt-16">
          <Link href="/colleges" onClick={() => setMobileOpen(false)} className="text-2xl font-serif font-medium text-slate-900">
            Explore Institutions
          </Link>
          <Link href="/compare" onClick={() => setMobileOpen(false)} className="text-2xl font-serif font-medium text-slate-900 flex items-center gap-3">
            Compare 
            {compareCount > 0 && <span className="bg-[#E81A2D] text-white text-sm font-bold px-2 py-1 rounded-full">{compareCount}</span>}
          </Link>
          
          {session ? (
            <>
              <Link href="/saved" onClick={() => setMobileOpen(false)} className="text-2xl font-serif font-medium text-slate-900">
                Saved Colleges
              </Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-xl font-medium text-[#E81A2D] mt-8 border px-8 py-3 rounded-full border-[#E81A2D]">
                Sign Out ({session.user?.name?.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="mt-8 bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg">
              Sign In to Account
            </Link>
          )}
        </div>
      )}
    </>
  );
}
