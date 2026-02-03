"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Building2, Landmark } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WalletType {
  id: number
  name: string
  bank: string
  balance: number
  lastTransaction: string
  lastTransactionType: "deposit" | "withdrawal"
  accountNumber: string
  icon: typeof CreditCard
  color: string
}

const initialWallets: WalletType[] = [
  {
    id: 1,
    name: "Main Trading Account",
    bank: "HDFC Bank",
    balance: 3768750,
    lastTransaction: "+Rs. 2,08,000",
    lastTransactionType: "deposit",
    accountNumber: "****4521",
    icon: CreditCard,
    color: "#4F46E5",
  },
  {
    id: 2,
    name: "Investment Savings",
    bank: "ICICI Bank",
    balance: 2681500,
    lastTransaction: "+Rs. 1,00,000",
    lastTransactionType: "deposit",
    accountNumber: "****7832",
    icon: Building2,
    color: "#10b981",
  },
  {
    id: 3,
    name: "Emergency Fund",
    bank: "SBI",
    balance: 1250000,
    lastTransaction: "-Rs. 41,600",
    lastTransactionType: "withdrawal",
    accountNumber: "****2156",
    icon: Landmark,
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Retirement Fund",
    bank: "Kotak Mahindra",
    balance: 6535000,
    lastTransaction: "+Rs. 70,800",
    lastTransactionType: "deposit",
    accountNumber: "****9043",
    icon: Wallet,
    color: "#8b5cf6",
  },
]

const bankOptions = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Kotak Mahindra Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Yes Bank",
]

const accountTypes = [
  "Trading Account",
  "Savings Account",
  "Current Account",
  "Demat Account",
  "Fixed Deposit",
]

export function WalletCards() {
  const [wallets, setWallets] = useState<WalletType[]>(initialWallets)
  const [addWalletOpen, setAddWalletOpen] = useState(false)
  const [newWallet, setNewWallet] = useState({
    name: "",
    bank: "",
    accountNumber: "",
    accountType: "",
    initialBalance: "",
    ifscCode: "",
    branchName: "",
  })

  const formatINR = (value: number) => {
    if (value >= 10000000) {
      return `Rs. ${(value / 10000000).toFixed(2)} Cr`
    } else if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(2)} L`
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  const icons = [CreditCard, Building2, Landmark, Wallet]
  const colors = ["#4F46E5", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

  const handleAddWallet = () => {
    if (newWallet.name && newWallet.bank && newWallet.accountNumber) {
      const newId = Math.max(...wallets.map(w => w.id)) + 1
      const newWalletData: WalletType = {
        id: newId,
        name: newWallet.name,
        bank: newWallet.bank,
        balance: parseFloat(newWallet.initialBalance) || 0,
        lastTransaction: "+Rs. 0",
        lastTransactionType: "deposit",
        accountNumber: `****${newWallet.accountNumber.slice(-4)}`,
        icon: icons[newId % icons.length],
        color: colors[newId % colors.length],
      }
      setWallets([...wallets, newWalletData])
      setNewWallet({
        name: "",
        bank: "",
        accountNumber: "",
        accountType: "",
        initialBalance: "",
        ifscCode: "",
        branchName: "",
      })
      setAddWalletOpen(false)
    }
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">Connected Wallets</CardTitle>
          </div>
          <Button 
            size="sm" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:text-sm"
            onClick={() => setAddWalletOpen(true)}
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Add Wallet</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="relative p-3 md:p-4 rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted/20 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${wallet.color}20` }}
                  >
                    <wallet.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: wallet.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{wallet.accountNumber}</span>
                </div>

                {/* Balance */}
                <p className="text-xl md:text-2xl font-bold text-foreground mb-1">
                  {formatINR(wallet.balance)}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 truncate">{wallet.name}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{wallet.bank}</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    wallet.lastTransactionType === "deposit" ? "text-success" : "text-destructive"
                  }`}>
                    {wallet.lastTransactionType === "deposit" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {wallet.lastTransaction}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Wallet Dialog */}
      <Dialog open={addWalletOpen} onOpenChange={setAddWalletOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Wallet</DialogTitle>
            <DialogDescription>
              Connect a new bank account or wallet to track your investments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="walletName">Account Name</Label>
              <Input
                id="walletName"
                placeholder="e.g., Main Trading Account"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Bank</Label>
                <Select 
                  value={newWallet.bank} 
                  onValueChange={(value) => setNewWallet({ ...newWallet, bank: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select 
                  value={newWallet.accountType} 
                  onValueChange={(value) => setNewWallet({ ...newWallet, accountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={newWallet.accountNumber}
                onChange={(e) => setNewWallet({ ...newWallet, accountNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="e.g., HDFC0001234"
                  value={newWallet.ifscCode}
                  onChange={(e) => setNewWallet({ ...newWallet, ifscCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  placeholder="e.g., Mumbai Main"
                  value={newWallet.branchName}
                  onChange={(e) => setNewWallet({ ...newWallet, branchName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Initial Balance (Rs.)</Label>
              <Input
                id="initialBalance"
                type="number"
                placeholder="Enter initial balance"
                value={newWallet.initialBalance}
                onChange={(e) => setNewWallet({ ...newWallet, initialBalance: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWalletOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddWallet}
              disabled={!newWallet.name || !newWallet.bank || !newWallet.accountNumber}
              className="bg-accent text-accent-foreground"
            >
              Add Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
