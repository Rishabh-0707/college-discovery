import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CollegesClient } from './CollegesClient';
import { Suspense } from 'react';

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  
  const search = typeof params.search === 'string' ? params.search : '';
  const state = typeof params.state === 'string' ? params.state : '';
  const type = typeof params.type === 'string' ? params.type : '';
  const feesMin = typeof params.feesMin === 'string' ? parseInt(params.feesMin) : undefined;
  const feesMax = typeof params.feesMax === 'string' ? parseInt(params.feesMax) : undefined;
  const ratingMin = typeof params.ratingMin === 'string' ? parseFloat(params.ratingMin) : undefined;
  const examAccepted = typeof params.examAccepted === 'string' ? params.examAccepted : '';
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : 'rating';
  const sortOrder = typeof params.sortOrder === 'string' ? params.sortOrder : 'desc';
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const pageSize = typeof params.pageSize === 'string' ? parseInt(params.pageSize) : 9;

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

  const initialData = {
    colleges,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };

  return (
    <Suspense fallback={<div className="flex justify-center py-24">Loading...</div>}>
      <CollegesClient initialData={initialData as any} />
    </Suspense>
  );
}
