import { CollegeType } from '@prisma/client';

export { CollegeType };

export interface CollegeListItem {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: CollegeType;
  feesMin: number;
  feesMax: number;
  rating: number;
  totalReviews: number;
  established: number;
  imageUrl: string | null;
  accreditation: string | null;
  examAccepted: string[];
}

export interface CollegeDetail extends CollegeListItem {
  description: string;
  website: string | null;
  courses: Course[];
  placements: Placement[];
  reviews: ReviewWithUser[];
  _isSaved?: boolean;
}

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  feesPerYear: number;
  totalSeats: number;
}

export interface Placement {
  id: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
  medianPackage: number;
  placementRate: number;
  topCompanies: string[];
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  category: string;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewWithUser extends Review {
  user: { name: string };
}

export interface CollegesResponse {
  colleges: CollegeListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  type?: string;
  feesMin?: number;
  feesMax?: number;
  ratingMin?: number;
  examAccepted?: string;
  sortBy?: 'rating' | 'feesMin' | 'feesMax' | 'established' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CompareCollegesPayload {
  collegeIds: string[];
}

export interface SavedCollegeResponse {
  id: string;
  collegeId: string;
  savedAt: string;
  college: CollegeListItem;
}
