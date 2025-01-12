export function getLastWeekRange(): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate };
}

export function getLastMonthRange(): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    return { startDate, endDate };
}

export function getLastYearRange(): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    return { startDate, endDate };
}

export function formatDateRange(startDate: Date, endDate: Date): string {
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}
