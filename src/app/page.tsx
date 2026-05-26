import Link from 'next/link';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Hero Section - Split Layout inspired by McGill */}
      <section className="relative w-full bg-white flex flex-col lg:flex-row items-stretch min-h-[85vh]">
        
        {/* Left Content Area */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 py-20 lg:py-0 z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.1] text-slate-900 tracking-tight text-balance">
              <span className="font-serif block font-medium mb-2">Find what</span>
              <span className="font-serif block font-medium mb-4">moves you.</span>
              <span className="font-sans font-bold tracking-tight">Start something</span>
              <span className="font-sans font-bold tracking-tight block">extraordinary.</span>
            </h1>
            
            <div className="mt-12">
              <Link 
                href="/colleges" 
                className="text-2xl md:text-3xl font-medium brand-link text-[#E81A2D]"
              >
                Find your institution
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-6">
              <Link 
                href="/compare" 
                className="text-base font-semibold text-slate-900 hover-underline-animation"
              >
                Compare metrics
              </Link>
              <Link 
                href="/auth/register" 
                className="text-base font-semibold text-slate-900 hover-underline-animation"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="w-full lg:w-[45%] relative min-h-[50vh] lg:min-h-full">
          <div className="absolute inset-0 lg:py-12 lg:pr-12">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
              alt="Classic University Architecture" 
              className="w-full h-full object-cover object-center lg:shadow-2xl"
            />
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
