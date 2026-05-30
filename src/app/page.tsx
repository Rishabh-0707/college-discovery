// Server Component — no 'use client' needed here.
// Animated sections are isolated into their own client components:
//   HeroSection.tsx → framer-motion hero
//   FeaturesSection.tsx → framer-motion marquee
// This way the routing shell stays as an RSC.

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';

export const metadata = {
  title: 'CollegeQ | Academic Excellence',
  description: "Elevate your academic journey and discover India's extraordinary engineering institutions.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <HeroSection />
      <FeaturesSection />
      {/* Spacer for bottom dock */}
      <div className="h-24 bg-[#F5F5F5]"></div>
    </div>
  );
}
