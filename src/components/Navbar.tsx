'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCompareStore } from '@/store/useCompareStore';
import { GitCompareArrows, Bookmark, Menu, X, Compass, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const compareCount = useCompareStore((s) => s.colleges.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Logo - Clean and minimal */}
      <header className="fixed top-0 left-0 w-full z-40 p-6 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="pointer-events-auto flex items-center bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm">
            <span className="font-serif text-2xl font-bold text-slate-900 tracking-wide">
              College<span className="text-[#E81A2D]">Q</span>
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden pointer-events-auto p-3 bg-white/70 backdrop-blur-xl border border-white shadow-lg rounded-full text-slate-800"
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
