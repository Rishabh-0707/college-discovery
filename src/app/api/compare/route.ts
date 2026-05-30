import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MAX_COMPARE_COLLEGES } from '@/lib/constants';

// Strict select — only the fields the compare UI actually needs.
// Excludes: rankMin, rankMax, createdAt, updatedAt, description, collegeId on sub-records.
const COMPARE_SELECT = {
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
  accreditation: true,
  examAccepted:  true,
  placements: {
    select: { id: true, year: true, avgPackage: true, highestPackage: true, medianPackage: true, placementRate: true, topCompanies: true },
    orderBy: { year: 'desc' as const },
    take: 1,
  },
  courses: {
    select: { id: true, name: true, degree: true, duration: true, feesPerYear: true, totalSeats: true },
    take: 5,
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collegeIds } = body as { collegeIds: string[] };

    if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > MAX_COMPARE_COLLEGES) {
      return NextResponse.json(
        { error: `Provide 2–${MAX_COMPARE_COLLEGES} college IDs` },
        { status: 400 },
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      select: COMPARE_SELECT,
    });

    // Return in the order the client requested
    const ordered = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json({ colleges: ordered });
  } catch (error) {
    console.error('[/api/compare POST]', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
