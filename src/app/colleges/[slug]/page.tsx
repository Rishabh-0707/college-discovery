'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CollegeDetail } from '@/types';
import { formatFees, formatPackage } from '@/lib/utils';
import { Star, MapPin, Building2, Globe, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function CollegeDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${params.slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setCollege(data);
        setIsSaved(data._isSaved || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [params.slug]);

  const handleSaveToggle = async () => {
    if (!session) return alert('Please sign in to save colleges');
    if (!college) return;

    try {
      setIsSaved(!isSaved); // Optimistic
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: college.id }),
      });
    } catch (e) {
      setIsSaved(!isSaved); // Revert on error
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
      <div className="h-64 bg-slate-200 rounded-2xl mb-8"></div>
      <div className="h-8 w-1/3 bg-slate-200 rounded mb-4"></div>
      <div className="h-32 bg-slate-200 rounded"></div>
    </div>;
  }

  if (!college) return <div className="text-center py-24 text-lg">College not found</div>;

  return (
    <div className="pb-16">
      {/* Header Banner */}
      <div className="relative h-[300px] w-full bg-slate-900">
        {college.imageUrl ? (
          <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                    {college.type}
                  </span>
                  {college.accreditation && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-500/30 backdrop-blur-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {college.accreditation}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{college.name}</h1>
                <div className="flex items-center gap-4 text-slate-300 text-sm md:text-base">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {college.location}, {college.state}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Est. {college.established}</span>
                  {college.website && (
                    <a href={college.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-2xl">
                    <Star className="h-6 w-6 fill-current" /> {college.rating}
                  </div>
                  <span className="text-white/80 text-xs">{college.totalReviews} Reviews</span>
                </div>
                
                <button
                  onClick={handleSaveToggle}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl backdrop-blur-md transition-all ${
                    isSaved 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                  title={isSaved ? "Saved" : "Save College"}
                >
                  {isSaved ? <BookmarkCheck className="h-6 w-6" /> : <Bookmark className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'courses', 'placements', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'overview' && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About the College</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  {college.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Exams Accepted</h3>
                <div className="flex flex-wrap gap-2">
                  {college.examAccepted.map((exam) => (
                    <span key={exam} className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {exam}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'courses' && (
              <section className="space-y-4 animate-fade-in">
                {college.courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{course.name}</h3>
                        <p className="text-slate-500 font-medium mt-1">{course.degree} • {course.duration} Years</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-indigo-600">{formatFees(course.feesPerYear)}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Per Year</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                      <div><span className="font-semibold text-slate-900">{course.totalSeats}</span> Seats</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'placements' && (
              <section className="space-y-6 animate-fade-in">
                {college.placements.map((placement) => (
                  <div key={placement.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">Placement Statistics ({placement.year})</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-emerald-800 text-sm font-medium mb-1">Highest Package</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatPackage(placement.highestPackage)}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <p className="text-indigo-800 text-sm font-medium mb-1">Average Package</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatPackage(placement.avgPackage)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <p className="text-purple-800 text-sm font-medium mb-1">Median Package</p>
                        <p className="text-2xl font-bold text-purple-600">{formatPackage(placement.medianPackage)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-blue-800 text-sm font-medium mb-1">Placement Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{placement.placementRate}%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Top Recruiting Companies</h4>
                      <div className="flex flex-wrap gap-2">
                        {placement.topCompanies.map((company) => (
                          <span key={company} className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'reviews' && (
              <section className="space-y-6 animate-fade-in">
                {college.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {review.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{review.user.name}</p>
                          <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold text-sm">
                        <Star className="h-4 w-4 fill-current" /> {review.rating}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{review.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{review.content}</p>
                    <span className="inline-block text-xs font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {review.category}
                    </span>
                  </div>
                ))}
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b">Quick Snapshot</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Institution Type</span>
                  <span className="font-medium text-slate-900">{college.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Fees Range</span>
                  <span className="font-medium text-slate-900">{formatFees(college.feesMin)} - {formatFees(college.feesMax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Avg. Package</span>
                  <span className="font-medium text-slate-900 text-emerald-600">
                    {college.placements[0] ? formatPackage(college.placements[0].avgPackage) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Highest Package</span>
                  <span className="font-medium text-slate-900 text-indigo-600">
                    {college.placements[0] ? formatPackage(college.placements[0].highestPackage) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
