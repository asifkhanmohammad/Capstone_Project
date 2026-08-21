import { Complaint, ComplaintCategory, RecurringAlert } from '../types';

export function detectRecurringIssues(
  complaints: Complaint[],
  targetCategory?: ComplaintCategory,
  targetLocation?: string,
  timeWindowHours: number = 24
): RecurringAlert[] {
  const now = new Date().getTime();
  const windowMs = timeWindowHours * 60 * 60 * 1000;

  // Filter complaints created within the time window
  const recentComplaints = complaints.filter((c) => {
    const createdTime = new Date(c.created_at).getTime();
    return now - createdTime <= windowMs;
  });

  // Group by location and category
  const clusters: Record<string, { category: ComplaintCategory; location: string; count: number }> = {};

  for (const c of recentComplaints) {
    const normLocation = c.location.trim().toLowerCase();
    const key = `${c.category}::${normLocation}`;

    if (!clusters[key]) {
      clusters[key] = {
        category: c.category,
        location: c.location,
        count: 0,
      };
    }
    clusters[key].count += 1;
  }

  const alerts: RecurringAlert[] = [];

  for (const key in clusters) {
    const cluster = clusters[key];
    // Threshold for recurring detection (2 or more complaints)
    if (cluster.count >= 2) {
      // If target category or location filter is provided, check if it matches
      if (
        (!targetCategory || targetCategory === cluster.category) &&
        (!targetLocation || cluster.location.toLowerCase().includes(targetLocation.trim().toLowerCase()))
      ) {
        const categoryFormatted = cluster.category.replace('_', ' / ').toUpperCase();
        alerts.push({
          category: cluster.category,
          location: cluster.location,
          count: cluster.count,
          timeWindowHours,
          alertMessage: `Recurring Issue Detected: ${cluster.count} ${categoryFormatted} complaints reported from "${cluster.location}" in the last ${timeWindowHours} hours.`,
        });
      }
    }
  }

  return alerts;
}
