"use client";

import type { CategoryRow } from "@/lib/categoryAnalytics";
import { formatCategorySpending } from "@/lib/categoryAnalytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export default function CategoryDashboardCharts({ rows }: { rows: CategoryRow[] }) {
  if (rows.length === 0) return null;

  const countData = rows.map((row) => ({
    name: row.tag,
    value: row.concertCount,
  }));

  const spendData = rows.map((row) => ({
    name: row.tag,
    value: row.totalSpending,
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="Concerts per category">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={countData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" name="Concerts" radius={[0, 6, 6, 0]}>
              {countData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Spending per category">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={spendData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatCategorySpending(value)} />
            <Bar dataKey="value" name="Spent" radius={[0, 6, 6, 0]}>
              {spendData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="card card-elevated bg-base-100">
      <div className="card-body">
        <h3 className="font-semibold text-sm mb-2">{title}</h3>
        {children}
      </div>
    </article>
  );
}
