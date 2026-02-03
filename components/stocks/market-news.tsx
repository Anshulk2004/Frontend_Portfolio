"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Clock } from "lucide-react"

const news = [
  {
    title: "Fed signals potential rate cuts in 2024",
    source: "Reuters",
    time: "2h ago",
    category: "Economy",
  },
  {
    title: "NVIDIA reaches new all-time high on AI demand",
    source: "Bloomberg",
    time: "4h ago",
    category: "Tech",
  },
  {
    title: "Apple announces new product event",
    source: "CNBC",
    time: "6h ago",
    category: "Tech",
  },
]

export function MarketNews() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">Market News</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div
              key={index}
              className="pb-4 border-b border-border last:border-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="font-medium text-foreground leading-tight mb-2">{item.title}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{item.category}</span>
                <span>{item.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
