import { InvestmentStats } from "@/components/investments/investment-stats"
import { InvestmentAllocation } from "@/components/investments/investment-allocation"
import { WalletCards } from "@/components/investments/wallet-cards"
import { PersonalGoals } from "@/components/investments/personal-goals"
import { InvestmentBreakdown } from "@/components/investments/investment-breakdown"

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Investments</h1>
        <p className="text-muted-foreground">Portfolio overview and asset management</p>
      </div>

      <InvestmentStats />
      
      <WalletCards />

      {/* Side-by-Side Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <InvestmentAllocation />
        <PersonalGoals />
      </div>

      <InvestmentBreakdown />
    </div>
  )
}