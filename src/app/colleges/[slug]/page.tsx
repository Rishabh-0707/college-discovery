import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCollege } from '@/lib/colleges';
import CollegeDetailClient from './CollegeDetailClient';
import { CollegeDetail } from '@/types';

// generateMetadata and the page body both call getCollege(slug).
// React.cache (inside src/lib/colleges.ts) ensures exactly ONE DB round-trip
// per request, regardless of how many times getCollege is called.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getCollege(slug);

  if (!college) {
    return {
      title: 'College Not Found | CollegeQ',
      description: 'The requested college could not be found.',
    };
  }

  return {
    title: `${college.name} - Admission, Courses, Fees, Placements | CollegeQ`,
    description:
      college.description.substring(0, 160) ||
      `Explore admission, courses, fee structures, placement records, and reviews for ${college.name} in ${college.location}, ${college.state}.`,
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  // getCollege is React.cache-memoised — same result as generateMetadata above,
  // no extra DB call.
  const [dbCollege, saved] = await Promise.all([
    getCollege(slug),
    session?.user?.id
      ? prisma.savedCollege.findFirst({
          where: {
            userId: session.user.id,
            college: { slug },
          },
        })
      : Promise.resolve(null),
  ]);

  if (!dbCollege) {
    notFound();
  }

  const isSaved = !!saved;

  // Serialise Dates to strings so they can cross the server → client boundary
  const college: CollegeDetail = {
    ...dbCollege,
    examAccepted: dbCollege.examAccepted as string[],
    reviews: dbCollege.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
  };

  return <CollegeDetailClient college={college} isSaved={isSaved} />;
}
