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
import { Star, StarOff, ChevronLeft, ChevronRight, MoreHorizontal, ShoppingCart, Eye, Plus, Minus } from "lucide-react"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWatchlist } from "@/contexts/watchlist-context"

interface Stock {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  volume: string
  marketCap: string
  pe: number
  openPrice: number
  closePrice: number
}

const stocks: Stock[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Oil & Gas", price: 2485.75, change: 1.33, volume: "8.2M", marketCap: "Rs. 16.8L Cr", pe: 28.5, openPrice: 2465.00, closePrice: 2478.50 },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT Services", price: 3892.40, change: -1.15, volume: "2.4M", marketCap: "Rs. 14.2L Cr", pe: 32.1, openPrice: 3920.00, closePrice: 3905.80 },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking", price: 1678.90, change: 1.13, volume: "5.8M", marketCap: "Rs. 12.8L Cr", pe: 19.8, openPrice: 1665.00, closePrice: 1672.30 },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT Services", price: 1542.35, change: -1.46, volume: "6.2M", marketCap: "Rs. 6.4L Cr", pe: 24.5, openPrice: 1560.00, closePrice: 1555.20 },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking", price: 1125.60, change: 1.39, volume: "9.8M", marketCap: "Rs. 7.9L Cr", pe: 18.2, openPrice: 1112.00, closePrice: 1118.40 },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom", price: 1456.25, change: 2.02, volume: "4.5M", marketCap: "Rs. 8.7L Cr", pe: 42.3, openPrice: 1430.00, closePrice: 1445.80 },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking", price: 825.40, change: 0.85, volume: "12.5M", marketCap: "Rs. 7.4L Cr", pe: 11.2, openPrice: 820.00, closePrice: 822.50 },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking", price: 1842.75, change: -0.92, volume: "1.8M", marketCap: "Rs. 3.7L Cr", pe: 22.8, openPrice: 1855.00, closePrice: 1850.20 },
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure", price: 3425.60, change: 1.75, volume: "1.2M", marketCap: "Rs. 4.7L Cr", pe: 35.6, openPrice: 3380.00, closePrice: 3400.40 },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT Services", price: 485.20, change: -2.15, volume: "5.6M", marketCap: "Rs. 2.5L Cr", pe: 18.5, openPrice: 495.00, closePrice: 492.30 },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto", price: 985.40, change: 3.25, volume: "15.2M", marketCap: "Rs. 3.6L Cr", pe: 8.5, openPrice: 958.00, closePrice: 972.50 },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto", price: 12450.80, change: 0.95, volume: "0.8M", marketCap: "Rs. 3.9L Cr", pe: 28.2, openPrice: 12380.00, closePrice: 12420.60 },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate", price: 2845.75, change: 4.52, volume: "3.5M", marketCap: "Rs. 3.2L Cr", pe: 85.4, openPrice: 2750.00, closePrice: 2780.20 },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma", price: 1685.40, change: 1.28, volume: "2.1M", marketCap: "Rs. 4.0L Cr", pe: 35.2, openPrice: 1668.00, closePrice: 1675.80 },
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Consumer", price: 3542.60, change: -0.75, volume: "1.5M", marketCap: "Rs. 3.1L Cr", pe: 82.5, openPrice: 3565.00, closePrice: 3558.20 },
]

export function StocksTable() {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [currentPage, setCurrentPage] = useState(1)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [buyQuantity, setBuyQuantity] = useState("")
  
  const itemsPerPage = 5
  const totalPages = Math.ceil(stocks.length / itemsPerPage)

  const toggleWatchlist = (stock: Stock) => {
    if (isInWatchlist(stock.symbol)) {
      removeFromWatchlist(stock.symbol)
    } else {
      addToWatchlist({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change
      })
    }
  }

  const paginatedStocks = stocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleBuy = (stock: Stock) => {
    setSelectedStock(stock)
    setBuyQuantity("")
    setBuyDialogOpen(true)
  }

  const handleViewMore = (stock: Stock) => {
    setSelectedStock(stock)
    setViewDialogOpen(true)
  }

  const confirmBuy = () => {
    setBuyDialogOpen(false)
    setBuyQuantity("")
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
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {stock.sector}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatINR(stock.price)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{stock.volume}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{stock.marketCap}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{stock.pe}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBuy(stock)}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewMore(stock)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View More
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

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy - {selectedStock?.name}</DialogTitle>
            <DialogDescription>
              Enter the number of shares you want to purchase for {selectedStock?.symbol.replace('.NS', '')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-medium">{selectedStock && formatINR(selectedStock.price)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Today's Change</p>
                <p className={`font-medium ${selectedStock && selectedStock.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {selectedStock && (selectedStock.change >= 0 ? "+" : "")}{selectedStock?.change}%
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyQty">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setBuyQuantity(prev => String(Math.max(0, parseInt(prev || "0") - 1)))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="buyQty"
                  type="number"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="text-center"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setBuyQuantity(prev => String(parseInt(prev || "0") + 1))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {buyQuantity && parseInt(buyQuantity) > 0 && selectedStock && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-lg font-bold">{formatINR(parseInt(buyQuantity) * selectedStock.price)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmBuy}
              disabled={!buyQuantity || parseInt(buyQuantity) <= 0}
              className="bg-accent text-accent-foreground"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View More Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStock?.name}</DialogTitle>
            <DialogDescription>
              {selectedStock?.symbol} - {selectedStock?.sector}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Opening Price</p>
                <p className="text-xl font-bold text-foreground">{selectedStock && formatINR(selectedStock.openPrice)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Closing Price</p>
                <p className="text-xl font-bold text-foreground">{selectedStock && formatINR(selectedStock.closePrice)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold text-foreground">{selectedStock && formatINR(selectedStock.price)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Day Change</p>
                <p className={`text-xl font-bold ${selectedStock && selectedStock.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {selectedStock && (selectedStock.change >= 0 ? "+" : "")}{selectedStock?.change}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{selectedStock?.volume}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-medium">{selectedStock?.marketCap}</p>
              </div>
              <div>
                <p className="text-muted-foreground">P/E Ratio</p>
                <p className="font-medium">{selectedStock?.pe}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button 
              onClick={() => {
                setViewDialogOpen(false)
                if (selectedStock) handleBuy(selectedStock)
              }}
              className="bg-accent text-accent-foreground"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}