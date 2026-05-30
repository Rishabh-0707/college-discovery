import { NextRequest, NextResponse } from 'next/server';
import { queryColleges } from '@/lib/colleges';
import { CollegeFilters } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: CollegeFilters = {
      search:       searchParams.get('search')       || '',
      state:        searchParams.get('state')        || '',
      type:         searchParams.get('type')         || '',
      feesMin:      searchParams.get('feesMin')      ? parseInt(searchParams.get('feesMin')!)      : undefined,
      feesMax:      searchParams.get('feesMax')      ? parseInt(searchParams.get('feesMax')!)      : undefined,
      ratingMin:    searchParams.get('ratingMin')    ? parseFloat(searchParams.get('ratingMin')!)  : undefined,
      examAccepted: searchParams.get('examAccepted') || '',
      sortBy:       (searchParams.get('sortBy')      || 'rating') as CollegeFilters['sortBy'],
      sortOrder:    (searchParams.get('sortOrder')   || 'desc')   as 'asc' | 'desc',
      page:         parseInt(searchParams.get('page')     || '1'),
      pageSize:     parseInt(searchParams.get('pageSize') || '9'),
    };

    const result = await queryColleges(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/colleges GET]', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
