import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();

  const college = await prisma.college.findUnique({
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

  return NextResponse.json({ ...college, _isSaved: isSaved });
}
