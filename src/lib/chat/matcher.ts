import { COLLEGE_SYNONYMS } from './synonyms';

/** Shape of the minimal college row needed for matching */
export interface CollegeBasic {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: string;
}

/** Escape special regex characters so location/name strings don't crash RegExp */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Given a user query and the full list of colleges, returns every college
 * whose slug, name, location, or configured synonym appears in the query.
 */
export function matchColleges(query: string, allColleges: CollegeBasic[]): CollegeBasic[] {
  const q = query.toLowerCase().trim();

  return allColleges.filter((c) => {
    const slugLower    = c.slug.toLowerCase();
    const slugClean    = slugLower.replace(/-/g, ' ');
    const nameLower    = c.name.toLowerCase();
    const locationLower = c.location.toLowerCase();

    // 1. Direct slug / full-name match (longer strings first — no boundary check needed)
    if (q.includes(slugLower) || q.includes(slugClean) || q.includes(nameLower)) {
      return true;
    }

    // 2. Curated synonym match
    const syns = COLLEGE_SYNONYMS[c.slug];
    if (syns) {
      for (const syn of syns) {
        if (syn.length <= 5) {
          // Short abbreviations (e.g. "iitb", "dtu", "nitt") — require whole-word match
          // so "vit" doesn't accidentally fire inside "invite" or "vitamin".
          if (new RegExp(`\\b${escapeRegex(syn)}\\b`, 'i').test(q)) return true;
        } else {
          if (q.includes(syn)) return true;
        }
      }
    }

    // 3. Location word-boundary fallback (e.g. "mumbai", "warangal")
    if (new RegExp(`\\b${escapeRegex(locationLower)}\\b`, 'i').test(q)) return true;

    return false;
  });
}
