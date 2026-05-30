export default function CollegeDetailLoading() {
  return (
    <div className="pb-16 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-[300px] w-full bg-slate-200"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tabs skeleton */}
        <div className="border-b border-slate-200 mb-8 flex gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-slate-200 rounded mb-4"></div>
          ))}
        </div>

        {/* Content & Sidebar grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-100 rounded-2xl p-6 md:p-8">
              <div className="h-8 w-1/3 bg-slate-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 bg-slate-100 rounded-2xl p-6">
              <div className="h-6 w-1/2 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
