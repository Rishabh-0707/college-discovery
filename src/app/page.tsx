'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Users, Globe, Briefcase, Sparkles } from 'lucide-react';

const features = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Explore deeply verified data on course structures, faculty, and academic rigor across India's premier institutions." },
  { icon: Trophy, title: "Verified Placements", desc: "Make informed decisions with transparent, audited placement records, median salaries, and top recruiting metrics." },
  { icon: Users, title: "Student Life", desc: "Discover the reality of campus life through unfiltered, structured reviews from active students and recent alumni." },
  { icon: Globe, title: "Global Alumni Network", desc: "Connect with expansive networks of graduates leading top technology and business enterprises worldwide." },
  { icon: Briefcase, title: "Industry Integration", desc: "Experience real-world partnerships bridging the gap between theoretical learning and practical application." },
  { icon: Sparkles, title: "Holistic Development", desc: "Evaluate extracurricular opportunities, tech clubs, and startup incubation centers available on campus." }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Hero Section - Unique Academic Layout */}
      <section className="relative w-full bg-[#FAFAFA] overflow-hidden pt-12 lg:pt-20 pb-20">
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content Area */}
            <motion.div 
              className="w-full lg:w-[50%] z-10"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-8">
                <span className="h-2 w-2 rounded-full bg-[#E81A2D] animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">The New Standard</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-slate-900 tracking-tight text-balance mb-6">
                <span className="font-sans font-bold block mb-1">Elevate your</span>
                <span className="font-serif italic text-[#E81A2D] block mb-2">academic journey.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Experience a premium curation of India's finest engineering institutions. Uncover verified placements, authentic student reviews, and powerful data-driven insights.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex items-center gap-6">
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
              </motion.div>
            </motion.div>

            {/* Right Image Area with Modern Arch Design */}
            <div className="w-full lg:w-[50%] relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="relative w-full aspect-[4/5] lg:aspect-square max-w-lg mx-auto"
              >
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Classic University Architecture" 
                  className="w-full h-full object-cover rounded-t-[140px] rounded-b-2xl shadow-2xl"
                />
                
                {/* Floating Stat Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                  className="absolute -bottom-8 -left-8 bg-white p-6 shadow-xl border border-slate-100 rounded-xl hidden md:block"
                >
                  <p className="text-3xl font-serif font-bold text-slate-900">500+</p>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Verified Institutions</p>
                </motion.div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Auto-scrolling Marquee Features Section */}
      <section className="bg-[#F5F5F5] py-24 border-t border-slate-200 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 px-6 lg:px-8 text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-slate-900">Why Choose CollegeQ</h2>
          <div className="h-1 w-12 bg-[#E81A2D] mx-auto mt-4"></div>
        </motion.div>

        {/* Marquee Wrapper */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <div className="flex w-max animate-marquee gap-8 pr-8">
            {/* Map features twice to create the infinite scroll effect seamlessly */}
            {[...features, ...features].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex flex-col w-[350px] md:w-[400px] shrink-0 bg-white p-8 border border-slate-200 rounded-2xl hover:border-red-200 hover:shadow-xl transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-[#E81A2D] stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
      
      {/* Spacer for bottom dock */}
      <div className="h-24 bg-[#F5F5F5]"></div>
    </div>
  );
}
