import type { ConcertCosts } from "./types";

export function getCostValues(concert: ConcertCosts): number[] {
  return [
    concert.ticket_cost,
    concert.ticket_fees,
    concert.parking_cost,
    concert.food_drink_cost,
    concert.merchandise_cost,
    concert.lodging_cost,
    concert.travel_cost,
    concert.other_cost,
  ];
}

export function totalCost(concert: ConcertCosts): number {
  return getCostValues(concert).reduce((sum, value) => sum + Number(value || 0), 0);
}

export function costPerHour(
  concert: ConcertCosts & { hours_at_event: number }
): number | null {
  const hours = Number(concert.hours_at_event);
  if (!hours || hours <= 0) return null;
  return totalCost(concert) / hours;
}

export function funPointsPer100(
  concert: ConcertCosts & { fun_rating: number }
): number {
  const total = totalCost(concert);
  if (total <= 0) return 0;
  return (concert.fun_rating / total) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateLabel(label: string, max = 18): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}

export function topCostCategories(concert: ConcertCosts, limit = 3): string[] {
  const ranked = [
    { label: "Tickets", amount: Number(concert.ticket_cost) + Number(concert.ticket_fees) },
    { label: "Parking", amount: Number(concert.parking_cost) },
    { label: "Food & drink", amount: Number(concert.food_drink_cost) },
    { label: "Merchandise", amount: Number(concert.merchandise_cost) },
    { label: "Lodging", amount: Number(concert.lodging_cost) },
    { label: "Travel", amount: Number(concert.travel_cost) },
    { label: "Other", amount: Number(concert.other_cost) },
  ]
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return ranked.slice(0, limit).map((item) => item.label);
}
