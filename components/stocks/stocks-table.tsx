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
import { Star, StarOff, ChevronLeft, ChevronRight, MoreHorizontal, ShoppingCart, Eye, Download } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Symbol: string
  CurrentPrice: number
  Sector: string
  MarketCap: number
  PE_Ratio: number
  Volume: number
  LastUpdated: string
}

interface StocksTableProps {
  stocks: MarketStock[]
  onRefresh: () => void
}

export function StocksTable({ stocks, onRefresh }: StocksTableProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [currentPage, setCurrentPage] = useState(1)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<MarketStock | null>(null)
  const [buyQuantity, setBuyQuantity] = useState("")
  const [buyTimePeriod, setBuyTimePeriod] = useState("today")
  const [user, setUser] = useState<any>(null)
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(stocks.length / itemsPerPage)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const toggleWatchlist = (stock: MarketStock) => {
    if (isInWatchlist(stock.Symbol)) {
      removeFromWatchlist(stock.Symbol)
    } else {
      addToWatchlist({
        symbol: stock.Symbol,
        name: stock.Symbol.replace('.NS', ''),
        price: stock.CurrentPrice,
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

  const handleBuyStock = (stock: MarketStock) => {
    setSelectedStock(stock)
    setBuyDialogOpen(true)
    setBuyQuantity("")
  }

  // Added Download Functionality
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stocks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "market_stocks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const confirmBuyStock = async () => {
    if (!selectedStock || !user || !buyQuantity) return

    const quantity = Number(buyQuantity)
    if (quantity <= 0) return

    const totalCost = selectedStock.CurrentPrice * quantity

    try {
      // Fetch wallet to deduct balance
      const walletsResponse = await axios.get("http://localhost:8080/api/wallets")
      if (walletsResponse.data.length > 0) {
        const wallet = walletsResponse.data[0]
        const newBalance = Number(wallet.balance) - totalCost

        if (newBalance < 0) {
          alert("Insufficient wallet balance!")
          return
        }

        // Update wallet balance
        await axios.put(`http://localhost:8080/api/wallets/${wallet.id}`, {
          ...wallet,
          balance: newBalance
        })
      }

      // Create holding
      await axios.post("http://localhost:8080/api/holdings", {
        user: { id: user.id },
        symbol: selectedStock.Symbol,
        companyName: selectedStock.Symbol.replace('.NS', ''),
        sector: selectedStock.Sector,
        currentPrice: selectedStock.CurrentPrice,
        acquiredPrice: selectedStock.CurrentPrice,
        timePeriod: buyTimePeriod,
        quantity: quantity,
        totalInvested: totalCost,
        acquiredDate: new Date().toISOString().split('T')[0]
      })

      // Create transaction
      await axios.post("http://localhost:8080/api/transactions", {
        user: { id: user.id },
        symbol: selectedStock.Symbol,
        transactionType: "BUY",
        quantity: quantity,
        price: selectedStock.CurrentPrice,
        totalAmount: totalCost,
        transactionDate: new Date().toISOString()
      })

      setBuyDialogOpen(false)
      alert("Stock purchased successfully!")
    } catch (error) {
      console.error("Error buying stock:", error)
      alert("Failed to purchase stock")
    }
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
            <div className="flex flex-col">
              <CardTitle className="text-base md:text-lg font-semibold text-foreground">All Stocks</CardTitle>
              <span className="text-xs md:text-sm text-muted-foreground">{stocks.length} stocks</span>
            </div>
            {/* Added Download Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 text-xs"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              Download Data
            </Button>
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
                  <TableRow key={stock.Symbol} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleWatchlist(stock)}
                      >
                        {isInWatchlist(stock.Symbol) ? (
                          <Star className="w-4 h-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{stock.Symbol.replace('.NS', '')}</p>
                        <p className="text-sm text-muted-foreground">{stock.LastUpdated}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {stock.Sector || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatINR(stock.CurrentPrice)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.Volume ? stock.Volume.toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.MarketCap ? `Rs. ${(stock.MarketCap / 10000000).toFixed(2)}L Cr` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.PE_Ratio ? Number(stock.PE_Ratio).toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBuyStock(stock)}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Stock
                          </DropdownMenuItem>
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
            <DialogTitle>{selectedStock?.Symbol.replace('.NS', '')}</DialogTitle>
            <DialogDescription>
              {selectedStock?.Symbol} - {selectedStock?.Sector || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.CurrentPrice ? formatINR(selectedStock.CurrentPrice) : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.LastUpdated || 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">P/E Ratio</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.PE_Ratio ? selectedStock.PE_Ratio.toFixed(2) : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedStock?.Volume ? selectedStock.Volume.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-medium text-lg">
                  {selectedStock?.MarketCap ? `Rs. ${(selectedStock.MarketCap / 10000000).toFixed(2)}L Cr` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Stock Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {selectedStock?.Symbol.replace('.NS', '')}</DialogTitle>
            <DialogDescription>
              Enter the quantity and time period for your purchase
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Price</Label>
              <div className="text-2xl font-bold text-foreground">
                {selectedStock ? formatINR(selectedStock.CurrentPrice) : 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(e.target.value)}
              />
            </div>
            {buyQuantity && Number(buyQuantity) > 0 && selectedStock && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-semibold">{formatINR(selectedStock.CurrentPrice * Number(buyQuantity))}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmBuyStock} 
              disabled={!buyQuantity || Number(buyQuantity) <= 0}
              className="bg-accent hover:bg-accent/90"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}