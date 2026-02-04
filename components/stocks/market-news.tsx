"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Clock } from "lucide-react"

type NewsItem = {
  title: string
  source: string
  time: string
  category: string
  url: string
}

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
  const fetchNews = () => {
    fetch("/api/market-news")
      .then(res => res.json())
      .then(data => setNews(data.slice(0,5)))
      .catch(() => {})
  }

  fetchNews() 

  const interval = setInterval(fetchNews, 60_000)

  return () => clearInterval(interval)
}, [])


  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">
            Market News
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              className="block pb-4 border-b border-border last:border-0 last:pb-0 hover:opacity-80 transition-opacity"
            >
              <p className="font-medium text-foreground mb-2">
                {item.title}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                  {item.category}
                </span>
                <span>{item.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
