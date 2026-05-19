"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Concert } from "@/lib/types";
import {
  costPerHour,
  formatCurrency,
  formatNumber,
  funPointsPer100,
  totalCost,
} from "@/lib/calculations";
import {
  DollarSign,
  Gauge,
  Music,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function DashboardStats({ concerts }: { concerts: Concert[] }) {
  const reduceMotion = useReducedMotion();
  if (concerts.length === 0) return null;

  const totals = concerts.map((c) => totalCost(c));
  const totalSpent = totals.reduce((a, b) => a + b, 0);
  const avgCost = totalSpent / concerts.length;
  const avgFun = concerts.reduce((sum, c) => sum + c.fun_rating, 0) / concerts.length;

  const hourlyValues = concerts
    .map((c) => costPerHour(c))
    .filter((v): v is number => v !== null);
  const avgCostPerHour =
    hourlyValues.length > 0
      ? hourlyValues.reduce((a, b) => a + b, 0) / hourlyValues.length
      : null;

  const withFunScore = concerts.map((c) => ({
    concert: c,
    score: funPointsPer100(c),
    total: totalCost(c),
  }));

  const bestValue = [...withFunScore].sort((a, b) => b.score - a.score)[0];
  const mostExpensive = [...withFunScore].sort((a, b) => b.total - a.total)[0];
  const highestFun = [...concerts].sort((a, b) => b.fun_rating - a.fun_rating)[0];

  const stats = [
    { title: "Total concerts", value: String(concerts.length), icon: Music, desc: "Shows logged" },
    { title: "Total spent", value: formatCurrency(totalSpent), icon: Wallet, desc: "All concerts" },
    { title: "Avg cost / concert", value: formatCurrency(avgCost), icon: DollarSign, desc: "Per show" },
    { title: "Avg fun rating", value: formatNumber(avgFun, 1), icon: Star, desc: "Out of 10" },
    {
      title: "Avg cost / hour",
      value: avgCostPerHour === null ? "—" : formatCurrency(avgCostPerHour),
      icon: Gauge,
      desc: "Across events",
    },
    {
      title: "Best value",
      value: bestValue.concert.concert_name,
      icon: TrendingUp,
      desc: `${formatNumber(bestValue.score, 2)} Fun Pts / $100`,
    },
    {
      title: "Most expensive",
      value: mostExpensive.concert.concert_name,
      icon: DollarSign,
      desc: formatCurrency(mostExpensive.total),
    },
    {
      title: "Highest fun",
      value: highestFun.concert_name,
      icon: Sparkles,
      desc: `${highestFun.fun_rating}/10`,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(({ title, value, icon: Icon, desc }, index) => {
        const Card = reduceMotion ? "div" : motion.div;
        return (
          <Card
            key={title}
            {...(!reduceMotion && {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05, duration: 0.25 },
            })}
            className="stat card-elevated rounded-2xl !p-4"
          >
            <div className="stat-figure text-primary opacity-90">
              <Icon className="h-5 w-5" />
            </div>
            <div className="stat-title text-xs">{title}</div>
            <div className="stat-value text-base sm:text-lg truncate" title={value}>
              {value}
            </div>
            <div className="stat-desc text-xs">{desc}</div>
          </Card>
        );
      })}
    </div>
  );
}
