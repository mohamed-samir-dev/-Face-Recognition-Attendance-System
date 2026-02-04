/**
 * Formats decimal hours into a readable time format
 * @param hours - Decimal hours (e.g., 1.5 = 1 hour 30 minutes)
 * @returns Formatted string (e.g., "1h 30m" or "0h 45m")
 */
export function formatHoursToReadable(hours: number): string {
  if (hours === 0) return "0h";
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  }
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}

/**
 * Formats decimal hours into a compact format for cards
 * @param hours - Decimal hours
 * @returns Formatted string optimized for card display
 */
export function formatHoursForCard(hours: number): string {
  if (hours === 0) return "0h";
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  // For very small amounts, show just minutes
  if (wholeHours === 0 && minutes > 0) {
    return `${minutes}m`;
  }
  
  // For whole hours, show just hours
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  // For mixed, show both but keep it compact
  return `${wholeHours}h ${minutes}m`;
}