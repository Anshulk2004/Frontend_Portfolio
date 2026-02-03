// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2, Plus, Minus } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// interface Holding {
//   company: string
//   symbol: string
//   volume: number
//   price: number
//   change: number
//   changePercent: number
//   value: number
//   avgPrice: number
// }

// const initialHoldings: Holding[] = [
//   {
//     company: "Reliance Industries",
//     symbol: "RELIANCE.NS",
//     volume: 50,
//     price: 2485.75,
//     change: 32.50,
//     changePercent: 1.33,
//     value: 124287.50,
//     avgPrice: 2350.00,
//   },
//   {
//     company: "Tata Consultancy Services",
//     symbol: "TCS.NS",
//     volume: 30,
//     price: 3892.40,
//     change: -45.20,
//     changePercent: -1.15,
//     value: 116772.00,
//     avgPrice: 3650.00,
//   },
//   {
//     company: "HDFC Bank",
//     symbol: "HDFCBANK.NS",
//     volume: 75,
//     price: 1678.90,
//     change: 18.75,
//     changePercent: 1.13,
//     value: 125917.50,
//     avgPrice: 1590.00,
//   },
//   {
//     company: "Infosys",
//     symbol: "INFY.NS",
//     volume: 60,
//     price: 1542.35,
//     change: -22.80,
//     changePercent: -1.46,
//     value: 92541.00,
//     avgPrice: 1480.00,
//   },
//   {
//     company: "ICICI Bank",
//     symbol: "ICICIBANK.NS",
//     volume: 100,
//     price: 1125.60,
//     change: 15.40,
//     changePercent: 1.39,
//     value: 112560.00,
//     avgPrice: 1050.00,
//   },
//   {
//     company: "Bharti Airtel",
//     symbol: "BHARTIARTL.NS",
//     volume: 80,
//     price: 1456.25,
//     change: 28.90,
//     changePercent: 2.02,
//     value: 116500.00,
//     avgPrice: 1320.00,
//   },
// ]

// export function HoldingsTable() {
//   const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [sellDialogOpen, setSellDialogOpen] = useState(false)
//   const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
//   const [buyQuantity, setBuyQuantity] = useState("")

//   const handleEdit = (holding: Holding) => {
//     setSelectedHolding(holding)
//     setBuyQuantity("")
//     setEditDialogOpen(true)
//   }

//   const handleSell = (holding: Holding) => {
//     setSelectedHolding(holding)
//     setSellDialogOpen(true)
//   }

//   const confirmBuyMore = () => {
//     if (selectedHolding && buyQuantity) {
//       const qty = parseInt(buyQuantity)
//       if (qty > 0) {
//         setHoldings(prev => prev.map(h => {
//           if (h.symbol === selectedHolding.symbol) {
//             const newVolume = h.volume + qty
//             const newValue = newVolume * h.price
//             return { ...h, volume: newVolume, value: newValue }
//           }
//           return h
//         }))
//       }
//     }
//     setEditDialogOpen(false)
//     setBuyQuantity("")
//   }

//   const confirmSell = () => {
//     if (selectedHolding) {
//       setHoldings(prev => prev.filter(h => h.symbol !== selectedHolding.symbol))
//     }
//     setSellDialogOpen(false)
//   }

//   const formatINR = (value: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(value).replace('₹', 'Rs. ')
//   }

