import { InvestmentStats } from "@/components/investments/investment-stats"
import { InvestmentAllocation } from "@/components/investments/investment-allocation"
import { WalletCards } from "@/components/investments/wallet-cards"
import { MonthlyReturns } from "@/components/investments/monthly-returns"
import { PersonalGoals } from "@/components/investments/personal-goals"
import { FundingSources } from "@/components/investments/funding-sources"
import { InvestmentBreakdown } from "@/components/investments/investment-breakdown"

export default function InvestmentsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Investments</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your portfolio and track returns</p>
        </div>
      </div>

      {/* Investment Stats */}
      <InvestmentStats />

      {/* Wallets Section */}
      <WalletCards />

      {/* Allocation and Monthly Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <InvestmentAllocation />
        <MonthlyReturns />
      </div>

      {/* Funding Sources and Investment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <FundingSources />
        <InvestmentBreakdown />
      </div>

      {/* Personal Goals */}
      <PersonalGoals />
    </div>
  )
}
