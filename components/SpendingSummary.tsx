import type { LucideIcon } from "lucide-react";
import { CalendarDays, CalendarRange, DollarSign, Music2 } from "lucide-react";
import type { Concert } from "@/lib/types";
import type { PeriodStats } from "@/lib/periodSummary";
import {
  formatPeriodCurrency,
  getMonthlyYearlySummary,
} from "@/lib/periodSummary";

export default function SpendingSummary({ concerts }: { concerts: Concert[] }) {
  const summary = getMonthlyYearlySummary(concerts);

  return (
    <section className="space-y-4" aria-labelledby="spending-summary-heading">
      <div>
        <h2
          id="spending-summary-heading"
          className="text-xl font-semibold [font-family:var(--font-jakarta)]"
        >
          Spending summary
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          Totals use each concert&apos;s <strong>concert date</strong> (not
          today&apos;s date). Invalid dates are skipped safely.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PeriodPanel
          title="This month"
          subtitle={summary.monthLabel}
          icon={CalendarDays}
          stats={summary.month}
        />
        <PeriodPanel
          title="This year"
          subtitle={summary.yearLabel}
          icon={CalendarRange}
          stats={summary.year}
        />
      </div>
    </section>
  );
}

function PeriodPanel({
  title,
  subtitle,
  icon: Icon,
  stats,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats: PeriodStats;
}) {
  return (
    <article className="card card-elevated">
      <div className="card-body gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg [font-family:var(--font-jakarta)]">
              {title}
            </h3>
            <p className="text-sm text-base-content/60">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatTile
            label="Total spent"
            value={formatPeriodCurrency(stats.totalSpent)}
            icon={DollarSign}
          />
          <StatTile
            label="Concerts attended"
            value={String(stats.concertCount)}
            icon={Music2}
          />
          <StatTile
            label="Avg cost / concert"
            value={formatPeriodCurrency(stats.averageCostPerConcert)}
            icon={DollarSign}
          />
        </div>
      </div>
    </article>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-base-200/60 rounded-xl p-3 flex flex-col gap-1 min-h-[5.5rem]">
      <div className="flex items-center gap-1.5 text-xs text-base-content/60">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="font-semibold text-base sm:text-lg leading-tight">{value}</p>
    </div>
  );
}
