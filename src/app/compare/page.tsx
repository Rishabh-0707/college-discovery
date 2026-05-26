'use client';

import { useEffect, useState } from 'react';
import { useCompareStore } from '@/store/useCompareStore';
import { CollegeDetail } from '@/types';
import { formatFees, formatPackage } from '@/lib/utils';
import { X, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { colleges: storeColleges, removeCollege, clearAll } = useCompareStore();
  const [data, setData] = useState<CollegeDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (storeColleges.length < 2) {
        setLoading(false);
        return;
      }
      
      try {
        const ids = storeColleges.map(c => c.id);
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
  }, [storeColleges]);

  if (storeColleges.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="bg-indigo-50 text-indigo-600 rounded-2xl p-8 border border-indigo-100 mb-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Not Enough Colleges</h2>
          <p className="text-indigo-800/70 mb-6">You need to select at least 2 colleges to compare them.</p>
          <div className="flex justify-center gap-4">
            {storeColleges.length === 1 && (
              <div className="bg-white px-4 py-2 rounded-lg border border-indigo-200 shadow-sm text-sm font-medium">
                1 Selected: {storeColleges[0].name}
              </div>
            )}
          </div>
        </div>
        <Link 
          href="/colleges" 
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" /> Add More Colleges
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-24">Loading comparison data...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compare Colleges</h1>
          <p className="text-slate-500 mt-1">Side-by-side comparison of your selected institutions.</p>
        </div>
        <button 
          onClick={clearAll}
          className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
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
                  <div className="bg-white rounded-xl border border-slate-200 p-4 relative shadow-sm h-full">
                    <button 
                      onClick={() => removeCollege(college.id)}
                      className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="h-12 flex items-center mb-4">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">{college.name}</h3>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 mb-2">
                      {college.type}
                    </span>
                    <Link 
                      href={`/colleges/${college.slug}`}
                      className="mt-2 text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </th>
              ))}
              {data.length < 3 && (
                <th className="w-1/3 p-4 align-top">
                  <Link href="/colleges" className="flex flex-col items-center justify-center h-full min-h-[160px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="font-medium text-sm">Add College</span>
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
                    <span className="font-bold text-indigo-600">{formatPackage(college.placements[0].highestPackage)}</span>
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
