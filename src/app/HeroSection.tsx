'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
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

          {/* Right Image Area */}
          <div className="w-full lg:w-[50%] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-full aspect-[4/5] lg:aspect-square max-w-lg mx-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                alt="Classic University Architecture"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-t-[140px] rounded-b-2xl shadow-2xl"
              />
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
  );
}