//   return (
//     <>
//       <Card className="bg-card border-border">
//         <CardHeader className="pb-2 px-3 md:px-6">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base md:text-lg font-semibold text-foreground">Holdings</CardTitle>
//             <span className="text-xs md:text-sm text-muted-foreground">{holdings.length} stocks</span>
//           </div>
//         </CardHeader>
//         <CardContent className="px-0 md:px-6">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-border">
//                   <TableHead className="text-muted-foreground">Company</TableHead>
//                   <TableHead className="text-muted-foreground text-right">Qty</TableHead>
//                   <TableHead className="text-muted-foreground text-right">Avg Price</TableHead>
//                   <TableHead className="text-muted-foreground text-right">LTP</TableHead>
//                   <TableHead className="text-muted-foreground text-right">Change</TableHead>
//                   <TableHead className="text-muted-foreground text-right">Value</TableHead>
//                   <TableHead className="text-muted-foreground text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {holdings.map((holding) => (
//                   <TableRow key={holding.symbol} className="border-border">
//                     <TableCell>
//                       <div>
//                         <p className="font-medium text-foreground">{holding.company}</p>
//                         <p className="text-sm text-muted-foreground">{holding.symbol}</p>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right text-foreground">{holding.volume}</TableCell>
//                     <TableCell className="text-right text-foreground">
//                       {formatINR(holding.avgPrice)}
//                     </TableCell>
//                     <TableCell className="text-right text-foreground">
//                       {formatINR(holding.price)}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className={`flex items-center justify-end gap-1 ${
//                         holding.change >= 0 ? "text-success" : "text-destructive"
//                       }`}>
//                         {holding.change >= 0 ? (
//                           <TrendingUp className="w-4 h-4" />
//                         ) : (
//                           <TrendingDown className="w-4 h-4" />
//                         )}
//                         <span>
//                           {holding.change >= 0 ? "+" : ""}
//                           {holding.changePercent.toFixed(2)}%
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right font-medium text-foreground">
//                       {formatINR(holding.value)}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <MoreHorizontal className="w-4 h-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem onClick={() => handleEdit(holding)}>
//                             <Pencil className="w-4 h-4 mr-2" />
//                             Edit (Buy More)
//                           </DropdownMenuItem>
//                           <DropdownMenuItem 
//                             onClick={() => handleSell(holding)}
//                             className="text-destructive"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" />
//                             Sell
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit Dialog - Buy More */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Buy More - {selectedHolding?.company}</DialogTitle>
//             <DialogDescription>
//               Add more shares to your existing position in {selectedHolding?.symbol}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-muted-foreground">Current Qty</p>
//                 <p className="font-medium">{selectedHolding?.volume} shares</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Current Price</p>
//                 <p className="font-medium">{selectedHolding && formatINR(selectedHolding.price)}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Avg Buy Price</p>
//                 <p className="font-medium">{selectedHolding && formatINR(selectedHolding.avgPrice)}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Current Value</p>
//                 <p className="font-medium">{selectedHolding && formatINR(selectedHolding.value)}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="buyQty">Quantity to Buy</Label>
//               <div className="flex items-center gap-2">
//                 <Button 
//                   variant="outline" 
//                   size="icon"
//                   onClick={() => setBuyQuantity(prev => String(Math.max(0, parseInt(prev || "0") - 1)))}
//                 >
//                   <Minus className="w-4 h-4" />
//                 </Button>
//                 <Input
//                   id="buyQty"
//                   type="number"
//                   value={buyQuantity}
//                   onChange={(e) => setBuyQuantity(e.target.value)}
//                   placeholder="Enter quantity"
//                   className="text-center"
//                 />
//                 <Button 
//                   variant="outline" 
//                   size="icon"
//                   onClick={() => setBuyQuantity(prev => String(parseInt(prev || "0") + 1))}
//                 >
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//             {buyQuantity && parseInt(buyQuantity) > 0 && selectedHolding && (
//               <div className="p-3 rounded-lg bg-muted">
//                 <p className="text-sm text-muted-foreground">Estimated Cost</p>
//                 <p className="text-lg font-bold">{formatINR(parseInt(buyQuantity) * selectedHolding.price)}</p>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//             <Button 
//               onClick={confirmBuyMore}
//               disabled={!buyQuantity || parseInt(buyQuantity) <= 0}
//               className="bg-accent text-accent-foreground"
//             >
//               Confirm Buy
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Sell Confirmation Dialog */}
//       <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Sell - {selectedHolding?.company}</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to sell all your shares in {selectedHolding?.symbol}?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-muted-foreground">Quantity</p>
//                 <p className="font-medium">{selectedHolding?.volume} shares</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Current Price</p>
//                 <p className="font-medium">{selectedHolding && formatINR(selectedHolding.price)}</p>
//               </div>
//             </div>
//             <div className="p-3 rounded-lg bg-success/10">
//               <p className="text-sm text-muted-foreground">Estimated Proceeds</p>
//               <p className="text-lg font-bold text-success">{selectedHolding && formatINR(selectedHolding.value)}</p>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
//             <Button 
//               onClick={confirmSell}
//               variant="destructive"
//             >
//               Confirm Sell
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }


