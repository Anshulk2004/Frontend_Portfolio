"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = ["All Stocks", "Trending", "Watchlist", "Top Gainers", "Top Losers"]
const sectors = ["All Sectors", "Technology", "Healthcare", "Financial", "Energy", "Industrial", "Consumer"]

export function StocksFilters() {
  const [activeCategory, setActiveCategory] = useState("All Stocks")
  const [activeSector, setActiveSector] = useState("All Sectors")

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Category Tabs - Horizontal scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap text-xs md:text-sm ${activeCategory === category ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 h-9 md:h-10 text-sm" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 md:gap-2 bg-transparent h-9 md:h-10 text-xs md:text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{activeSector}</span>
              <span className="sm:hidden">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sectors.map((sector) => (
              <DropdownMenuItem
                key={sector}
                onClick={() => setActiveSector(sector)}
                className={activeSector === sector ? "bg-accent text-accent-foreground" : ""}
              >
                {sector}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
