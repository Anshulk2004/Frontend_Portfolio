"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, CheckCircle2, Circle, Star } from "lucide-react"

const milestones = [
  {
    title: "First $10,000 Invested",
    description: "Started your investment journey",
    date: "Jan 2023",
    completed: true,
    reward: "500 XP",
  },
  {
    title: "Diversified Portfolio",
    description: "Invested in 5+ different sectors",
    date: "Mar 2023",
    completed: true,
    reward: "750 XP",
  },
  {
    title: "$50,000 Portfolio Value",
    description: "Reached $50K total portfolio value",
    date: "Jul 2023",
    completed: true,
    reward: "1,000 XP",
  },
  {
    title: "First Dividend Received",
    description: "Earned passive income from dividends",
    date: "Aug 2023",
    completed: true,
    reward: "500 XP",
  },
  {
    title: "$100,000 Portfolio Value",
    description: "Reach $100K total portfolio value",
    date: "Target: Dec 2024",
    completed: false,
    reward: "2,000 XP",
  },
  {
    title: "Consistent Investor",
    description: "Invest for 12 consecutive months",
    date: "In Progress",
    completed: false,
    reward: "1,500 XP",
  },
]

export function Milestones() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <CardTitle className="text-lg font-semibold text-foreground">Milestones</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-medium text-foreground">2,750 XP</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex gap-4 p-3 rounded-lg transition-colors ${
                  milestone.completed ? "bg-success/5" : "bg-muted/50"
                }`}
              >
                {/* Timeline dot */}
                <div className="relative z-10">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success fill-success/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${
                        milestone.completed ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {milestone.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      milestone.completed
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {milestone.reward}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
