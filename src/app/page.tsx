import Link from 'next/link';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Hero Section - Unique Academic Layout */}
      <section className="relative w-full bg-[#FAFAFA] overflow-hidden pt-12 lg:pt-20 pb-20">
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content Area */}
            <div className="w-full lg:w-[50%] z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-8">
                <span className="h-2 w-2 rounded-full bg-[#E81A2D] animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">The New Standard</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-slate-900 tracking-tight text-balance mb-6">
                <span className="font-sans font-bold block mb-1">Elevate your</span>
                <span className="font-serif italic text-[#E81A2D] block mb-2">academic journey.</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Experience a premium curation of India's finest engineering institutions. Uncover verified placements, authentic student reviews, and powerful data-driven insights.
              </p>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/colleges" 
                  className="bg-[#E81A2D] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#c91525] transition-colors shadow-lg shadow-red-500/20"
                >
                  Explore Institutions
                </Link>
                <Link 
                  href="/compare" 
                  className="text-sm font-bold uppercase tracking-widest text-slate-800 hover-underline-animation"
                >
                  Compare Metrics
                </Link>
              </div>
            </div>

            {/* Right Image Area with Modern Arch Design */}
            <div className="w-full lg:w-[50%] relative">
              <div className="relative w-full aspect-[4/5] lg:aspect-square max-w-lg mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Classic University Architecture" 
                  className="w-full h-full object-cover rounded-t-[140px] rounded-b-2xl shadow-2xl"
                />
                
                {/* Floating Stat Card */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-xl border border-slate-100 rounded-xl hidden md:block">
                  <p className="text-3xl font-serif font-bold text-slate-900">500+</p>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Verified Institutions</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Gray Band Section */}
      <section className="bg-[#F5F5F5] py-24 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            <div className="flex flex-col">
              <BookOpen className="h-10 w-10 text-[#E81A2D] mb-6 stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-medium text-slate-900 mb-4">Academic Excellence</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                Explore deeply verified data on course structures, faculty, and academic rigor across India's premier institutions.
              </p>
            </div>

            <div className="flex flex-col">
              <Trophy className="h-10 w-10 text-[#E81A2D] mb-6 stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-medium text-slate-900 mb-4">Verified Placements</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                Make informed decisions with transparent, audited placement records, median salaries, and top recruiting metrics.
              </p>
            </div>

            <div className="flex flex-col">
              <Users className="h-10 w-10 text-[#E81A2D] mb-6 stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-medium text-slate-900 mb-4">Student Life</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                Discover the reality of campus life through unfiltered, structured reviews from active students and recent alumni.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
