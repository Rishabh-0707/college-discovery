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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Colleges</h1>
          <p className="text-slate-500 mt-1">Colleges you've bookmarked for later.</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
          <Bookmark className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No saved colleges yet</h3>
          <p className="text-slate-500 mt-1">Start exploring and save colleges you are interested in.</p>
          <Link 
            href="/colleges"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Explore Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => (
            <CollegeCard key={item.collegeId} college={item.college} />
          ))}
        </div>
      )}
    </div>
  );
}
