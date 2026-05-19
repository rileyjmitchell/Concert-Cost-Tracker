"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Concert } from "@/lib/types";
import {
  costPerHour,
  formatCurrency,
  formatDate,
  formatNumber,
  funPointsPer100,
  topCostCategories,
  totalCost,
} from "@/lib/calculations";
import BudgetStatus from "@/components/BudgetStatus";
import ConcertCardActions from "@/components/ConcertCardActions";
import { MapPin, Star } from "lucide-react";

function funAccentClass(rating: number): string {
  if (rating >= 8) return "border-l-4 border-l-success";
  if (rating >= 5) return "border-l-4 border-l-warning";
  return "border-l-4 border-l-error/70";
}

export default function ConcertCard({
  concert,
  index = 0,
}: {
  concert: Concert;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();
  const total = totalCost(concert);
  const perHour = costPerHour(concert);
  const funPer100 = funPointsPer100(concert);
  const categories = topCostCategories(concert);

  const Wrapper = reduceMotion ? "article" : motion.article;

  return (
    <Wrapper
      {...(!reduceMotion && {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.06 },
        whileHover: { y: -2 },
      })}
      className={`card card-elevated hover:-translate-y-0.5 ${funAccentClass(concert.fun_rating)}`}
    >
      <div className="card-body gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 className="card-title text-xl [font-family:var(--font-jakarta)]">
              {concert.concert_name}
            </h2>
            <p className="text-base-content/70">{concert.artist}</p>
          </div>
          <div className="badge badge-primary badge-lg gap-1 rounded-xl">
            <Star className="h-3.5 w-3.5" />
            {concert.fun_rating}/10
          </div>
        </div>

        <p className="flex items-center gap-1 text-sm text-base-content/80">
          <MapPin className="h-4 w-4 shrink-0" />
          {concert.venue} · {concert.city}, {concert.state} · {formatDate(concert.concert_date)}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Total cost" value={formatCurrency(total)} />
          <Metric
            label="Cost per hour"
            value={perHour === null ? "—" : formatCurrency(perHour)}
          />
          <Metric label="Fun Points per $100" value={formatNumber(funPer100, 2)} />
          <Metric
            label="Distance"
            value={`${formatNumber(Number(concert.distance_from_home), 1)} mi`}
          />
        </div>

        <BudgetStatus concert={concert} />

        <ConcertCardActions concertId={concert.id} />

        {categories.length > 0 && (
          <p className="text-sm">
            <span className="font-medium">Top costs: </span>
            {categories.join(" · ")}
          </p>
        )}

        {concert.notes && (
          <p className="text-sm text-base-content/75 border-t border-base-300 pt-3">
            {concert.notes}
          </p>
        )}
      </div>
    </Wrapper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-base-200/70 rounded-xl p-3">
      <p className="text-xs text-base-content/60">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
