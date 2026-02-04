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
import { TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2, Plus, Minus } from "lucide-react"
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
  id: number
  symbol: string
  companyName: string
  sector: string
  currentPrice: number
  timePeriod: string
  quantity: number
  totalInvested: number
  acquiredDate: string
  updatedAt: string
}

interface HoldingsTableProps {
  holdings: Holding[]
  onRefresh: () => void
}

export function HoldingsTable({ holdings, onRefresh }: HoldingsTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [sellDialogOpen, setSellDialogOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [buyQuantity, setBuyQuantity] = useState("")

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
    // TODO: Implement API call to buy more
    setEditDialogOpen(false)
    setBuyQuantity("")
    onRefresh()
  }

  const confirmSell = () => {
    // TODO: Implement API call to sell
    setSellDialogOpen(false)
    onRefresh()
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  const calculatePnL = (holding: Holding) => {
    const currentValue = holding.currentPrice * holding.quantity
    const pnl = currentValue - holding.totalInvested
    const pnlPercentage = (pnl / holding.totalInvested) * 100
    return { pnl, pnlPercentage }
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
                  <TableHead className="text-muted-foreground text-right">Avg Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">Current Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">P&L</TableHead>
                  <TableHead className="text-muted-foreground text-right">Value</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => {
                  const { pnl, pnlPercentage } = calculatePnL(holding)
                  const currentValue = holding.currentPrice * holding.quantity
                  const avgPrice = holding.totalInvested / holding.quantity

                  return (
                    <TableRow key={holding.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{holding.companyName}</p>
                          <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-foreground">{holding.quantity}</TableCell>
                      <TableCell className="text-right text-foreground">
                        {formatINR(avgPrice)}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {formatINR(holding.currentPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          pnl >= 0 ? "text-success" : "text-destructive"
                        }`}>
                          {pnl >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>
                            {pnl >= 0 ? "+" : ""}
                            {pnlPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {formatINR(currentValue)}
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
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog - Buy More */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy More - {selectedHolding?.companyName}</DialogTitle>
            <DialogDescription>
              Add more shares to your existing position in {selectedHolding?.symbol}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Qty</p>
                <p className="font-medium">{selectedHolding?.quantity} shares</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.currentPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Buy Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.totalInvested / selectedHolding.quantity)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Value</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.currentPrice * selectedHolding.quantity)}</p>
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
            <DialogTitle>Sell - {selectedHolding?.companyName}</DialogTitle>
            <DialogDescription>
              Are you sure you want to sell all your shares in {selectedHolding?.symbol}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{selectedHolding?.quantity} shares</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-medium">{selectedHolding && formatINR(selectedHolding.currentPrice)}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <p className="text-sm text-muted-foreground">Estimated Proceeds</p>
              <p className="text-lg font-bold text-success">{selectedHolding && formatINR(selectedHolding.currentPrice * selectedHolding.quantity)}</p>
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
