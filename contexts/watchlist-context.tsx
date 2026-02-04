"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
}

interface WatchlistContextType {
  watchlist: Stock[]
  addToWatchlist: (stock: Stock) => void
  removeFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Stock[]>([])

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('stockWatchlist')
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load watchlist:', error)
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (stock: Stock) => {
    setWatchlist(prev => {
      // Check if already exists
      if (prev.some(s => s.symbol === stock.symbol)) {
        return prev
      }
      return [...prev, stock]
    })
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol))
  }

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(s => s.symbol === symbol)
  }

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}