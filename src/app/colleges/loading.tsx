export default function CollegesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-100 rounded"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-6">
          {/* Back button link skeleton */}
          <div className="h-4 w-28 bg-slate-200 rounded"></div>

          {/* Search/Sort Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 flex-1 bg-slate-200 rounded-lg"></div>
            <div className="h-12 w-44 bg-slate-200 rounded-lg"></div>
          </div>

          {/* Results count skeleton */}
          <div className="h-4 w-48 bg-slate-100 rounded"></div>

          {/* College Card Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 flex flex-col h-[400px] space-y-4">
                {/* Image area placeholder */}
                <div className="h-44 w-full bg-slate-200 rounded-lg"></div>
                
                {/* Content info placeholder */}
                <div className="flex-grow space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-6 w-10 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                </div>

                {/* Divider and stats placeholders */}
                <div className="border-t border-slate-100 pt-4 flex justify-between">
                  <div className="space-y-1">
                    <div className="h-3 w-12 bg-slate-100 rounded"></div>
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-3 w-8 bg-slate-100 rounded"></div>
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                  </div>
                </div>

                {/* Exams and Compare button placeholders */}
                <div className="pt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-slate-100 rounded"></div>
                    <div className="h-5 w-12 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
