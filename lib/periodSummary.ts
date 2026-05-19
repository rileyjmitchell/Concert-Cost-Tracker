import { formatCurrency, totalCost } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

export type PeriodStats = {
  totalSpent: number;
  concertCount: number;
  averageCostPerConcert: number;
};

export type MonthlyYearlySummary = {
  month: PeriodStats;
  year: PeriodStats;
  monthLabel: string;
  yearLabel: string;
};

/** Safely read year and month (1–12) from a concert date string (YYYY-MM-DD). */
export function parseConcertDateParts(
  dateString: string | null | undefined
): { year: number; month: number } | null {
  if (!dateString || typeof dateString !== "string") return null;

  const trimmed = dateString.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const check = new Date(year, month - 1, day);
  if (
    check.getFullYear() !== year ||
    check.getMonth() !== month - 1 ||
    check.getDate() !== day
  ) {
    return null;
  }

  return { year, month };
}

function isInMonth(
  concert: Concert,
  year: number,
  month: number
): boolean {
  const parts = parseConcertDateParts(concert.concert_date);
  if (!parts) return false;
  return parts.year === year && parts.month === month;
}

function isInYear(concert: Concert, year: number): boolean {
  const parts = parseConcertDateParts(concert.concert_date);
  if (!parts) return false;
  return parts.year === year;
}

function buildPeriodStats(concerts: Concert[]): PeriodStats {
  const totalSpent = concerts.reduce((sum, concert) => {
    const cost = totalCost(concert);
    return sum + (Number.isFinite(cost) ? cost : 0);
  }, 0);

  const concertCount = concerts.length;
  const averageCostPerConcert =
    concertCount > 0 ? totalSpent / concertCount : 0;

  return {
    totalSpent,
    concertCount,
    averageCostPerConcert,
  };
}

/**
 * Summaries for the current calendar month and year (based on concert_date).
 * Concerts with invalid dates are skipped (not counted).
 */
export function getMonthlyYearlySummary(
  concerts: Concert[],
  referenceDate: Date = new Date()
): MonthlyYearlySummary {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;

  const monthConcerts = concerts.filter((c) => isInMonth(c, year, month));
  const yearConcerts = concerts.filter((c) => isInYear(c, year));

  const monthName = referenceDate.toLocaleDateString("en-US", {
    month: "long",
  });

  return {
    month: buildPeriodStats(monthConcerts),
    year: buildPeriodStats(yearConcerts),
    monthLabel: `${monthName} ${year}`,
    yearLabel: String(year),
  };
}

export function formatPeriodCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return formatCurrency(safe);
}
