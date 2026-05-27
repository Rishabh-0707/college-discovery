'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SavedCollegeResponse } from '@/types';
import CollegeCard from '@/components/CollegeCard';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SavedCollegesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState<SavedCollegeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/saved')
        .then(res => res.json())
        .then(data => {
          setSaved(data);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-[#E81A2D]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-32 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Bookmark className="h-7 w-7 text-[#E81A2D] stroke-[2]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-4">Saved Collections</h1>
        <p className="text-slate-500 text-lg">Your curated list of prospective institutions.</p>
        <div className="h-1 w-12 bg-[#E81A2D] mx-auto mt-8"></div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-24 bg-[#FAFAFA] border border-slate-200 border-dashed animate-fade-in">
          <Bookmark className="mx-auto h-12 w-12 text-slate-300 mb-6 stroke-[1.5]" />
          <h3 className="font-serif text-2xl font-medium text-slate-900">No saved colleges yet</h3>
          <p className="text-slate-500 mt-2 mb-8">Start exploring and save colleges you are interested in building your future with.</p>
          <Link 
            href="/colleges"
            className="inline-block bg-[#E81A2D] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#c91525] transition-colors shadow-lg shadow-red-500/20"
          >
            Explore Institutions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {saved.map((item) => (
            <CollegeCard key={item.collegeId} college={item.college} />
          ))}
        </div>
      )}
    </div>
  );
}
