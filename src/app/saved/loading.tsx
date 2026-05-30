export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-32 sm:px-6 lg:px-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-28 bg-slate-200 rounded mb-8"></div>
      
      {/* Title skeleton */}
      <div className="flex flex-col items-center mb-16 space-y-4">
        <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
        <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-80 bg-slate-100 rounded"></div>
      </div>

      {/* Grid of cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 flex flex-col h-[400px] space-y-4">
            <div className="h-44 w-full bg-slate-200 rounded-lg"></div>
            <div className="flex-grow space-y-3">
              <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
            </div>
            <div className="h-8 w-8 bg-slate-200 rounded-lg self-end"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
