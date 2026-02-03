import { StocksTable } from "@/components/stocks/stocks-table"
// import { StocksFilters } from "@/components/stocks/stocks-filters"
import { MarketStats } from "@/components/stocks/market-stats"
import { SectorBreakdown } from "@/components/stocks/sector-breakdown"
import { StockChart } from "@/components/stocks/stock-chart"
import { WatchlistWidget } from "@/components/stocks/watchlist-widget"
import { MarketNews } from "@/components/stocks/market-news"

export default function StocksPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Stocks</h1>
          <p className="text-sm md:text-base text-muted-foreground">Browse and analyze stock market data</p>
        </div>
      </div>

      {/* Market Stats */}
      {/* <MarketStats /> */}

      {/* Chart and Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <StockChart />
        </div>
        <SectorBreakdown />
      </div>

      {/* Stocks Table - Full Width */}
      <div>
        <StocksTable />
      </div>

      {/* Watchlist and Market News Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <WatchlistWidget />
        <MarketNews />
      </div>
    </div>
  )
}