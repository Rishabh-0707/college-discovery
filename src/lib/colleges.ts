import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CollegeFilters } from '@/types';

// ─── Shared field list so server page and API route are always in sync ────────
const COLLEGE_LIST_SELECT = {
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
} as const;

const VALID_SORT_FIELDS = ['rating', 'feesMin', 'feesMax', 'established', 'name'] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

// ─── Shared query function — used by both the server page and the REST API ────
export async function queryColleges(filters: CollegeFilters) {
  const {
    search = '',
    state = '',
    type = '',
    feesMin,
    feesMax,
    ratingMin,
    examAccepted = '',
    sortBy = 'rating',
    sortOrder = 'desc',
    page = 1,
    pageSize = 9,
  } = filters;

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

  // Whitelist the sort field to prevent injection through URL params
  const orderByField: SortField = (VALID_SORT_FIELDS as readonly string[]).includes(sortBy)
    ? (sortBy as SortField)
    : 'rating';
  const orderByDir = sortOrder === 'asc' ? 'asc' : 'desc';

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      select: COLLEGE_LIST_SELECT,
      orderBy: { [orderByField]: orderByDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.college.count({ where }),
  ]);

  return {
    colleges,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Per-request deduplication via React.cache ────────────────────────────────
// Both generateMetadata and the page body call this for the same slug in the
// same request — React.cache ensures exactly ONE database round-trip.
export const getCollege = cache(async (slug: string) => {
  return prisma.college.findUnique({
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
});
