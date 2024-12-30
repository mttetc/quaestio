export function formatGmailDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function createGmailDateQuery(startDate: Date, endDate: Date): string {
  return `after:${formatGmailDate(startDate)} before:${formatGmailDate(endDate)}`;
}

export function isDateRangeOverlapping(
  range1Start: Date,
  range1End: Date,
  range2Start: Date,
  range2End: Date
): boolean {
  return range1Start <= range2End && range2Start <= range1End;
}

export function getOverlappingDateRanges(
  existingRanges: { startDate: Date; endDate: Date }[],
  newRange: { startDate: Date; endDate: Date }
): { startDate: Date; endDate: Date }[] {
  return existingRanges.filter(range =>
    isDateRangeOverlapping(
      range.startDate,
      range.endDate,
      newRange.startDate,
      newRange.endDate
    )
  );
}