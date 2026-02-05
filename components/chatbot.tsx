"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, TrendingUp, BarChart3, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Chatbot({ portfolioContext }: { portfolioContext?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const savedChat = localStorage.getItem("portfolio_chat_history")
    if (savedChat) {
      setMessages(JSON.parse(savedChat))
    } else {
      setMessages([{
        role: "assistant",
        content: "Hello! I'm your **Market Insight Assistant**. I've analyzed your data. Ask me about a sector or trend, and I'll give you a quick summary!"
      }])
    }
  }, [])
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("portfolio_chat_history", JSON.stringify(messages))
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const clearChat = () => {
    const initialMsg = [{ role: "assistant" as const, content: "Chat cleared. How can I help you now?" }]
    setMessages(initialMsg)
    localStorage.removeItem("portfolio_chat_history")
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    setInput("")
    const newMessages = [...messages, { role: "user" as const, content: textToSend }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, portfolioContext }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={cn(
        "fixed bottom-20 right-3 left-3 md:left-auto md:right-6 md:w-[550px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300",
        isOpen ? "h-[500px] opacity-100 translate-y-0" : "h-0 opacity-0 translate-y-10 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-sm">Market Analyst AI</p>
              <p className="text-[10px] opacity-70">Strategic Insights Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white h-8 w-8" title="Clear Chat" onClick={clearChat}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-950/50">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none 
                  prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
                  prose-ul:my-2 prose-li:my-0">
                  <ReactMarkdown components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                        {props.children} <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  }}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start"><div className="bg-card border rounded-2xl px-4 py-3 flex items-center gap-3"><Loader2 className="w-4 h-4 animate-spin text-primary" /><span className="text-xs font-medium">Analyzing...</span></div></div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-card shrink-0 space-y-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-full" onClick={() => handleSend("Give me more information")}>More Info</Button>
            <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-full" onClick={() => handleSend("How does this affect my portfolio?")}>Portfolio Impact</Button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="h-11 rounded-xl" disabled={isLoading} />
            <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0" disabled={isLoading || !input.trim()}><Send className="w-4 h-4" /></Button>
          </form>
        </div>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        {isOpen ? <X className="w-7 h-7" /> : <TrendingUp className="w-7 h-7" />}
      </button>
    </>
  )
}