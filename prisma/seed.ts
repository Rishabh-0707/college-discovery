import { PrismaClient, CollegeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    location: 'Mumbai',
    state: 'Maharashtra',
    type: CollegeType.IIT,
    feesMin: 100000,
    feesMax: 220000,
    rating: 4.8,
    totalReviews: 1240,
    established: 1958,
    description: 'IIT Bombay is one of the premier engineering institutions in India, known for world-class research, diverse programs, and an exceptional placement record. Located in the heart of Mumbai, it offers a vibrant campus life and strong industry connections.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    accreditation: 'NAAC A++',
    website: 'https://www.iitb.ac.in',
    examAccepted: ['JEE Advanced'],
    rankMin: 1,
    rankMax: 500,
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    location: 'New Delhi',
    state: 'Delhi',
    type: CollegeType.IIT,
    feesMin: 100000,
    feesMax: 210000,
    rating: 4.7,
    totalReviews: 1180,
    established: 1961,
    description: 'IIT Delhi is a prestigious institution offering undergraduate, postgraduate, and doctoral programs in engineering and technology. Located in the capital city, it has excellent research facilities and strong alumni networks across the globe.',
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    accreditation: 'NAAC A++',
    website: 'https://home.iitd.ac.in',
    examAccepted: ['JEE Advanced'],
    rankMin: 1,
    rankMax: 600,
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    location: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: CollegeType.NIT,
    feesMin: 65000,
    feesMax: 150000,
    rating: 4.5,
    totalReviews: 890,
    established: 1964,
    description: 'NIT Trichy is consistently ranked among the top NITs in India. Known for its strong engineering programs, excellent placement records, and vibrant student community. The campus provides excellent infrastructure and a conducive learning environment.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    accreditation: 'NAAC A++',
    website: 'https://www.nitt.edu',
    examAccepted: ['JEE Main'],
    rankMin: 500,
    rankMax: 8000,
  },
  {
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    location: 'Pilani',
    state: 'Rajasthan',
    type: CollegeType.BITS,
    feesMin: 380000,
    feesMax: 520000,
    rating: 4.6,
    totalReviews: 1050,
    established: 1964,
    description: 'BITS Pilani is a premier private engineering institution known for its flexible academic system, PRACTICE School program, and outstanding placement record. It is highly regarded for producing industry-ready engineers and innovators.',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
    accreditation: 'NAAC A',
    website: 'https://www.bits-pilani.ac.in',
    examAccepted: ['BITSAT'],
    rankMin: null,
    rankMax: null,
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Vellore',
    state: 'Tamil Nadu',
    type: CollegeType.PRIVATE,
    feesMin: 180000,
    feesMax: 280000,
    rating: 4.2,
    totalReviews: 2100,
    established: 1984,
    description: 'VIT Vellore is one of the top private engineering universities in India, known for its industry-oriented curriculum, international collaborations, and strong placement support. It offers over 60 undergraduate programs across disciplines.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    accreditation: 'NAAC A++',
    website: 'https://vit.ac.in',
    examAccepted: ['VITEEE', 'JEE Main'],
    rankMin: 1000,
    rankMax: 100000,
  },
  {
    name: 'Delhi Technological University',
    slug: 'dtu-delhi',
    location: 'New Delhi',
    state: 'Delhi',
    type: CollegeType.GOVERNMENT,
    feesMin: 80000,
    feesMax: 175000,
    rating: 4.3,
    totalReviews: 750,
    established: 1941,
    description: 'DTU (formerly Delhi College of Engineering) is a leading state technical university in Delhi. Known for strong industry connections, competitive placements, and research output. A top choice for students seeking quality engineering education at lower costs.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    accreditation: 'NAAC A',
    website: 'https://dtu.ac.in',
    examAccepted: ['JEE Main'],
    rankMin: 8000,
    rankMax: 50000,
  },
  {
    name: 'Indian Institute of Technology Madras',
    slug: 'iit-madras',
    location: 'Chennai',
    state: 'Tamil Nadu',
    type: CollegeType.IIT,
    feesMin: 95000,
    feesMax: 215000,
    rating: 4.9,
    totalReviews: 1320,
    established: 1959,
    description: 'IIT Madras is consistently ranked #1 among engineering institutions in India by NIRF. Set in a lush 650-acre campus, it offers exceptional research opportunities, world-class faculty, and a culture of innovation and entrepreneurship.',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    accreditation: 'NAAC A++',
    website: 'https://www.iitm.ac.in',
    examAccepted: ['JEE Advanced'],
    rankMin: 1,
    rankMax: 400,
  },
  {
    name: 'National Institute of Technology Warangal',
    slug: 'nit-warangal',
    location: 'Warangal',
    state: 'Telangana',
    type: CollegeType.NIT,
    feesMin: 60000,
    feesMax: 140000,
    rating: 4.4,
    totalReviews: 680,
    established: 1959,
    description: 'NIT Warangal is one of the oldest and most respected NITs in India. It offers strong programs in engineering and sciences with a focus on practical education and industry linkages. Known for excellent student activities and cultural events.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    accreditation: 'NAAC A+',
    website: 'https://www.nitw.ac.in',
    examAccepted: ['JEE Main'],
    rankMin: 800,
    rankMax: 12000,
  },
];

