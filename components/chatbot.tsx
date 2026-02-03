"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface PortfolioContext {
  totalValue?: number
  totalInvested?: number
  profitLoss?: number
  profitLossPercentage?: number
  holdings?: Array<{ symbol: string; shares: number; value: number }>
  assetAllocation?: Record<string, number>
}

interface ChatbotProps {
  portfolioContext?: PortfolioContext
}

export function Chatbot({ portfolioContext }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: portfolioContext 
        ? `Hello! I'm your portfolio assistant. I can see you have a portfolio worth $${portfolioContext.totalValue?.toLocaleString()}. I can help you understand your investments, analyze your performance, and answer questions about stocks and portfolio management. What would you like to know?`
        : "Hello! I'm your portfolio assistant. I can help you understand investments, stocks, and portfolio management. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Suggested questions based on portfolio context
  const suggestedQuestions = portfolioContext
    ? [
        "How is my portfolio performing?",
        "What's my current P/L ratio?",
        "Should I rebalance my portfolio?",
        "Explain my asset allocation",
      ]
    : [
        "What is portfolio diversification?",
        "How do I calculate ROI?",
        "What's the difference between ETFs and mutual funds?",
        "Explain P/E ratio",
      ]

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    setInput("")
    
    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: textToSend }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Call your API route with portfolio context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          portfolioContext: portfolioContext, // Send portfolio data to API
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 right-3 left-3 md:left-auto md:right-6 md:w-96 bg-card border border-border rounded-xl shadow-2xl transition-all duration-300 z-50 overflow-hidden",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
              <p className="text-xs opacity-90">AI-powered investment helper</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Portfolio Quick Stats (if context available) */}
        {portfolioContext && messages.length === 1 && (
          <div className="p-3 bg-muted/50 border-b border-border">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-card p-2 rounded">
                <p className="text-muted-foreground">Total Value</p>
                <p className="font-semibold text-sm">${portfolioContext.totalValue?.toLocaleString()}</p>
              </div>
              <div className="bg-card p-2 rounded">
                <p className="text-muted-foreground">P/L</p>
                <p className={cn(
                  "font-semibold text-sm",
                  (portfolioContext.profitLoss || 0) >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {(portfolioContext.profitLoss || 0) >= 0 ? "+" : ""}${portfolioContext.profitLoss?.toLocaleString()} ({portfolioContext.profitLossPercentage}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2 text-sm",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {/* Suggested Questions (show only on first message) */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your portfolio..."
              className="flex-1 bg-card"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI assistant • Educational purposes only
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-3 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110 hover:shadow-xl",
          isOpen && "scale-95"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {portfolioContext && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
            )}
          </div>
        )}
      </button>
    </>
  )
}