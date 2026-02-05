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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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

  const handleDownload = () => {
    const doc = new jsPDF()
    
    // Helper function to format currency
    const formatCurrency = (value: number) => {
      return value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    // Helper function to format large numbers
    const formatNumber = (value: number) => {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)}B`
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)}M`
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(2)}K`
      }
      return value.toLocaleString('en-IN')
    }

    const date = new Date().toLocaleDateString('en-IN')
    const time = new Date().toLocaleTimeString('en-IN')

    // Title
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text('Market Stocks Report', 14, 20)

    // User Information
    if (user) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || 'N/A'
      doc.text(`Generated for: ${fullName}`, 14, 28)
      doc.text(`Email: ${user.email || 'N/A'}`, 14, 33)
      doc.text(`User ID: ${user.id || 'N/A'}`, 14, 38)
      doc.setTextColor(0, 0, 0)
    }

    // Date and Time
    doc.setFontSize(10)
    doc.text(`Generated on: ${date} at ${time}`, 14, user ? 45 : 28)

    // Market Summary
    const totalStocks = stocks.length
    const avgPrice = stocks.reduce((sum, s) => sum + s.CurrentPrice, 0) / totalStocks
    const totalVolume = stocks.reduce((sum, s) => sum + s.Volume, 0)
    const avgPE = stocks.reduce((sum, s) => sum + (s.PE_Ratio || 0), 0) / totalStocks

    autoTable(doc, {
      startY: user ? 50 : 33,
      
    })

    // Stocks Table
    const tableData = stocks.map(stock => [
      stock.Symbol,
      `Rs. ${formatCurrency(stock.CurrentPrice)}`,
      stock.Sector || 'N/A',
      formatNumber(stock.MarketCap),
      stock.PE_Ratio ? Number(stock.PE_Ratio).toFixed(2) : 'N/A',
      formatNumber(stock.Volume),
    ])

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Symbol', 'Current Price', 'Sector', 'Market Cap', 'P/E Ratio', 'Volume']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [79, 70, 229],
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 30 },
        3: { cellWidth: 28, halign: 'right' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 25, halign: 'right' },
      },
    })

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    doc.save(`Market_Stocks_Report_${date.replace(/\//g, '-')}.pdf`)
  }

  const confirmBuyStock = async () => {
    if (!selectedStock || !user || !buyQuantity) return

    const quantity = Number(buyQuantity)
    if (quantity <= 0) return

    const totalCost = selectedStock.CurrentPrice * quantity

    try {
      const walletsResponse = await axios.get("http://localhost:8080/api/wallets")
      if (walletsResponse.data.length > 0) {
        const wallet = walletsResponse.data[0]
        const newBalance = Number(wallet.balance) - totalCost

        if (newBalance < 0) {
          alert("Insufficient wallet balance!")
          return
        }

        await axios.put(`http://localhost:8080/api/wallets/${wallet.id}`, {
          ...wallet,
          balance: newBalance
        })
      }
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