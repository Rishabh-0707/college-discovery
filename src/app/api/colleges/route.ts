import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || '';
  const state = searchParams.get('state') || '';
  const type = searchParams.get('type') || '';
  const feesMin = searchParams.get('feesMin') ? parseInt(searchParams.get('feesMin')!) : undefined;
  const feesMax = searchParams.get('feesMax') ? parseInt(searchParams.get('feesMax')!) : undefined;
  const ratingMin = searchParams.get('ratingMin') ? parseFloat(searchParams.get('ratingMin')!) : undefined;
  const examAccepted = searchParams.get('examAccepted') || '';
  const sortBy = searchParams.get('sortBy') || 'rating';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '9');

  const where: Prisma.CollegeWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(state && { state: { contains: state, mode: 'insensitive' } }),
    ...(type && { type: type as Prisma.EnumCollegeTypeFilter }),
    ...(feesMin !== undefined && { feesMin: { gte: feesMin } }),
    ...(feesMax !== undefined && { feesMax: { lte: feesMax } }),
    ...(ratingMin !== undefined && { rating: { gte: ratingMin } }),
    ...(examAccepted && { examAccepted: { has: examAccepted } }),
  };

  const validSortFields = ['rating', 'feesMin', 'feesMax', 'established', 'name'];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'rating';
  const orderByDir = sortOrder === 'asc' ? 'asc' : 'desc';

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        state: true,
        type: true,
        feesMin: true,
        feesMax: true,
        rating: true,
        totalReviews: true,
        established: true,
        imageUrl: true,
        accreditation: true,
        examAccepted: true,
      },
      orderBy: { [orderByField]: orderByDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({
    colleges,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
