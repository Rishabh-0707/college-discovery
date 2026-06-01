'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollegesResponse, CollegeFilters, CollegeType } from '@/types';
import CollegeCard from '@/components/CollegeCard';
import { useCompareStore } from '@/store/useCompareStore';
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, X,
  ArrowLeft, Filter, GitCompareArrows, ArrowRight,
  Building2, FlaskConical, Shield, Cpu, Landmark, Briefcase, GraduationCap,
  RefreshCw, RotateCcw,
} from 'lucide-react';
import { debounce } from '@/lib/utils';

/* ─── Icon map for sidebar types ─── */
const typeIcons: Record<string, React.ElementType> = {
  IIT:        FlaskConical,
  NIT:        Shield,
  IIIT:       Cpu,
  BITS:       GraduationCap,
  GOVERNMENT: Landmark,
  PRIVATE:    Briefcase,
  DEEMED:     Building2,
};

export function CollegesClient({ initialData }: { initialData: CollegesResponse }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { colleges: compareColleges, clearAll } = useCompareStore();
  const compareCount = mounted ? compareColleges.length : 0;

  const VALID_SORT_FIELDS: NonNullable<CollegeFilters['sortBy']>[] = ['rating', 'feesMin', 'feesMax', 'established', 'name'];
  const rawSort  = searchParams.get('sortBy');
  const rawOrder = searchParams.get('sortOrder');

  const [filters, setFilters] = useState<CollegeFilters>({
    search:    searchParams.get('search') || '',
    type:      searchParams.get('type')   || '',
    sortBy:    (VALID_SORT_FIELDS.includes(rawSort as any) ? rawSort : 'rating') as CollegeFilters['sortBy'],
    sortOrder: (rawOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    page:      parseInt(searchParams.get('page') || '1'),
  });

  const data = initialData;

  const updateUrl = useCallback((newFilters: CollegeFilters) => {
    const query = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
    startTransition(() => {
      router.push(`/colleges?${query.toString()}`, { scroll: false });
    });
  }, [router]);

  const debouncedUpdateUrl = useCallback(
    debounce((f: CollegeFilters) => updateUrl(f), 300),
    [updateUrl]
  );

  useEffect(() => {
    const raw = searchParams.get('sortBy');
    setFilters({
      search:    searchParams.get('search') || '',
      type:      searchParams.get('type')   || '',
      sortBy:    (VALID_SORT_FIELDS.includes(raw as any) ? raw : 'rating') as CollegeFilters['sortBy'],
      sortOrder: (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
      page:      parseInt(searchParams.get('page') || '1'),
    });
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value, page: 1 };
    setFilters(newFilters);
    debouncedUpdateUrl(newFilters);
  };

  const handleFilterChange = (key: keyof CollegeFilters, value: CollegeFilters[typeof key]) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleClearAll = () => {
    const reset: CollegeFilters = { search: '', type: '', sortBy: 'rating', sortOrder: 'desc', page: 1 };
    setFilters(reset);
    updateUrl(reset);
  };

  const collegeTypes = Object.values(CollegeType);
  const hasActiveFilters = !!(filters.search || filters.type);

  /* ─── Sidebar content (shared between desktop + mobile) ─── */
  const SidebarContent = () => (
    <div className="space-y-1">
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 mb-3">Institution Type</p>

      {/* All Types */}
      <button
        onClick={() => handleFilterChange('type', '')}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          filters.type === ''
            ? 'bg-[#E81A2D] text-white shadow-md shadow-red-500/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Filter className="h-4 w-4 shrink-0" />
        <span>All Types</span>
      </button>

      {collegeTypes.map((type) => {
        const Icon = typeIcons[type] ?? Building2;
        const isActive = filters.type === type;
        return (
          <button
            key={type}
            onClick={() => handleFilterChange('type', type)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[#E81A2D] text-white shadow-md shadow-red-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{type}</span>
          </button>
        );
      })}

      {/* Divider */}
      <div className="pt-4 mt-2 border-t border-slate-100">
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 mb-3">More Filters</p>
        {[
          { label: 'Fees Range' },
          { label: 'Location' },
          { label: 'Est. Year' },
          { label: 'Rating' },
          { label: 'Placement' },
          { label: 'Entrance Exam' },
        ].map(({ label }) => (
          <button
            key={label}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
          >
            <span>{label}</span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </button>
        ))}
      </div>

      {/* Clear All */}
      <div className="pt-4 mt-2">
        <button
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:text-[#E81A2D] hover:border-[#E81A2D] hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4" />
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        <div className="flex gap-8">

          {/* ═══════════════ SIDEBAR (Desktop) ═══════════════ */}
          <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-5 px-1">
                <Filter className="h-4 w-4 text-slate-400" />
                <h2 className="font-bold text-slate-900 text-base">Filters</h2>
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ═══════════════ MAIN CONTENT ═══════════════ */}
          <main className="flex-1 min-w-0">

            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#E81A2D] transition-colors mb-5 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* ─── Search + Sort bar ─── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search colleges by name, location, state..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E81A2D]/20 focus:border-[#E81A2D] shadow-sm transition-all"
                />
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-[#E81A2D] hover:bg-red-50 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  const nextFilters: CollegeFilters = {
                    ...filters,
                    sortBy:    sortBy    as CollegeFilters['sortBy'],
                    sortOrder: sortOrder as 'asc' | 'desc',
                    page: 1,
                  };
                  setFilters(nextFilters);
                  updateUrl(nextFilters);
                }}
                className="bg-white px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E81A2D]/20 focus:border-[#E81A2D] shadow-sm transition-all appearance-none cursor-pointer pr-10 min-w-[160px]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="feesMin-asc">Lowest Fees</option>
                <option value="feesMax-desc">Highest Fees</option>
                <option value="established-asc">Oldest</option>
                <option value="name-asc">A → Z</option>
              </select>
            </div>

            {/* ─── Results count ─── */}
            <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
              {data ? (
                <>
                  <span>
                    Showing <span className="font-bold text-slate-900">{data.colleges.length}</span> of{' '}
                    <span className="font-bold text-slate-900">{data.total}</span> colleges
                  </span>
                  {isPending && (
                    <span className="flex items-center gap-1 text-[#E81A2D] text-xs">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Updating...
                    </span>
                  )}
                  {filters.type && (
                    <span className="ml-1 inline-flex items-center gap-1.5 bg-red-50 text-[#E81A2D] px-2.5 py-1 rounded-full text-xs font-semibold border border-red-100">
                      {filters.type}
                      <button onClick={() => handleFilterChange('type', '')}><X className="h-3 w-3" /></button>
                    </span>
                  )}
                </>
              ) : (
                <span>Loading...</span>
              )}
            </div>

            {/* ─── Empty state ─── */}
            {data?.colleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-32 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                  <Search className="h-7 w-7 text-slate-300" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">No colleges found</h3>
                <p className="text-slate-400 text-sm mb-6">Try adjusting your search or clearing filters.</p>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 bg-[#E81A2D] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#c91525] transition-colors shadow-md shadow-red-500/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* ─── Card Grid ─── */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 transition-all duration-500 ${
                  isPending ? 'opacity-40 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                  {data?.colleges.map((college, idx) => (
                    <div key={college.id} className="animate-fade-in">
                      <CollegeCard college={college} priority={idx < 3} />
                    </div>
                  ))}
                </div>

                {/* ─── Pagination ─── */}
                {data && data.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <button
                      disabled={filters.page === 1 || isPending}
                      onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#E81A2D] hover:border-[#E81A2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handleFilterChange('page', p)}
                          className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            p === data.page
                              ? 'bg-[#E81A2D] text-white shadow-md shadow-red-500/20'
                              : 'bg-white border border-slate-200 text-slate-500 hover:border-[#E81A2D] hover:text-[#E81A2D]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={filters.page === data.totalPages || isPending}
                      onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#E81A2D] hover:border-[#E81A2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ═══════════════ MOBILE FILTER DRAWER ═══════════════ */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto h-full w-[300px] bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <h2 className="font-bold text-slate-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ COMPARE BOTTOM BAR ═══════════════ */}
      {mounted && compareCount > 0 && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl px-5 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GitCompareArrows className="h-4 w-4 text-[#E81A2D]" />
              <span className="font-semibold">{compareCount} selected</span>
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={clearAll}
              className="text-sm text-slate-400 hover:text-[#E81A2D] font-medium transition-colors"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className="flex items-center gap-2 bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#E81A2D] transition-colors shadow-md"
            >
              Compare Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
