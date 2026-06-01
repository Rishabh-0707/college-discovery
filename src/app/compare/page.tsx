'use client';

import { useEffect, useState } from 'react';
import { useCompareStore } from '@/store/useCompareStore';
import { CollegeDetail } from '@/types';
import { formatFees, formatPackage } from '@/lib/utils';
import { X, Plus, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComparePage() {
  const router = useRouter();
  const { colleges: storeColleges, removeCollege, clearAll } = useCompareStore();
  const [data, setData] = useState<CollegeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedColleges = mounted ? storeColleges : [];

  useEffect(() => {
    const fetchCompareData = async () => {
      if (displayedColleges.length < 2) {
        setLoading(false);
        return;
      }
      
      try {
        const ids = displayedColleges.map(c => c.id);
        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeIds: ids })
        });
        const json = await res.json();
        setData(json.colleges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompareData();
  }, [displayedColleges]);

  if (displayedColleges.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <div className="bg-[#FAFAFA] text-slate-800 p-12 border border-slate-200 mb-8 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-slate-300 mb-6" />
          <h2 className="font-serif text-3xl font-medium mb-3">Not Enough Colleges</h2>
          <p className="text-slate-500 mb-8 text-lg">You need to select at least 2 colleges to compare them.</p>
          <div className="flex justify-center gap-4">
            {displayedColleges.length === 1 && (
              <div className="bg-white px-5 py-2.5 border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
                1 Selected: {displayedColleges[0].name}
              </div>
            )}
          </div>
        </div>
        <Link 
          href="/colleges" 
          className="inline-flex items-center gap-2 bg-[#E81A2D] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#c91525] transition-colors shadow-lg shadow-red-500/20"
        >
          <Plus className="h-5 w-5" /> Add More Colleges
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-32 font-serif text-2xl text-slate-500">Loading comparison data...</div>;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#E81A2D] transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-serif text-4xl font-medium text-slate-900">Compare Colleges</h1>
          <p className="text-slate-500 mt-2 text-lg">Side-by-side comparison of your selected institutions.</p>
        </div>
        <button 
          onClick={clearAll}
          className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline tracking-wide"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="w-48 p-4 align-top"></th>
              {data.map((college) => (
                <th key={college.id} className="w-1/3 p-4 align-top">
                  <div className="bg-white border border-slate-200 p-6 relative h-full hover:shadow-xl transition-shadow">
                    <button 
                      onClick={() => removeCollege(college.id)}
                      className="absolute -top-3 -right-3 bg-white text-slate-400 hover:text-red-500 rounded-full p-1.5 border border-slate-200 shadow-sm hover:border-red-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="h-16 flex flex-col justify-end mb-4">
                      <h3 className="font-serif font-bold text-xl text-slate-900 leading-tight line-clamp-2">{college.name}</h3>
                    </div>
                    <span className="inline-block px-2.5 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-4">
                      {college.type}
                    </span>
                    <Link 
                      href={`/colleges/${college.slug}`}
                      className="block mt-2 text-[#E81A2D] text-sm font-semibold flex items-center gap-1.5 hover:underline"
                    >
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </th>
              ))}
              {data.length < 3 && (
                <th className="w-1/3 p-4 align-top">
                  <Link href="/colleges" className="flex flex-col items-center justify-center h-full min-h-[220px] border-2 border-dashed border-slate-200 bg-[#FAFAFA] text-slate-400 hover:text-[#E81A2D] hover:border-[#E81A2D] hover:bg-red-50/50 transition-colors">
                    <Plus className="h-8 w-8 mb-3" />
                    <span className="font-bold text-sm uppercase tracking-widest">Add College</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* General Info */}
            <tr className="bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Location</td>
              {data.map((college) => (
                <td key={college.id} className="p-4 text-slate-700">{college.location}, {college.state}</td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Rating</td>
              {data.map((college) => (
                <td key={college.id} className="p-4">
                  <span className="font-bold text-slate-900">{college.rating}</span>
                  <span className="text-sm text-slate-500 ml-1">({college.totalReviews})</span>
                </td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
            
            {/* Fees & Placements */}
            <tr className="bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Fees Range</td>
              {data.map((college) => (
                <td key={college.id} className="p-4 text-slate-700">
                  {formatFees(college.feesMin)} - {formatFees(college.feesMax)}
                </td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Avg Package</td>
              {data.map((college) => (
                <td key={college.id} className="p-4">
                  {college.placements[0] ? (
                    <span className="font-bold text-emerald-600">{formatPackage(college.placements[0].avgPackage)}</span>
                  ) : <span className="text-slate-400">N/A</span>}
                </td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Highest Package</td>
              {data.map((college) => (
                <td key={college.id} className="p-4">
                  {college.placements[0] ? (
                    <span className="font-bold text-[#E81A2D]">{formatPackage(college.placements[0].highestPackage)}</span>
                  ) : <span className="text-slate-400">N/A</span>}
                </td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
            
            {/* Exams */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Exams Accepted</td>
              {data.map((college) => (
                <td key={college.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {college.examAccepted.map(exam => (
                      <span key={exam} className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600">
                        {exam}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
              {data.length < 3 && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
