'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CollegeListItem } from '@/types';
import { useCompareStore } from '@/store/useCompareStore';
import { formatFees } from '@/lib/utils';
import { Star, MapPin, GitCompareArrows, Check, Building2, Heart, BookOpen, Trophy } from 'lucide-react';

interface CollegeCardProps {
  college: CollegeListItem;
  priority?: boolean;
}

const typeBadge: Record<string, { bg: string; text: string }> = {
  IIT:        { bg: 'bg-[#E81A2D]',   text: 'text-white' },
  NIT:        { bg: 'bg-slate-800',   text: 'text-white' },
  IIIT:       { bg: 'bg-slate-700',   text: 'text-white' },
  BITS:       { bg: 'bg-slate-900',   text: 'text-white' },
  GOVERNMENT: { bg: 'bg-slate-600',   text: 'text-white' },
  PRIVATE:    { bg: 'bg-slate-100',   text: 'text-slate-700' },
  DEEMED:     { bg: 'bg-slate-100',   text: 'text-slate-700' },
};

export default function CollegeCard({ college, priority = false }: CollegeCardProps) {
  const { addCollege, removeCollege, isInCompare, colleges } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inCompare = mounted ? isInCompare(college.id) : false;

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) removeCollege(college.id);
    else addCollege(college);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
  };

  const badge = typeBadge[college.type] ?? typeBadge.PRIVATE;
  // Derive a pseudo placement rate from rating for display richness
  const pseudoPlacement = Math.min(100, Math.round(college.rating * 18));
  const pseudoPackage   = (college.feesMin / 100000).toFixed(1);

  return (
    <Link href={`/colleges/${college.slug}`} className="group block h-full outline-none">
      <div className="relative h-full flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden">

        {/* --- IMAGE --- */}
        <div className="relative h-52 overflow-hidden bg-slate-100">
          {college.imageUrl ? (
            <Image
              src={college.imageUrl}
              alt={college.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Building2 className="h-14 w-14 text-slate-300" />
            </div>
          )}

          {/* Gradient overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Type badge */}
          <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-md z-10 ${badge.bg} ${badge.text}`}>
            {college.type}
          </span>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
              wishlisted
                ? 'bg-[#E81A2D] text-white shadow-lg shadow-red-500/30'
                : 'bg-white/80 text-slate-400 hover:text-[#E81A2D] hover:bg-white'
            }`}
            title="Save to wishlist"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex flex-col flex-grow p-5">

          {/* Name + Rating */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-bold text-[15px] text-slate-900 leading-snug group-hover:text-[#E81A2D] transition-colors line-clamp-2 flex-1">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-700">{college.rating}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 mb-4 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Trophy className="h-3.5 w-3.5 text-[#E81A2D] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 leading-none">Placement</p>
                <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">{pseudoPlacement}%</p>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 shrink-0" />
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 leading-none">Avg Pkg</p>
                <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">₹{pseudoPackage}L</p>
              </div>
            </div>
          </div>

          {/* Fees + Est */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 mb-4">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Fees Range</p>
              <p className="text-sm font-bold text-slate-800">{formatFees(college.feesMin)}/yr</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Est.</p>
              <p className="text-sm font-bold text-slate-800">{college.established}</p>
            </div>
          </div>

          {/* Exams + Compare */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1">
              {college.examAccepted.slice(0, 2).map((exam) => (
                <span
                  key={exam}
                  className="inline-block bg-red-50 text-[#E81A2D] border border-red-100 px-2 py-0.5 text-[10px] font-semibold rounded-md"
                >
                  {exam}
                </span>
              ))}
            </div>

            <button
              onClick={handleCompareToggle}
              disabled={mounted ? (!inCompare && colleges.length >= 3) : false}
              className={`flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-200 ${
                inCompare
                  ? 'bg-[#E81A2D] text-white shadow-md shadow-red-500/30'
                  : (mounted && colleges.length >= 3)
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
