export function getTopCategories(byCategory: Record<string, number>): Array<[string, number]> {
    return Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
}
