'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollegesResponse, CollegeFilters, CollegeType } from '@/types';
import CollegeCard from '@/components/CollegeCard';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { debounce } from '@/lib/utils';

export function CollegesClient({ initialData }: { initialData: CollegesResponse }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Local filters state synced with URL queries for immediate input feedback
  const [filters, setFilters] = useState<CollegeFilters>({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    sortBy: (searchParams.get('sortBy') as any) || 'rating',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const data = initialData;

  // Unified router pushing logic wrapped inside Next.js concurrent transition
  const updateUrl = useCallback((newFilters: CollegeFilters) => {
    const query = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
    
    startTransition(() => {
      router.push(`/colleges?${query.toString()}`, { scroll: false });
    });
  }, [router]);

  // Debounced URL updates for search input to prevent firing rapid queries
  const debouncedUpdateUrl = useCallback(
    debounce((f: CollegeFilters) => updateUrl(f), 300),
    [updateUrl]
  );

  // Sync local filters with URL query parameters (e.g., when browser Back button is clicked)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
      sortBy: (searchParams.get('sortBy') as any) || 'rating',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
    });
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value, page: 1 };
    setFilters(newFilters);
    debouncedUpdateUrl(newFilters);
  };

  const handleFilterChange = (key: keyof CollegeFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const collegeTypes = Object.values(CollegeType);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div className="sticky top-32">
            <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            
            <div className="space-y-4">
              {/* Institution Type */}
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 block">Institution Type</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === ''}
                      onChange={() => handleFilterChange('type', '')}
                      className="text-[#E81A2D] focus:ring-[#E81A2D] h-4 w-4"
                    />
                    <span className="text-sm font-medium text-slate-700">All Types</span>
                  </label>
                  {collegeTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="type" 
                        checked={filters.type === type}
                        onChange={() => handleFilterChange('type', type)}
                        className="text-[#E81A2D] focus:ring-[#E81A2D] h-4 w-4"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="relative ml-auto h-full w-full max-w-xs bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-none">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Institution Type */}
                <div>
                  <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 block">Institution Type</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobile-type" 
                        checked={filters.type === ''}
                        onChange={() => handleFilterChange('type', '')}
                        className="text-[#E81A2D] focus:ring-[#E81A2D] h-4 w-4"
                      />
                      <span className="text-sm font-medium text-slate-700">All Types</span>
                    </label>
                    {collegeTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="mobile-type" 
                          checked={filters.type === type}
                          onChange={() => handleFilterChange('type', type)}
                          className="text-[#E81A2D] focus:ring-[#E81A2D] h-4 w-4"
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#E81A2D] transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search colleges by name, location, state..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] transition-shadow shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center justify-center p-3 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  // Ensure sortOrder is set appropriately in the dynamic update
                  const nextFilters = { ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 };
                  setFilters(nextFilters);
                  updateUrl(nextFilters);
                }}
                className="px-4 py-3 rounded-none border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D] shadow-sm"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="feesMin-asc">Lowest Fees</option>
                <option value="feesMax-desc">Highest Fees</option>
                <option value="established-asc">Oldest</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
            {data ? (
              <span className="flex items-center gap-2">
                Showing {data.colleges.length} of {data.total} colleges
                {isPending && <span className="text-xs text-slate-400 lowercase italic animate-pulse">(updating...)</span>}
              </span>
            ) : (
              <span>Loading...</span>
            )}
          </div>

          {/* Grid */}
          {data?.colleges.length === 0 ? (
            <div className="text-center py-32 bg-[#FAFAFA] border border-slate-200 border-dashed">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-6" />
              <h3 className="font-serif text-2xl font-bold text-slate-900">No colleges found</h3>
              <p className="text-slate-500 mt-2 text-lg">Try adjusting your search or filters.</p>
              <button 
                onClick={() => handleFilterChange('search', '')}
                className="mt-6 text-[#E81A2D] font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-500 ${isPending ? 'opacity-40 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
                {data?.colleges.map((college) => (
                  <div key={college.id} className="animate-fade-in">
                    <CollegeCard college={college} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    disabled={filters.page === 1 || isPending}
                    onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                    className="p-3 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:text-[#E81A2D] hover:border-slate-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-bold text-slate-700 px-6 uppercase tracking-widest">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <button
                    disabled={filters.page === data.totalPages || isPending}
                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                    className="p-3 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:text-[#E81A2D] hover:border-slate-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