"use client"

import { useState } from "react"
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
import { TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"
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

interface Holding {
  company: string
  symbol: string
  volume: number
  acquiredPrice: number
  currentPrice: number
  change: number
  changePercent: number
  value: number
}

const initialHoldings: Holding[] = [
  {
    company: "Reliance Industries",
    symbol: "RELIANCE.NS",
    volume: 50,
    acquiredPrice: 2350.00,
    currentPrice: 2485.75,
    change: 135.75,
    changePercent: 5.78,
    value: 117537.50,
  },
  {
    company: "Tata Consultancy Services",
    symbol: "TCS.NS",
    volume: 30,
    acquiredPrice: 3650.00,
    currentPrice: 3892.40,
    change: 242.40,
    changePercent: 6.64,
    value: 109500.00,
  },
  {
    company: "HDFC Bank",
    symbol: "HDFCBANK.NS",
    volume: 75,
    acquiredPrice: 1590.00,
    currentPrice: 1678.90,
    change: 88.90,
    changePercent: 5.59,
    value: 119250.00,
  },
  {
    company: "Infosys",
    symbol: "INFY.NS",
    volume: 60,
    acquiredPrice: 1480.00,
    currentPrice: 1542.35,
    change: 62.35,
    changePercent: 4.21,
    value: 88800.00,
  },
  {
    company: "ICICI Bank",
    symbol: "ICICIBANK.NS",
    volume: 100,
    acquiredPrice: 1050.00,
    currentPrice: 1125.60,
    change: 75.60,
    changePercent: 7.20,
    value: 105000.00,
  },
  {
    company: "Bharti Airtel",
    symbol: "BHARTIARTL.NS",
    volume: 80,
    acquiredPrice: 1320.00,
    currentPrice: 1456.25,
    change: 136.25,
    changePercent: 10.32,
    value: 105600.00,
  },
  {
    company: "ITC Limited",
    symbol: "ITC.NS",
    volume: 200,
    acquiredPrice: 425.00,
    currentPrice: 448.50,
    change: 23.50,
    changePercent: 5.53,
    value: 85000.00,
  },
  {
    company: "Wipro",
    symbol: "WIPRO.NS",
    volume: 90,
    acquiredPrice: 445.00,
    currentPrice: 425.30,
    change: -19.70,
    changePercent: -4.43,
    value: 40050.00,
  },
  {
    company: "Asian Paints",
    symbol: "ASIANPAINT.NS",
    volume: 40,
    acquiredPrice: 2850.00,
    currentPrice: 2975.40,
    change: 125.40,
    changePercent: 4.40,
    value: 114000.00,
  },
  {
    company: "Mahindra & Mahindra",
    symbol: "M&M.NS",
    volume: 65,
    acquiredPrice: 1680.00,
    currentPrice: 1825.75,
    change: 145.75,
    changePercent: 8.68,
    value: 109200.00,
  },
  {
    company: "Larsen & Toubro",
    symbol: "LT.NS",
    volume: 45,
    acquiredPrice: 3250.00,
    currentPrice: 3415.60,
    change: 165.60,
    changePercent: 5.09,
    value: 146250.00,
  },
  {
    company: "Maruti Suzuki",
    symbol: "MARUTI.NS",
    volume: 25,
    acquiredPrice: 10500.00,
    currentPrice: 10875.50,
    change: 375.50,
    changePercent: 3.58,
    value: 262500.00,
  },
  {
    company: "HCL Technologies",
    symbol: "HCLTECH.NS",
    volume: 70,
    acquiredPrice: 1320.00,
    currentPrice: 1285.40,
    change: -34.60,
    changePercent: -2.62,
    value: 92400.00,
  },
]

const ITEMS_PER_PAGE = 6

export function HoldingsTable() {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
  const [currentPage, setCurrentPage] = useState(1)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [sellDialogOpen, setSellDialogOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [buyQuantity, setBuyQuantity] = useState("")

  const totalPages = Math.ceil(holdings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentHoldings = holdings.slice(startIndex, endIndex)

  const handleEdit = (holding: Holding) => {
    setSelectedHolding(holding)
    setBuyQuantity("")
    setEditDialogOpen(true)
  }

  const handleSell = (holding: Holding) => {
    setSelectedHolding(holding)
    setSellDialogOpen(true)
  }

  const confirmBuyMore = () => {
    if (selectedHolding && buyQuantity) {
      const qty = parseInt(buyQuantity)
      if (qty > 0) {
        setHoldings(prev => prev.map(h => {
          if (h.symbol === selectedHolding.symbol) {
            const newVolume = h.volume + qty
            // Recalculate value based on acquired price * total volume
            const newValue = h.acquiredPrice * newVolume
            return { ...h, volume: newVolume, value: newValue }
          }
          return h
        }))
      }
    }
    setEditDialogOpen(false)
    setBuyQuantity("")
  }

  const confirmSell = () => {
    if (selectedHolding) {
      const newHoldings = holdings.filter(h => h.symbol !== selectedHolding.symbol)
      setHoldings(newHoldings)
      
      // Adjust current page if needed
      const newTotalPages = Math.ceil(newHoldings.length / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    }
    setSellDialogOpen(false)
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">Holdings</CardTitle>
            <span className="text-xs md:text-sm text-muted-foreground">{holdings.length} stocks</span>
          </div>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Company</TableHead>
                  <TableHead className="text-muted-foreground text-right">Qty</TableHead>
                  <TableHead className="text-muted-foreground text-right">Acquired Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">Current Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">Change</TableHead>
                  <TableHead className="text-muted-foreground text-right">Value</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentHoldings.map((holding) => (
                  <TableRow key={holding.symbol} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{holding.company}</p>
                        <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{holding.volume}</TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatINR(holding.acquiredPrice)}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatINR(holding.currentPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${
                        holding.change >= 0 ? "text-success" : "text-destructive"
                      }`}>
                        {holding.change >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>
                          {holding.change >= 0 ? "+" : ""}
                          {holding.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatINR(holding.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(holding)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit (Buy More)
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSell(holding)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sell
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-border mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, holdings.length)} of {holdings.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog - Buy More */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy More - {selectedHolding?.company}</DialogTitle>
            <DialogDescription>
              Add more shares to your existing position in {selectedHolding?.symbol}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Qty</p>
                <p className="font-medium">{selectedHolding?.volume} shares</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.currentPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Acquired Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.acquiredPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Value</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.value)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyQty">Quantity to Buy</Label>
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
            {buyQuantity && parseInt(buyQuantity) > 0 && selectedHolding && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-lg font-bold">{formatINR(parseInt(buyQuantity) * selectedHolding.currentPrice)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmBuyMore}
              disabled={!buyQuantity || parseInt(buyQuantity) <= 0}
              className="bg-accent text-accent-foreground"
            >
              Confirm Buy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Confirmation Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell - {selectedHolding?.company}</DialogTitle>
            <DialogDescription>
              Are you sure you want to sell all your shares in {selectedHolding?.symbol}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{selectedHolding?.volume} shares</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.currentPrice)}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <p className="text-sm text-muted-foreground">Estimated Proceeds</p>
              <p className="text-lg font-bold text-success">
                {selectedHolding && formatINR(selectedHolding.currentPrice * selectedHolding.volume)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmSell}
              variant="destructive"
            >
              Confirm Sell
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}