import { formatFees, formatPackage } from '@/lib/utils';

// Re-use the Prisma return types inline to avoid circular imports
type CollegeWithDetails = {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: string;
  established: number;
  rating: number;
  totalReviews: number;
  accreditation: string | null;
  feesMin: number;
  feesMax: number;
  examAccepted: string[];
  courses: { id: string; name: string; degree: string; feesPerYear: number; totalSeats: number }[];
  placements: { id: string; avgPackage: number; highestPackage: number; placementRate: number; topCompanies: string[] }[];
};

// ─── Single college overview ──────────────────────────────────────────────────

export function buildCollegeOverview(col: CollegeWithDetails): string {
  const placement = col.placements[0];
  const coursesBlock = col.courses
    .slice(0, 3)
    .map((c) => `- **${c.name} (${c.degree}):** ${formatFees(c.feesPerYear)}/yr (${c.totalSeats} seats)`)
    .join('\n');

  return (
    `### Overview of ${col.name}\n` +
    `Located in **${col.location}, ${col.state}**, ${col.name} is an established **${col.type}** institution founded in **${col.established}**.\n\n` +
    `#### Key Metrics:\n` +
    `- **Rating:** ⭐ ${col.rating} (${col.totalReviews} reviews)\n` +
    `- **Accreditation:** ${col.accreditation || 'N/A'}\n` +
    `- **Fees Range:** ${formatFees(col.feesMin)} - ${formatFees(col.feesMax)} per year\n` +
    `- **Average Placement:** ${placement ? formatPackage(placement.avgPackage) : 'N/A'}\n` +
    `- **Highest Package:** ${placement ? formatPackage(placement.highestPackage) : 'N/A'}\n` +
    `- **Exams Accepted:** ${col.examAccepted.join(', ')}\n\n` +
    `#### Courses Available:\n` +
    `${coursesBlock}\n\n` +
    `Would you like to compare ${col.name} with another college, say BITS Pilani or IIT Delhi?`
  );
}

// ─── Multi-college comparison table ──────────────────────────────────────────

export function buildComparisonTable(
  colleges: CollegeWithDetails[],
  expansionApplied: boolean,
): string {
  const headerNames = colleges.map((c) => c.name.split(' ').slice(0, 3).join(' '));
  const separator   = colleges.map(() => ':---:');

  const tableHeader  = `| Metric | ${headerNames.join(' | ')} |`;
  const tableSep     = `| :--- | ${separator.join(' | ')} |`;
  const rowType      = `| **Type** | ${colleges.map((c) => c.type).join(' | ')} |`;
  const rowLocation  = `| **Location** | ${colleges.map((c) => `${c.location}, ${c.state}`).join(' | ')} |`;
  const rowEstd      = `| **Established** | ${colleges.map((c) => c.established).join(' | ')} |`;
  const rowRating    = `| **Rating** | ${colleges.map((c) => `⭐ ${c.rating}`).join(' | ')} |`;
  const rowAvgPkg    = `| **Avg Package** | ${colleges.map((c) => c.placements[0] ? formatPackage(c.placements[0].avgPackage) : 'N/A').join(' | ')} |`;
  const rowMaxPkg    = `| **Highest Package** | ${colleges.map((c) => c.placements[0] ? formatPackage(c.placements[0].highestPackage) : 'N/A').join(' | ')} |`;
  const rowFees      = `| **Fees Range** | ${colleges.map((c) => `${formatFees(c.feesMin)} - ${formatFees(c.feesMax)}`).join(' | ')} |`;

  const sortedByPkg  = [...colleges].sort((a, b) => (b.placements[0]?.avgPackage || 0) - (a.placements[0]?.avgPackage || 0));
  const sortedByFees = [...colleges].sort((a, b) => a.feesMin - b.feesMin);

  const expansionNote = expansionApplied
    ? `*Note: Since you compared general institutional categories, I've loaded premier representative campuses (${colleges.map((c) => c.name).join(' vs ')}) to give you a side-by-side benchmark breakdown.*\n\n`
    : '';

  return (
    expansionNote +
    `### 📊 College Comparison Report\n` +
    `Here is a side-by-side analysis of the **${colleges.length} colleges** you requested:\n\n` +
    [tableHeader, tableSep, rowType, rowLocation, rowEstd, rowRating, rowAvgPkg, rowMaxPkg, rowFees].join('\n') +
    `\n\n### 💡 Key Comparative Insights:\n\n` +
    `1. **Placements:** **${sortedByPkg[0].name}** leads with an average package of **${formatPackage(sortedByPkg[0].placements[0]?.avgPackage || 0)}**, followed by **${sortedByPkg[1]?.name || 'others'}**.\n` +
    `2. **Affordability:** **${sortedByFees[0].name}** is most affordable starting at **${formatFees(sortedByFees[0].feesMin)}/yr**, while **${sortedByFees[sortedByFees.length - 1].name}** has the highest fees.\n\n` +
    `Which specific features (e.g. course intake, cutoffs, or student reviews) would you like to explore further?`
  );
}

