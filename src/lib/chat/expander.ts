import { CATEGORY_REPRESENTATIVES } from './synonyms';
import { CollegeBasic } from './matcher';

interface ExpandResult {
  colleges: CollegeBasic[];
  expansionApplied: boolean;
}

const CATEGORY_PATTERNS: { type: string; pattern: RegExp }[] = [
  { type: 'IIT',  pattern: /\biit\b/i },
  { type: 'NIT',  pattern: /\bnit\b/i },
  { type: 'BITS', pattern: /\bbits\b/i },
];

const IS_COMPARISON = /\b(vs|versus|compare|against)\b/i;

/**
 * If the user mentioned a category word (e.g. "iit") but no specific campus of
 * that category was matched yet, we inject a representative campus so the bot
 * can produce a comparison table instead of falling back to the welcome message.
 *
 * In comparison mode: picks one representative per missing category.
 * In informational mode: injects ALL colleges of that category.
 */
export function expandByCategory(
  query: string,
  matched: CollegeBasic[],
  allColleges: CollegeBasic[],
): ExpandResult {
  const matchedTypes = new Set(matched.map((c) => c.type));
  const matchedSlugs = new Set(matched.map((c) => c.slug));
  const isComparison = IS_COMPARISON.test(query);

  let expansionApplied = false;
  const expanded = [...matched];

  for (const { type, pattern } of CATEGORY_PATTERNS) {
    if (!pattern.test(query)) continue;         // word not in query
    if (matchedTypes.has(type)) continue;        // already have a match of this type

    if (isComparison) {
      // Inject the single representative campus for this category
      const repSlug = CATEGORY_REPRESENTATIVES[type];
      const rep = allColleges.find((c) => c.slug === repSlug);
      if (rep && !matchedSlugs.has(rep.slug)) {
        expanded.push(rep);
        matchedSlugs.add(rep.slug);
        expansionApplied = true;
      }
    } else {
      // Inject all colleges of this category
      allColleges
        .filter((c) => c.type === type && !matchedSlugs.has(c.slug))
        .forEach((c) => {
          expanded.push(c);
          matchedSlugs.add(c.slug);
          expansionApplied = true;
        });
    }
  }

  // Deduplicate by id (safety net)
  const deduped = Array.from(new Map(expanded.map((c) => [c.id, c])).values());
  return { colleges: deduped, expansionApplied };
}
