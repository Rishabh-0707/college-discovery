import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { matchColleges } from './matcher';
import { expandByCategory } from './expander';
import {
  buildCollegeOverview,
  buildComparisonTable,
  buildTopPlacement,
  buildCheapest,
  buildTopRated,
  buildWelcome,
} from './templates';

// ─── Cached college list ──────────────────────────────────────────────────────
// All colleges are fetched once and cached for 5 minutes using Next.js Data Cache.
// This eliminates the full-table-scan on every single chat message.
const getCachedColleges = unstable_cache(
  () =>
    prisma.college.findMany({
      select: { id: true, name: true, slug: true, location: true, state: true, type: true },
    }),
  ['chat-all-colleges'],
  { revalidate: 300 }, // 5-minute TTL
);

// ─── Main orchestrator ────────────────────────────────────────────────────────

export async function orchestrateChat(userQuery: string): Promise<string> {
  const query = userQuery.toLowerCase().trim();

  // 1. Get (cached) college list for semantic matching
  const allColleges = await getCachedColleges();

  // 2. Match colleges explicitly mentioned in the query
  const directMatches = matchColleges(query, allColleges);

  // 3. Expand with category representatives if needed (e.g. "iit vs bits")
  const { colleges: finalMatches, expansionApplied } = expandByCategory(
    query,
    directMatches,
    allColleges,
  );

  // 4. If one or more colleges matched — fetch full details and build response
  if (finalMatches.length > 0) {
    const colleges = await prisma.college.findMany({
      where: { id: { in: finalMatches.map((c) => c.id) } },
      select: {
        id: true, name: true, slug: true, location: true, state: true,
        type: true, established: true, rating: true, totalReviews: true,
        accreditation: true, feesMin: true, feesMax: true, examAccepted: true,
        courses:    { select: { id: true, name: true, degree: true, feesPerYear: true, totalSeats: true }, orderBy: { feesPerYear: 'desc' as const } },
        placements: { select: { id: true, year: true, avgPackage: true, highestPackage: true, placementRate: true, topCompanies: true }, orderBy: { year: 'desc' as const } },
      },
    });

    if (colleges.length === 1) {
      return buildCollegeOverview(colleges[0]);
    }
    return buildComparisonTable(colleges, expansionApplied);
  }

  // 5. Keyword-based metric queries
  if (/highest package|best placement|highest salary/i.test(query)) {
    const top = await prisma.placement.findFirst({
      orderBy: { highestPackage: 'desc' },
      select: {
        highestPackage: true,
        avgPackage:     true,
        placementRate:  true,
        topCompanies:   true,
        college: {
          select: {
            name: true,
            placements: {
              select: { highestPackage: true, avgPackage: true, placementRate: true, topCompanies: true },
              orderBy: { year: 'desc' as const },
              take: 1,
            },
          },
        },
      },
    });
    if (top) return buildTopPlacement(top.college);
  }

  if (/cheapest|lowest fee|affordable/i.test(query)) {
    const cheapest = await prisma.college.findFirst({
      orderBy: { feesMin: 'asc' },
      select: { name: true, feesMin: true, feesMax: true, type: true, location: true, state: true },
    });
    if (cheapest) return buildCheapest(cheapest);
  }

  if (/highest rating|best college|top rated/i.test(query)) {
    const topRated = await prisma.college.findFirst({
      orderBy: { rating: 'desc' },
      select: { name: true, rating: true, totalReviews: true, accreditation: true, location: true, state: true },
    });
    if (topRated) return buildTopRated(topRated);
  }

  // 6. Fallback — welcome message
  return buildWelcome();
}