const coursesByCollege: Record<string, Array<{ name: string; degree: string; duration: number; feesPerYear: number; totalSeats: number }>> = {
  'iit-bombay': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 220000, totalSeats: 90 },
    { name: 'Electrical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 210000, totalSeats: 80 },
    { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 200000, totalSeats: 75 },
    { name: 'Chemical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 195000, totalSeats: 60 },
    { name: 'Data Science & AI', degree: 'M.Tech', duration: 2, feesPerYear: 150000, totalSeats: 30 },
  ],
  'iit-delhi': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 210000, totalSeats: 85 },
    { name: 'Electrical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 200000, totalSeats: 80 },
    { name: 'Civil Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 190000, totalSeats: 70 },
    { name: 'Production & Industrial Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 185000, totalSeats: 50 },
  ],
  'nit-trichy': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 150000, totalSeats: 120 },
    { name: 'Electronics & Communication', degree: 'B.Tech', duration: 4, feesPerYear: 145000, totalSeats: 110 },
    { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 140000, totalSeats: 100 },
    { name: 'Civil Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 135000, totalSeats: 90 },
    { name: 'Chemical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 138000, totalSeats: 80 },
  ],
  'bits-pilani': [
    { name: 'Computer Science', degree: 'B.E.', duration: 4, feesPerYear: 520000, totalSeats: 180 },
    { name: 'Electronics & Instrumentation', degree: 'B.E.', duration: 4, feesPerYear: 500000, totalSeats: 120 },
    { name: 'Mechanical Engineering', degree: 'B.E.', duration: 4, feesPerYear: 490000, totalSeats: 100 },
    { name: 'Chemical Engineering', degree: 'B.E.', duration: 4, feesPerYear: 480000, totalSeats: 80 },
    { name: 'Mathematics & Computing', degree: 'B.E.', duration: 4, feesPerYear: 510000, totalSeats: 60 },
  ],
  'vit-vellore': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 280000, totalSeats: 600 },
    { name: 'Electronics & Communication', degree: 'B.Tech', duration: 4, feesPerYear: 260000, totalSeats: 400 },
    { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 240000, totalSeats: 350 },
    { name: 'Information Technology', degree: 'B.Tech', duration: 4, feesPerYear: 270000, totalSeats: 300 },
    { name: 'AI & Machine Learning', degree: 'B.Tech', duration: 4, feesPerYear: 290000, totalSeats: 120 },
  ],
  'dtu-delhi': [
    { name: 'Computer Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 175000, totalSeats: 180 },
    { name: 'Electronics & Communication', degree: 'B.Tech', duration: 4, feesPerYear: 165000, totalSeats: 160 },
    { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 155000, totalSeats: 150 },
    { name: 'Civil Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 145000, totalSeats: 120 },
  ],
  'iit-madras': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 215000, totalSeats: 70 },
    { name: 'Electrical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 210000, totalSeats: 80 },
    { name: 'Aerospace Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 205000, totalSeats: 45 },
    { name: 'Ocean Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 200000, totalSeats: 40 },
    { name: 'Engineering Design', degree: 'B.Tech', duration: 4, feesPerYear: 200000, totalSeats: 50 },
  ],
  'nit-warangal': [
    { name: 'Computer Science & Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 140000, totalSeats: 100 },
    { name: 'Electronics & Communication', degree: 'B.Tech', duration: 4, feesPerYear: 135000, totalSeats: 90 },
    { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, feesPerYear: 130000, totalSeats: 85 },
    { name: 'Electrical & Electronics', degree: 'B.Tech', duration: 4, feesPerYear: 133000, totalSeats: 75 },
  ],
};

const placementsByCollege: Record<string, Array<{ year: number; avgPackage: number; highestPackage: number; placementRate: number; topCompanies: string[]; medianPackage: number }>> = {
  'iit-bombay': [
    { year: 2024, avgPackage: 28, highestPackage: 120, placementRate: 95, topCompanies: ['Google', 'Microsoft', 'Goldman Sachs', 'Apple', 'Amazon'], medianPackage: 22 },
    { year: 2023, avgPackage: 25, highestPackage: 110, placementRate: 94, topCompanies: ['Google', 'Morgan Stanley', 'DE Shaw', 'Uber', 'Meta'], medianPackage: 20 },
  ],
  'iit-delhi': [
    { year: 2024, avgPackage: 26, highestPackage: 115, placementRate: 93, topCompanies: ['Microsoft', 'Google', 'McKinsey', 'Qualcomm', 'Samsung'], medianPackage: 20 },
    { year: 2023, avgPackage: 24, highestPackage: 105, placementRate: 92, topCompanies: ['Amazon', 'Microsoft', 'Intel', 'Adobe', 'Flipkart'], medianPackage: 18 },
  ],
  'nit-trichy': [
    { year: 2024, avgPackage: 14, highestPackage: 65, placementRate: 88, topCompanies: ['TCS', 'Infosys', 'Cognizant', 'Amazon', 'Zoho'], medianPackage: 11 },
    { year: 2023, avgPackage: 12, highestPackage: 55, placementRate: 85, topCompanies: ['TCS', 'Wipro', 'Accenture', 'Samsung', 'HP'], medianPackage: 10 },
  ],
  'bits-pilani': [
    { year: 2024, avgPackage: 22, highestPackage: 100, placementRate: 90, topCompanies: ['Google', 'Microsoft', 'Goldman Sachs', 'Qualcomm', 'Tower Research'], medianPackage: 17 },
    { year: 2023, avgPackage: 20, highestPackage: 95, placementRate: 89, topCompanies: ['Sprinklr', 'Rubrik', 'DE Shaw', 'CRED', 'Uber'], medianPackage: 16 },
  ],
  'vit-vellore': [
    { year: 2024, avgPackage: 8, highestPackage: 45, placementRate: 82, topCompanies: ['TCS', 'Infosys', 'Wipro', 'Zoho', 'Capgemini'], medianPackage: 6 },
    { year: 2023, avgPackage: 7, highestPackage: 40, placementRate: 80, topCompanies: ['TCS', 'Cognizant', 'HCL', 'Hexaware', 'Mphasis'], medianPackage: 5 },
  ],
  'dtu-delhi': [
    { year: 2024, avgPackage: 18, highestPackage: 80, placementRate: 86, topCompanies: ['Microsoft', 'Amazon', 'Samsung', 'Adobe', 'Paytm'], medianPackage: 14 },
    { year: 2023, avgPackage: 16, highestPackage: 72, placementRate: 84, topCompanies: ['Google', 'Qualcomm', 'Oracle', 'Directi', 'InMobi'], medianPackage: 12 },
  ],
  'iit-madras': [
    { year: 2024, avgPackage: 30, highestPackage: 130, placementRate: 96, topCompanies: ['Google', 'Apple', 'Uber', 'Adobe', 'Flipkart'], medianPackage: 24 },
    { year: 2023, avgPackage: 28, highestPackage: 118, placementRate: 95, topCompanies: ['Microsoft', 'Amazon', 'DE Shaw', 'McKinsey', 'Intel'], medianPackage: 22 },
  ],
  'nit-warangal': [
    { year: 2024, avgPackage: 13, highestPackage: 60, placementRate: 85, topCompanies: ['TCS', 'Infosys', 'Amazon', 'Wipro', 'Cognizant'], medianPackage: 10 },
    { year: 2023, avgPackage: 11, highestPackage: 52, placementRate: 83, topCompanies: ['TCS', 'HCL', 'Accenture', 'L&T', 'Samsung'], medianPackage: 9 },
  ],
};

async function main() {
  console.log('🌱 Seeding database...');

  // Seed demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@collegediscovery.in' },
    update: {},
    create: {
      email: 'demo@collegediscovery.in',
      name: 'Demo User',
      passwordHash,
    },
  });

  for (const collegeData of colleges) {
    const { rankMin, rankMax, ...rest } = collegeData;
    
    const college = await prisma.college.upsert({
      where: { slug: collegeData.slug },
      update: rest,
      create: {
        ...rest,
        rankMin: rankMin ?? null,
        rankMax: rankMax ?? null,
      },
    });

    // Seed courses
    const courses = coursesByCollege[college.slug] || [];
    for (const course of courses) {
      await prisma.course.create({ data: { ...course, collegeId: college.id } });
    }

    // Seed placements
    const placements = placementsByCollege[college.slug] || [];
    for (const placement of placements) {
      await prisma.placement.create({ data: { ...placement, collegeId: college.id } });
    }

    // Seed exam cutoffs
    if (collegeData.examAccepted.includes('JEE Advanced') && collegeData.rankMin !== null) {
      await prisma.examCutoff.create({
        data: {
          collegeId: college.id,
          examName: 'JEE Advanced',
          rankMin: collegeData.rankMin!,
          rankMax: collegeData.rankMax!,
          category: 'General',
          year: 2024,
        },
      });
    }
    if (collegeData.examAccepted.includes('JEE Main') && collegeData.rankMin !== null) {
      await prisma.examCutoff.create({
        data: {
          collegeId: college.id,
          examName: 'JEE Main',
          rankMin: collegeData.rankMin!,
          rankMax: collegeData.rankMax!,
          category: 'General',
          year: 2024,
        },
      });
    }

    // Seed reviews
    const sampleReviews = [
      {
        rating: 5,
        title: 'Life-changing experience',
        content: 'The academic environment here is unmatched. World-class faculty, excellent research facilities, and a vibrant campus life. The placements are outstanding and the alumni network is incredibly strong.',
        category: 'academics',
      },
      {
        rating: 4,
        title: 'Great placements, competitive environment',
        content: 'Placement season was excellent with top companies visiting campus. The environment is very competitive which pushes you to be your best. Infrastructure is top-notch.',
        category: 'placements',
      },
      {
        rating: 4,
        title: 'Campus life is vibrant',
        content: 'The campus has everything you need. The fests, clubs, and extracurriculars make it a wholesome experience. Hostels are comfortable and mess food has improved significantly.',
        category: 'campus',
      },
    ];

    const user = await prisma.user.findUnique({ where: { email: 'demo@collegediscovery.in' } });
    for (const review of sampleReviews) {
      await prisma.review.create({
        data: { ...review, collegeId: college.id, userId: user!.id, helpfulCount: Math.floor(Math.random() * 50) },
      });
    }

    console.log(`✅ Seeded: ${college.name}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
