"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";

export const DEFAULT_DATE_RANGE = {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
} as DateRange;

export function useDateRange() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(DEFAULT_DATE_RANGE);

    return {
        dateRange,
        setDateRange,
    };
}
