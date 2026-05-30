import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await auth();

    const [college, saved] = await Promise.all([
      prisma.college.findUnique({
        where: { slug },
        include: {
          courses:    { orderBy: { feesPerYear: 'desc' } },
          placements: { orderBy: { year: 'desc' } },
          reviews: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      }),
      session?.user?.id
        ? prisma.savedCollege.findUnique({
            where: { userId_collegeId: { userId: session.user.id, collegeId: '' } }, // placeholder — resolved below
          })
        : Promise.resolve(null),
    ]);

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    let isSaved = false;
    if (session?.user?.id) {
      const savedRecord = await prisma.savedCollege.findUnique({
        where: { userId_collegeId: { userId: session.user.id, collegeId: college.id } },
      });
      isSaved = !!savedRecord;
    }

    return NextResponse.json({ ...college, _isSaved: isSaved });
  } catch (error) {
    console.error('[/api/colleges/[slug] GET]', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
