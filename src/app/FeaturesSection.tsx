'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Users, Globe, Briefcase, Sparkles } from 'lucide-react';

const features = [
  { icon: BookOpen,  title: 'Academic Excellence',    desc: "Explore deeply verified data on course structures, faculty, and academic rigor across India's premier institutions." },
  { icon: Trophy,    title: 'Verified Placements',    desc: 'Make informed decisions with transparent, audited placement records, median salaries, and top recruiting metrics.' },
  { icon: Users,     title: 'Student Life',           desc: 'Discover the reality of campus life through unfiltered, structured reviews from active students and recent alumni.' },
  { icon: Globe,     title: 'Global Alumni Network',  desc: 'Connect with expansive networks of graduates leading top technology and business enterprises worldwide.' },
  { icon: Briefcase, title: 'Industry Integration',   desc: 'Experience real-world partnerships bridging the gap between theoretical learning and practical application.' },
  { icon: Sparkles,  title: 'Holistic Development',   desc: 'Evaluate extracurricular opportunities, tech clubs, and startup incubation centers available on campus.' },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#F5F5F5] py-24 border-t border-slate-200 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 px-6 lg:px-8 text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-slate-900">Why Choose CollegeQ</h2>
        <div className="h-1 w-12 bg-[#E81A2D] mx-auto mt-4"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
      >
        <div className="flex w-max animate-marquee gap-8 pr-8">
          {[...features, ...features].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="flex flex-col w-[350px] md:w-[400px] shrink-0 bg-white p-8 border border-slate-200 rounded-2xl hover:border-red-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-[#E81A2D] stroke-[2]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
