"use client";

import type { Concert } from "@/lib/types";
import {
  formatCurrency,
  formatNumber,
  funPointsPer100,
  totalCost,
  truncateLabel,
} from "@/lib/calculations";
import { COST_FIELDS } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
  "#f97316",
  "#84cc16",
];

export default function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) {
    return (
      <p className="text-center text-base-content/70 py-8">
        Add concerts to see your spending and fun charts here.
      </p>
    );
  }

  const categoryData = COST_FIELDS.map(({ key, label }) => ({
    name: label,
    value: concerts.reduce((sum, c) => sum + Number(c[key]), 0),
  })).filter((item) => item.value > 0);

  const concertBars = concerts.map((c) => ({
    name: truncateLabel(c.concert_name),
    fullName: c.concert_name,
    total: totalCost(c),
    fun: c.fun_rating,
    funPer100: funPointsPer100(c),
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <ChartCard title="Spending by cost category">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Total cost by concert">
        <BarChartBlock
          data={concertBars}
          dataKey="total"
          formatter={(v: number) => formatCurrency(v)}
        />
      </ChartCard>

      <ChartCard title="Fun rating by concert">
        <BarChartBlock data={concertBars} dataKey="fun" formatter={(v: number) => String(v)} />
      </ChartCard>

      <ChartCard title="Fun Points per $100 by concert">
        <BarChartBlock
          data={concertBars}
          dataKey="funPer100"
          formatter={(v: number) => formatNumber(v, 2)}
        />
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card card-elevated">
      <div className="card-body">
        <h3 className="card-title text-base [font-family:var(--font-jakarta)]">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function BarChartBlock({
  data,
  dataKey,
  formatter,
}: {
  data: { name: string; fullName: string; [key: string]: string | number }[];
  dataKey: string;
  formatter: (value: number) => string;
}) {
  const minWidth = Math.max(320, data.length * 72);

  return (
    <div className="chart-container overflow-x-auto">
      <div style={{ minWidth }} className="h-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatter(value)}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullName ?? ""
            }
          />
          <Bar
            dataKey={dataKey}
            fill="oklch(var(--p))"
            radius={[8, 8, 0, 0]}
            animationDuration={600}
            animationEasing="ease-out"
          />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
