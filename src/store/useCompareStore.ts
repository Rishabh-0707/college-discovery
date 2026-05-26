import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CollegeListItem } from '@/types';

interface CompareStore {
  colleges: CollegeListItem[];
  addCollege: (college: CollegeListItem) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      colleges: [],
      addCollege: (college) => {
        const { colleges } = get();
        if (colleges.length >= 3) return;
        if (colleges.find((c) => c.id === college.id)) return;
        set({ colleges: [...colleges, college] });
      },
      removeCollege: (id) => {
        set({ colleges: get().colleges.filter((c) => c.id !== id) });
      },
      clearAll: () => set({ colleges: [] }),
      isInCompare: (id) => !!get().colleges.find((c) => c.id === id),
    }),
    { name: 'compare-colleges' }
  )
);
