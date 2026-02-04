"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

interface MarketStock {
  Symbol: string
  CurrentPrice: number
  Sector: string
  MarketCap: number
  PE_Ratio: number
  Volume: number
  LastUpdated: string
}

interface SectorBreakdownProps {
  stocks: MarketStock[]
  onSectorClick?: (sector: string | null) => void
  selectedSector?: string | null
}

const sectorColors: Record<string, string> = {
  "IT Services": "#4F46E5",
  "Banking": "#10b981",
  "Oil & Gas": "#f59e0b",
  "Auto": "#ef4444",
  "Pharma": "#8b5cf6",
  "FMCG": "#06b6d4",
  "Telecom": "#ec4899",
  "Infrastructure": "#14b8a6",
  "Consumer": "#f97316",
  "Conglomerate": "#6366f1",
}

const getColorForSector = (sector: string, index: number): string => {
  return sectorColors[sector] || `hsl(${(index * 360) / 10}, 70%, 50%)`
}

export function SectorBreakdown({ stocks, onSectorClick, selectedSector }: SectorBreakdownProps) {
  const sectors = useMemo(() => {
    const sectorMap = new Map<string, number>()
    
    stocks.forEach(stock => {
      if (stock.Sector) {
        sectorMap.set(stock.Sector, (sectorMap.get(stock.Sector) || 0) + 1)
      }
    })
    
    return Array.from(sectorMap.entries())
      .map(([name, count], index) => ({
        name,
        count,
        color: getColorForSector(name, index)
      }))
      .sort((a, b) => b.count - a.count)
  }, [stocks])

  const total = sectors.reduce((acc, s) => acc + s.count, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Sector Breakdown</CardTitle>
          {selectedSector && onSectorClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSectorClick(null)}
              className="text-xs"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sectors.map((sector) => (
            <div 
              key={sector.name} 
              className={`space-y-2 ${onSectorClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${
                selectedSector === sector.name ? 'ring-2 ring-primary rounded-lg p-2 -m-2' : ''
              }`}
              onClick={() => onSectorClick && onSectorClick(sector.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{sector.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{sector.count} stocks</span>
                </div>
              </div>
              <Progress
                value={(sector.count / total) * 100}
                className="h-2"
                style={{
                  // @ts-ignore
                  "--progress-background": sector.color,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
