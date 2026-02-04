"use client"

import { StocksTable } from "@/components/stocks/stocks-table"
import { SectorBreakdown } from "@/components/stocks/sector-breakdown"
import { StockChart } from "@/components/stocks/stock-chart"
import { WatchlistWidget } from "@/components/stocks/watchlist-widget"
import { MarketNews } from "@/components/stocks/market-news"
import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"

interface MarketStock {
  id: number
  symbol: string
  companyName: string
  sector: string
  marketCap: number
  peRatio: number
  high52Week: number
  low52Week: number
  volume: number
  dividends: number
  lastUpdated: string
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<MarketStock[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  useEffect(() => {
    fetchStocks()
  }, [selectedSector])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const url = selectedSector 
        ? `http://localhost:8080/api/market-stocks?sector=${selectedSector}`
        : "http://localhost:8080/api/market-stocks"
      const response = await axios.get(url)
      setStocks(response.data)
    } catch (error) {
      console.error("Failed to fetch market stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Stocks</h1>
          <p className="text-sm md:text-base text-muted-foreground">Browse and analyze stock market data</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Chart and Sector Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <StockChart stocks={stocks} />
            </div>
            <SectorBreakdown stocks={stocks} onSectorClick={setSelectedSector} selectedSector={selectedSector} />
          </div>

          {/* Stocks Table - Full Width */}
          <div>
            <StocksTable stocks={stocks} onRefresh={fetchStocks} />
          </div>

          {/* Watchlist and Market News Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <WatchlistWidget />
            <MarketNews />
          </div>
        </>
      )}
    </div>
  )
}