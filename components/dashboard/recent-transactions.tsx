"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const transactions = [
  {
    type: "buy",
    symbol: "RELIANCE.NS",
    shares: 10,
    price: 2485.75,
    total: 24857.50,
    date: "2 hours ago",
  },
  {
    type: "sell",
    symbol: "TATAMOTORS.NS",
    shares: 25,
    price: 985.40,
    total: 24635.00,
    date: "5 hours ago",
  },
  {
    type: "buy",
    symbol: "TCS.NS",
    shares: 5,
    price: 3892.40,
    total: 19462.00,
    date: "1 day ago",
  },
  {
    type: "buy",
    symbol: "HDFCBANK.NS",
    shares: 15,
    price: 1678.90,
    total: 25183.50,
    date: "2 days ago",
  },
  {
    type: "sell",
    symbol: "WIPRO.NS",
    shares: 50,
    price: 485.60,
    total: 24280.00,
    date: "3 days ago",
  },
  {
    type: "buy",
    symbol: "INFY.NS",
    shares: 20,
    price: 1542.35,
    total: 30847.00,
    date: "4 days ago",
  },
]

export function RecentTransactions() {
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
        <CardTitle className="text-lg font-semibold text-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "buy"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {transaction.type === "buy" ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.symbol.replace('.NS', '')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.shares} shares @ {formatINR(transaction.price)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === "buy" ? "text-foreground" : "text-success"
                }`}>
                  {transaction.type === "buy" ? "-" : "+"}{formatINR(transaction.total)}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
