import { queryColleges } from '@/lib/colleges';
import { CollegesClient } from './CollegesClient';
import { Suspense } from 'react';

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;

  // Parse and forward URL params to the shared queryColleges function
  const initialData = await queryColleges({
    search:       typeof params.search       === 'string' ? params.search       : '',
    state:        typeof params.state        === 'string' ? params.state        : '',
    type:         typeof params.type         === 'string' ? params.type         : '',
    feesMin:      typeof params.feesMin      === 'string' ? parseInt(params.feesMin)      : undefined,
    feesMax:      typeof params.feesMax      === 'string' ? parseInt(params.feesMax)      : undefined,
    ratingMin:    typeof params.ratingMin    === 'string' ? parseFloat(params.ratingMin)  : undefined,
    examAccepted: typeof params.examAccepted === 'string' ? params.examAccepted           : '',
    sortBy:       (typeof params.sortBy   === 'string' ? params.sortBy   : 'rating') as any,
    sortOrder:    (typeof params.sortOrder === 'string' ? params.sortOrder : 'desc') as any,
    page:         typeof params.page     === 'string' ? parseInt(params.page)     : 1,
    pageSize:     typeof params.pageSize === 'string' ? parseInt(params.pageSize) : 9,
  });

  return (
    <Suspense fallback={<div className="flex justify-center py-24">Loading...</div>}>
      <CollegesClient initialData={initialData} />
    </Suspense>
  );
}
