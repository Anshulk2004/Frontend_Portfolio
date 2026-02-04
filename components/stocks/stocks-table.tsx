"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star, StarOff, ChevronLeft, ChevronRight, MoreHorizontal, ShoppingCart, Eye } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWatchlist } from "@/contexts/watchlist-context"

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

interface StocksTableProps {
  stocks: MarketStock[]
  onRefresh: () => void
}

export function StocksTable({ stocks, onRefresh }: StocksTableProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [currentPage, setCurrentPage] = useState(1)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<MarketStock | null>(null)
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(stocks.length / itemsPerPage)

  const toggleWatchlist = (stock: MarketStock) => {
    if (isInWatchlist(stock.symbol)) {
      removeFromWatchlist(stock.symbol)
    } else {
      addToWatchlist({
        symbol: stock.symbol,
        name: stock.companyName,
        price: 0, // Price not available in MarketStock, watchlist will fetch later
        change: 0
      })
    }
  }

  const paginatedStocks = stocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewMore = (stock: MarketStock) => {
    setSelectedStock(stock)
    setViewDialogOpen(true)
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">All Stocks</CardTitle>
            <span className="text-xs md:text-sm text-muted-foreground">{stocks.length} stocks</span>
          </div>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                  <TableHead className="text-muted-foreground">Symbol</TableHead>
                  <TableHead className="text-muted-foreground">Sector</TableHead>
                  <TableHead className="text-muted-foreground text-right">Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">Volume</TableHead>
                  <TableHead className="text-muted-foreground text-right">Market Cap</TableHead>
                  <TableHead className="text-muted-foreground text-right">P/E</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStocks.map((stock) => (
                  <TableRow key={stock.symbol} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleWatchlist(stock)}
                      >
                        {isInWatchlist(stock.symbol) ? (
                          <Star className="w-4 h-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{stock.symbol.replace('.NS', '')}</p>
                        <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {stock.sector || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      -
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.volume ? stock.volume.toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.marketCap ? `Rs. ${(stock.marketCap / 10000000).toFixed(2)}L Cr` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMore(stock)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-3 md:px-0">
            <p className="text-xs md:text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, stocks.length)} of {stocks.length}
            </p>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 text-xs md:text-sm ${currentPage === i + 1 ? "bg-accent text-accent-foreground" : "bg-transparent"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStock?.companyName}</DialogTitle>
            <DialogDescription>
              {selectedStock?.symbol} - {selectedStock?.sector || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">52W High</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.high52Week ? formatINR(Number(selectedStock.high52Week)) : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">52W Low</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.low52Week ? formatINR(Number(selectedStock.low52Week)) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">P/E Ratio</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.peRatio ? Number(selectedStock.peRatio).toFixed(2) : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Dividend Yield</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.dividends ? `${Number(selectedStock.dividends).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{selectedStock?.volume ? selectedStock.volume.toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-medium">
                  {selectedStock?.marketCap ? `Rs. ${(selectedStock.marketCap / 10000000).toFixed(2)}L Cr` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}