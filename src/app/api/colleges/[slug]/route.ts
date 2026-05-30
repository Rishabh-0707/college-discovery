import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Explicit selects — never return internal fields (rankMin/rankMax, createdAt,
// updatedAt, userId in reviews) to external consumers.
const COLLEGE_DETAIL_SELECT = {
  id:            true,
  name:          true,
  slug:          true,
  location:      true,
  state:         true,
  type:          true,
  feesMin:       true,
  feesMax:       true,
  rating:        true,
  totalReviews:  true,
  established:   true,
  description:   true,
  imageUrl:      true,
  accreditation: true,
  website:       true,
  examAccepted:  true,
  courses: {
    select: { id: true, name: true, degree: true, duration: true, feesPerYear: true, totalSeats: true },
    orderBy: { feesPerYear: 'desc' as const },
  },
  placements: {
    select: { id: true, year: true, avgPackage: true, highestPackage: true, medianPackage: true, placementRate: true, topCompanies: true },
    orderBy: { year: 'desc' as const },
  },
  reviews: {
    select: {
      id:           true,
      rating:       true,
      title:        true,
      content:      true,
      category:     true,
      helpfulCount: true,
      createdAt:    true,
      // user.name only — never expose userId or user.email
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' as const },
    take: 10,
  },
} as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await auth();

    const college = await prisma.college.findUnique({
      where: { slug },
      select: COLLEGE_DETAIL_SELECT,
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    let isSaved = false;
    if (session?.user?.id) {
      const saved = await prisma.savedCollege.findUnique({
        where: { userId_collegeId: { userId: session.user.id, collegeId: college.id } },
      });
      isSaved = !!saved;
    }

    // Return isSaved as a clean boolean — not _isSaved — so the field name
    // is intentional and not confused with an internal marker.
    return NextResponse.json({ ...college, isSaved });
  } catch (error) {
    console.error('[/api/colleges/[slug] GET]', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
