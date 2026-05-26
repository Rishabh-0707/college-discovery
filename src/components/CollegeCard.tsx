'use client';

import Link from 'next/link';
import { CollegeListItem } from '@/types';
import { useCompareStore } from '@/store/useCompareStore';
import { formatFees } from '@/lib/utils';
import { Star, MapPin, GitCompareArrows, Check, Building2 } from 'lucide-react';

interface CollegeCardProps {
  college: CollegeListItem;
}

const typeColors: Record<string, string> = {
  IIT: 'bg-[#E81A2D] text-white',
  NIT: 'bg-slate-800 text-white',
  IIIT: 'bg-slate-700 text-white',
  BITS: 'bg-indigo-900 text-white',
  GOVERNMENT: 'bg-slate-100 text-slate-700',
  PRIVATE: 'bg-slate-50 text-slate-600 border border-slate-200',
  DEEMED: 'bg-slate-50 text-slate-600 border border-slate-200',
};

export default function CollegeCard({ college }: CollegeCardProps) {
  const { addCollege, removeCollege, isInCompare, colleges } = useCompareStore();
  const inCompare = isInCompare(college.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeCollege(college.id);
    } else {
      addCollege(college);
    }
  };

  return (
    <Link href={`/colleges/${college.slug}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-white border border-slate-200 transition-all hover:shadow-xl hover:border-slate-300">
        
        {/* Image / Header Area */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {college.imageUrl ? (
            <img
              src={college.imageUrl}
              alt={college.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-slate-300" />
            </div>
          )}

          {/* Type Badge */}
          <span className={`absolute top-0 left-0 inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase ${typeColors[college.type] || typeColors.PRIVATE}`}>
            {college.type}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug group-hover:text-[#E81A2D] transition-colors line-clamp-2">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 border border-slate-100 shrink-0">
              <Star className="h-3.5 w-3.5 fill-[#E81A2D] text-[#E81A2D]" />
              <span className="text-sm font-bold text-slate-900">{college.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Fees Range</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatFees(college.feesMin)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Est.</p>
              <p className="text-sm font-semibold text-slate-900">{college.established}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {college.examAccepted.slice(0, 2).map((exam) => (
                <span key={exam} className="inline-block bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 border border-slate-100">
                  {exam}
                </span>
              ))}
            </div>

            {/* Compare Button */}
            <button
              onClick={handleCompareToggle}
              disabled={!inCompare && colleges.length >= 3}
              className={`flex items-center justify-center h-8 w-8 transition-colors ${
                inCompare
                  ? 'bg-[#E81A2D] text-white'
                  : colleges.length >= 3
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Compare'}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
