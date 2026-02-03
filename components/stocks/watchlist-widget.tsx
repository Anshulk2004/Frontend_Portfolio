"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, Star } from "lucide-react"
import { useWatchlist } from "@/contexts/watchlist-context"
import { Button } from "@/components/ui/button"

export function WatchlistWidget() {
  const { watchlist, removeFromWatchlist } = useWatchlist()

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">My Watchlist</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {watchlist.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No stocks in watchlist</p>
            <p className="text-xs text-muted-foreground mt-1">Click the star icon on any stock to add it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{stock.symbol.replace('.NS', '')}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="font-medium text-foreground">{formatINR(stock.price)}</p>
                    <p className={`text-sm flex items-center gap-1 justify-end ${
                      stock.change >= 0 ? "text-success" : "text-destructive"
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stock.change >= 0 ? "+" : ""}{stock.change}%
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWatchlist(stock.symbol)}
                  >
                    <Star className="w-4 h-4 fill-warning text-warning" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}