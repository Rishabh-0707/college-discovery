import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { collegeIds } = body as { collegeIds: string[] };

  if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 3) {
    return NextResponse.json({ error: 'Provide 2–3 college IDs' }, { status: 400 });
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: collegeIds } },
    include: {
      placements: { orderBy: { year: 'desc' }, take: 1 },
      courses: { take: 5 },
    },
  });

  // Return in the requested order
  const ordered = collegeIds
    .map((id) => colleges.find((c) => c.id === id))
    .filter(Boolean);

  return NextResponse.json({ colleges: ordered });
}
