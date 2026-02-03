import { StatsCards } from "@/components/dashboard/stats-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { SectorAllocation } from "@/components/dashboard/sector-allocation"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
// import { QuarterAnalysis } from "@/components/dashboard/quarter-analysis"
import { TopMovers } from "@/components/dashboard/top-movers"

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here&apos;s your portfolio overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <SectorAllocation />
      </div>

      {/* Recent Transactions and Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentTransactions />
        <TopMovers />
      </div>

      {/* Holdings Table - Full Width */}
      <div>
        <HoldingsTable />
      </div>
    </div>
  )
}