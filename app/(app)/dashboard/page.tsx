import BudgetVsActualDashboard from "@/components/BudgetVsActualDashboard";
import CategoryDashboard from "@/components/CategoryDashboard";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardStats from "@/components/DashboardStats";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SpendingSummary from "@/components/SpendingSummary";
import { getUserConcerts } from "@/lib/concerts";

export default async function DashboardPage() {
  const concerts = await getUserConcerts();

  return (
    <div className="section-gap">
      <PageHeader
        title="Dashboard"
        description="See how much you have spent and which concerts were the best value."
      />

      <SpendingSummary concerts={concerts} />

      <BudgetVsActualDashboard concerts={concerts} />

      <CategoryDashboard concerts={concerts} />

      {concerts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DashboardStats concerts={concerts} />
          <section>
            <h2 className="text-xl font-semibold mb-4 [font-family:var(--font-jakarta)]">
              Charts
            </h2>
            <DashboardCharts concerts={concerts} />
          </section>
        </>
      )}
    </div>
  );
}
