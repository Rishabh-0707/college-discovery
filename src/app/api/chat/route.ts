import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatFees, formatPackage } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage.content.toLowerCase();

    // 1. Fetch all colleges to perform semantic matching
    const allColleges = await prisma.college.findMany({
      select: { id: true, name: true, slug: true, location: true, state: true }
    });

    // 2. Identify which colleges are referenced in the query
    const matchedCollegesList = allColleges.filter(c => {
      const slugClean = c.slug.replace('-', ' ');
      return userQuery.includes(c.slug) || 
             userQuery.includes(slugClean) || 
             userQuery.includes(c.name.toLowerCase()) || 
             userQuery.includes(c.location.toLowerCase());
    });

    let reply = '';

    // 3. Perform dynamic query handling based on database searches
    if (matchedCollegesList.length > 0) {
      // Fetch full details of the matched colleges
      const colleges = await prisma.college.findMany({
        where: { id: { in: matchedCollegesList.map(c => c.id) } },
        include: {
          courses: { orderBy: { feesPerYear: 'desc' } },
          placements: { orderBy: { year: 'desc' } }
        }
      });

      if (colleges.length === 1) {
        const col = colleges[0];
        const placement = col.placements[0];
        reply = `### Overview of ${col.name}\n` +
                `Located in **${col.location}, ${col.state}**, ${col.name} is an established **${col.type}** institution founded in **${col.established}**.\n\n` +
                `#### Key Metrics:\n` +
                `- **Rating:** ⭐ ${col.rating} (${col.totalReviews} reviews)\n` +
                `- **Accreditation:** ${col.accreditation || 'N/A'}\n` +
                `- **Fees Range:** ${formatFees(col.feesMin)} - ${formatFees(col.feesMax)} per year\n` +
                `- **Average Placement:** ${placement ? formatPackage(placement.avgPackage) : 'N/A'}\n` +
                `- **Highest Package:** ${placement ? formatPackage(placement.highestPackage) : 'N/A'}\n` +
                `- **Exams Accepted:** ${col.examAccepted.join(', ')}\n\n` +
                `#### Courses Available:\n` +
                col.courses.slice(0, 3).map(c => `- **${c.name} (${c.degree}):** ${formatFees(c.feesPerYear)}/yr (${c.totalSeats} seats)`).join('\n') + '\n\n' +
                `Would you like to compare ${col.name} with another college, say BITS Pilani or IIT Delhi?`;
      } else {
        // Multi-college comparison!
        reply = `### 📊 College Comparison Report\n` +
                `Here is a side-by-side analysis of the **${colleges.length} colleges** you requested:\n\n` +
                `| Metric | ` + colleges.map(c => c.name.split(' ').slice(0, 3).join(' ')).join(' | ') + ` |\n` +
                `| :--- | ` + colleges.map(() => ':---:').join(' | ') + ` |\n` +
                `| **Type** | ` + colleges.map(c => c.type).join(' | ') + ` |\n` +
                `| **Location** | ` + colleges.map(c => `${c.location}, ${c.state}`).join(' | ') + ` |\n` +
                `| **Established** | ` + colleges.map(c => c.established).join(' | ') + ` |\n` +
                `| **Rating** | ` + colleges.map(c => `⭐ ${c.rating}`).join(' | ') + ` |\n` +
                `| **Avg Package** | ` + colleges.map(c => c.placements[0] ? formatPackage(c.placements[0].avgPackage) : 'N/A').join(' | ') + ` |\n` +
                `| **Highest Package** | ` + colleges.map(c => c.placements[0] ? formatPackage(c.placements[0].highestPackage) : 'N/A').join(' | ') + ` |\n` +
                `| **Fees Range** | ` + colleges.map(c => `${formatFees(c.feesMin)} - ${formatFees(c.feesMax)}`).join(' | ') + ` |\n\n` +
                `### 💡 Key Comparative Insights:\n\n`;

        // Add automatic comparative notes
        const sortedByPackage = [...colleges].sort((a, b) => {
          const aPkg = a.placements[0]?.avgPackage || 0;
          const bPkg = b.placements[0]?.avgPackage || 0;
          return bPkg - aPkg;
        });

        const sortedByFees = [...colleges].sort((a, b) => a.feesMin - b.feesMin);

        reply += `1. **Placements:** **${sortedByPackage[0].name}** leads in placements with an average package of **${formatPackage(sortedByPackage[0].placements[0]?.avgPackage || 0)}**, followed by **${sortedByPackage[1]?.name || 'others'}**.\n`;
        reply += `2. **Affordability:** **${sortedByFees[0].name}** is the most affordable starting at **${formatFees(sortedByFees[0].feesMin)}/yr**, while **${sortedByFees[sortedByFees.length - 1].name}** has the highest fee structure.\n\n`;
        reply += `Which specific features (e.g. course intake, cutoffs, or student reviews) would you like to explore further?`;
      }
    } else if (userQuery.includes('highest package') || userQuery.includes('best placement') || userQuery.includes('highest salary')) {
      const topPlacement = await prisma.placement.findFirst({
        orderBy: { highestPackage: 'desc' },
        include: { college: true }
      });
      if (topPlacement) {
        reply = `### 🏆 Top Placement Record\n` +
                `**${topPlacement.college.name}** holds the highest package record in our database:\n\n` +
                `- **Highest Package:** ${formatPackage(topPlacement.highestPackage)}\n` +
                `- **Average Package:** ${formatPackage(topPlacement.avgPackage)}\n` +
                `- **Placement Rate:** ${topPlacement.placementRate}%\n` +
                `- **Top Recruiters:** ${topPlacement.topCompanies.slice(0, 5).join(', ')}\n\n` +
                `Would you like to compare **${topPlacement.college.name}** with another engineering institute?`;
      }
    } else if (userQuery.includes('cheapest') || userQuery.includes('lowest fee') || userQuery.includes('affordable')) {
      const cheapest = await prisma.college.findFirst({
        orderBy: { feesMin: 'asc' }
      });
      if (cheapest) {
        reply = `### 💸 Most Affordable College\n` +
                `**${cheapest.name}** offers the most cost-effective tuition fees in our records:\n\n` +
                `- **Minimum Fees:** ${formatFees(cheapest.feesMin)} per year\n` +
                `- **Maximum Fees:** ${formatFees(cheapest.feesMax)} per year\n` +
                `- **Type:** ${cheapest.type} (Government/Public universities generally offer highly subsidized fees)\n` +
                `- **Location:** ${cheapest.location}, ${cheapest.state}\n\n` +
                `Would you like to see the placement metrics for ${cheapest.name} to evaluate its Return on Investment (ROI)?`;
      }
    } else if (userQuery.includes('highest rating') || userQuery.includes('best college') || userQuery.includes('top rated')) {
      const topRated = await prisma.college.findFirst({
        orderBy: { rating: 'desc' }
      });
      if (topRated) {
        reply = `### ⭐ Top-Rated Institution\n` +
                `**${topRated.name}** is currently the highest-rated college based on verified student reviews:\n\n` +
                `- **Rating:** ⭐ ${topRated.rating} out of 5.0\n` +
                `- **Total Reviews:** ${topRated.totalReviews} reviews\n` +
                `- **Accreditation:** ${topRated.accreditation || 'N/A'}\n` +
                `- **Location:** ${topRated.location}, ${topRated.state}\n\n` +
                `Would you like to read about the courses available at **${topRated.name}**?`;
      }
    } else {
      // General help and guidance response
      reply = `👋 Hello! I am your **AI College Comparison Assistant**.\n\n` +
              `I can query the database in real-time to compare institutions side-by-side or find specific metrics. Try asking me:\n\n` +
              `- *"Compare IIT Bombay and BITS Pilani"* \n` +
              `- *"Which college has the highest package?"* \n` +
              `- *"Tell me about IIT Delhi"* \n` +
              `- *"Which college has the lowest fees?"*\n\n` +
              `How can I help guide your academic discovery today?`;
    }

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
