"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, ArrowUpRight, Loader2, Trash2, Pencil, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Wallet {
  id: number
  user?: {
    id: number
  }
  walletName: string
  bankName: string
  accountNumber: string
  balance: number
  walletType: string
  createdAt: string
  updatedAt: string
}

interface WalletCardsProps {
  onRefresh?: () => void
}

export function WalletCards({ onRefresh }: WalletCardsProps) {
  const { toast } = useToast()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [addWalletOpen, setAddWalletOpen] = useState(false)
  const [editWalletOpen, setEditWalletOpen] = useState(false)
  const [deleteWalletOpen, setDeleteWalletOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [formData, setFormData] = useState({
    walletName: "",
    bankName: "",
    accountNumber: "",
    balance: "",
    walletType: "Savings"
  })

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/wallets")
      setWallets(response.data)
    } catch (error) {
      console.error("Failed to fetch wallets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWallet = async () => {
    try {
      await axios.post("http://localhost:8080/api/wallets", {
        walletName: formData.walletName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        balance: parseFloat(formData.balance) || 0,
        walletType: formData.walletType
      })
      
      toast({
        title: "Success",
        description: "Wallet added successfully",
      })
      
      setAddWalletOpen(false)
      setFormData({ walletName: "", bankName: "", accountNumber: "", balance: "", walletType: "Savings" })
      fetchWallets()
    } catch (error) {
      console.error("Failed to add wallet:", error)
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditWallet = async () => {
    if (!selectedWallet) return

    try {
      await axios.put(`http://localhost:8080/api/wallets/${selectedWallet.id}`, {
        ...selectedWallet,
        walletName: formData.walletName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        balance: parseFloat(formData.balance),
        walletType: formData.walletType
      })
      
      toast({
        title: "Success",
        description: "Wallet updated successfully",
      })
      
      setEditWalletOpen(false)
      fetchWallets()
    } catch (error) {
      console.error("Failed to update wallet:", error)
      toast({
        title: "Error",
        description: "Failed to update wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWallet = async () => {
    if (!selectedWallet) return

    try {
      await axios.delete(`http://localhost:8080/api/wallets/${selectedWallet.id}`)
      
      toast({
        title: "Success",
        description: "Wallet deleted successfully",
      })
      
      setDeleteWalletOpen(false)
      fetchWallets()
    } catch (error) {
      console.error("Failed to delete wallet:", error)
      toast({
        title: "Error",
        description: "Failed to delete wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet)
    setFormData({
      walletName: wallet.walletName,
      bankName: wallet.bankName,
      accountNumber: wallet.accountNumber,
      balance: wallet.balance.toString(),
      walletType: wallet.walletType || "Savings"
    })
    setEditWalletOpen(true)
  }

  const openDeleteDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet)
    setDeleteWalletOpen(true)
  }

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber
    return `**** ${accountNumber.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="bg-card border-border relative">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {maskAccountNumber(wallet.accountNumber)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(wallet)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(wallet)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Balance</p>
                <p className="text-2xl font-bold text-foreground">
                  Rs. {wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{wallet.walletName}</span>
                  <span className="text-xs text-muted-foreground">{wallet.bankName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-xs font-medium text-success">
                    <ArrowUpRight className="w-3 h-3" />
                    Linked
                  </div>
                  <span className="text-xs text-muted-foreground">{wallet.walletType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Wallet Card */}
        <Card 
          className="border-2 border-dashed border-border bg-transparent hover:bg-muted/50 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px]"
          onClick={() => {
            setFormData({ walletName: "", bankName: "", accountNumber: "", balance: "", walletType: "Savings" })
            setAddWalletOpen(true)
          }}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Connect Wallet</p>
          <p className="text-xs text-muted-foreground">Add bank or demat account</p>
        </Card>
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={addWalletOpen} onOpenChange={setAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect New Wallet</DialogTitle>
            <DialogDescription>Enter your account details to add a new wallet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="walletName">Account Name</Label>
              <Input 
                id="walletName" 
                placeholder="e.g. My Savings" 
                value={formData.walletName}
                onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input 
                id="bankName" 
                placeholder="HDFC, ICICI, etc." 
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input 
                id="accountNumber" 
                placeholder="1234567890" 
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Initial Balance</Label>
              <Input 
                id="balance" 
                type="number" 
                placeholder="0.00" 
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="walletType">Wallet Type</Label>
              <Select value={formData.walletType} onValueChange={(value) => setFormData({ ...formData, walletType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Demat">Demat</SelectItem>
                  <SelectItem value="Trading">Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWalletOpen(false)}>Cancel</Button>
            <Button onClick={handleAddWallet}>Add Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Wallet Dialog */}
      <Dialog open={editWalletOpen} onOpenChange={setEditWalletOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>Update your wallet details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editWalletName">Account Name</Label>
              <Input 
                id="editWalletName" 
                value={formData.walletName}
                onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editBankName">Bank Name</Label>
              <Input 
                id="editBankName" 
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editAccountNumber">Account Number</Label>
              <Input 
                id="editAccountNumber" 
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editBalance">Balance</Label>
              <Input 
                id="editBalance" 
                type="number" 
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editWalletType">Wallet Type</Label>
              <Select value={formData.walletType} onValueChange={(value) => setFormData({ ...formData, walletType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Demat">Demat</SelectItem>
                  <SelectItem value="Trading">Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWalletOpen(false)}>Cancel</Button>
            <Button onClick={handleEditWallet}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteWalletOpen} onOpenChange={setDeleteWalletOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wallet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedWallet?.walletName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWalletOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteWallet}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}