// ─── Metric-based responses ───────────────────────────────────────────────────

export function buildTopPlacement(college: {
  name: string;
  placements: { highestPackage: number; avgPackage: number; placementRate: number; topCompanies: string[] }[];
}): string {
  const p = college.placements[0];
  return (
    `### 🏆 Top Placement Record\n` +
    `**${college.name}** holds the highest package record in our database:\n\n` +
    `- **Highest Package:** ${formatPackage(p.highestPackage)}\n` +
    `- **Average Package:** ${formatPackage(p.avgPackage)}\n` +
    `- **Placement Rate:** ${p.placementRate}%\n` +
    `- **Top Recruiters:** ${p.topCompanies.slice(0, 5).join(', ')}\n\n` +
    `Would you like to compare **${college.name}** with another engineering institute?`
  );
}

export function buildCheapest(college: { name: string; feesMin: number; feesMax: number; type: string; location: string; state: string }): string {
  return (
    `### 💸 Most Affordable College\n` +
    `**${college.name}** offers the most cost-effective tuition fees in our records:\n\n` +
    `- **Minimum Fees:** ${formatFees(college.feesMin)} per year\n` +
    `- **Maximum Fees:** ${formatFees(college.feesMax)} per year\n` +
    `- **Type:** ${college.type}\n` +
    `- **Location:** ${college.location}, ${college.state}\n\n` +
    `Would you like to see the placement metrics for ${college.name} to evaluate its Return on Investment (ROI)?`
  );
}

export function buildTopRated(college: { name: string; rating: number; totalReviews: number; accreditation: string | null; location: string; state: string }): string {
  return (
    `### ⭐ Top-Rated Institution\n` +
    `**${college.name}** is currently the highest-rated college based on verified student reviews:\n\n` +
    `- **Rating:** ⭐ ${college.rating} out of 5.0\n` +
    `- **Total Reviews:** ${college.totalReviews} reviews\n` +
    `- **Accreditation:** ${college.accreditation || 'N/A'}\n` +
    `- **Location:** ${college.location}, ${college.state}\n\n` +
    `Would you like to read about the courses available at **${college.name}**?`
  );
}

export function buildWelcome(): string {
  return (
    `👋 Hello! I am your **AI College Comparison Assistant**.\n\n` +
    `I can query the database in real-time to compare institutions side-by-side or find specific metrics. Try asking me:\n\n` +
    `- *"Compare IIT Bombay and BITS Pilani"*\n` +
    `- *"Which college has the highest package?"*\n` +
    `- *"Tell me about IIT Delhi"*\n` +
    `- *"Which college has the lowest fees?"*\n\n` +
    `How can I help guide your academic discovery today?`
  );
}
