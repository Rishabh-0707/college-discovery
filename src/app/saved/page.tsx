import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import { Bookmark, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CollegeListItem } from '@/types';

export const metadata = {
  title: 'My Saved Collections | College Discovery',
  description: 'View your curated list of prospect universities and colleges.',
};

export default async function SavedCollegesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: {
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          state: true,
          type: true,
          feesMin: true,
          feesMax: true,
          rating: true,
          totalReviews: true,
          established: true,
          imageUrl: true,
          accreditation: true,
          examAccepted: true,
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-36 lg:pt-40 pb-32 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/colleges"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#E81A2D] transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Colleges
      </Link>
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
            <div key={item.collegeId}>
              <CollegeCard college={item.college as CollegeListItem} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
