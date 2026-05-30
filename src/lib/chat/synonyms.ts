/**
 * Curated synonym / abbreviation dictionary for college matching.
 *
 * Moving this out of the route handler means:
 *  - It can be extended without touching API logic.
 *  - It is independently testable.
 *  - Adding a new college is a one-line config change here.
 *
 * Key   = college slug (matches Prisma `College.slug`)
 * Value = list of synonyms the user might type
 */
export const COLLEGE_SYNONYMS: Record<string, string[]> = {
  'iit-bombay':  ['iit bombay', 'iitb', 'iit mumbai', 'bombay', 'mumbai'],
  'iit-delhi':   ['iit delhi', 'iitd', 'delhi'],
  'iit-madras':  ['iit madras', 'iitm', 'iit chennai', 'madras', 'chennai'],
  'nit-trichy':  ['nit trichy', 'nitt', 'trichy', 'tiruchirappalli'],
  'nit-warangal':['nit warangal', 'nitw', 'warangal'],
  'bits-pilani': ['bits pilani', 'bits', 'pilani'],
  'vit-vellore': ['vit vellore', 'vit', 'vellore'],
  'dtu-delhi':   ['dtu delhi', 'dtu', 'delhi technological university', 'dce', 'delhi technological'],
};

/** Representative campus to use when a category term is detected but no specific campus */
export const CATEGORY_REPRESENTATIVES: Record<string, string> = {
  IIT:  'iit-bombay',
  NIT:  'nit-trichy',
  BITS: 'bits-pilani',
};
