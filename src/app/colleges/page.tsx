'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollegesResponse, CollegeFilters, CollegeType } from '@/types';
import CollegeCard from '@/components/CollegeCard';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { debounce } from '@/lib/utils';

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<CollegesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse filters from URL or use defaults
  const [filters, setFilters] = useState<CollegeFilters>({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    sortBy: (searchParams.get('sortBy') as any) || 'rating',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const fetchColleges = useCallback(async (currentFilters: CollegeFilters) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      
      const res = await fetch(`/api/colleges?${query.toString()}`);
      const json = await res.json();
      setData(json);
      
      // Update URL without full page reload
      router.push(`/colleges?${query.toString()}`, { scroll: false });
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Debounced fetch for search
  const debouncedFetch = useCallback(
    debounce((f: CollegeFilters) => fetchColleges(f), 300),
    [fetchColleges]
  );

  useEffect(() => {
    fetchColleges(filters);
  }, [filters.page, filters.sortBy, filters.sortOrder, filters.type]); // Search is handled by debouncedFetch

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value, page: 1 };
    setFilters(newFilters);
    debouncedFetch(newFilters);
  };

  const handleFilterChange = (key: keyof CollegeFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const collegeTypes = Object.values(CollegeType);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" /> Filters
            </h3>
            
            <div className="space-y-4">
              {/* Institution Type */}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Institution Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === ''}
                      onChange={() => handleFilterChange('type', '')}
                      className="text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-slate-700">All Types</span>
                  </label>
                  {collegeTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="type" 
                        checked={filters.type === type}
                        onChange={() => handleFilterChange('type', type)}
                        className="text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="text-sm text-slate-700">{type}</span>
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
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Institution Type */}
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Institution Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobile-type" 
                        checked={filters.type === ''}
                        onChange={() => handleFilterChange('type', '')}
                        className="text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="text-sm text-slate-700">All Types</span>
                    </label>
                    {collegeTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="mobile-type" 
                          checked={filters.type === type}
                          onChange={() => handleFilterChange('type', type)}
                          className="text-indigo-600 focus:ring-indigo-600"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
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
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search colleges by name, location, state..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center justify-center p-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters((prev) => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 }));
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="feesMin-asc">Lowest Fees</option>
                <option value="feesMax-desc">Highest Fees</option>
                <option value="established-asc">Oldest</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-slate-500">
            {data ? (
              <span>Showing {data.colleges.length} of {data.total} colleges</span>
            ) : (
              <span>Loading...</span>
            )}
          </div>

          {/* Grid */}
          {loading && !data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[360px] rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : data?.colleges.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No colleges found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
              <button 
                onClick={() => setFilters({ search: '', page: 1 })}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 px-4">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <button
                    disabled={filters.page === data.totalPages}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24">Loading...</div>}>
      <CollegesContent />
    </Suspense>
  );
}
