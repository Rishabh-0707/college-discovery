import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import CollegeDetailClient from './CollegeDetailClient';
import { CollegeDetail } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { name: true, description: true, location: true, state: true },
  });

  if (!college) {
    return {
      title: 'College Not Found | College Discovery',
      description: 'The requested college could not be found.',
    };
  }

  return {
    title: `${college.name} - Admission, Courses, Fees, Placements | College Discovery`,
    description: college.description.substring(0, 160) || `Explore admission, courses, fee structures, placement records, and reviews for ${college.name} in ${college.location}, ${college.state}.`,
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const dbCollege = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: { orderBy: { feesPerYear: 'desc' } },
      placements: { orderBy: { year: 'desc' } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!dbCollege) {
    notFound();
  }

  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId: dbCollege.id } },
    });
    isSaved = !!saved;
  }

  // Format Date object to string to avoid serialization issues
  const college: CollegeDetail = {
    ...dbCollege,
    examAccepted: dbCollege.examAccepted as string[],
    reviews: dbCollege.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
    _isSaved: isSaved,
  };

  return <CollegeDetailClient college={college} />;
}
