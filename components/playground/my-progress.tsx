"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Star } from "lucide-react"

const weeklyProgress = [
  { day: "Mon", hours: 2.5, target: 3 },
  { day: "Tue", hours: 3, target: 3 },
  { day: "Wed", hours: 1.5, target: 3 },
  { day: "Thu", hours: 4, target: 3 },
  { day: "Fri", hours: 2, target: 3 },
  { day: "Sat", hours: 0, target: 3 },
  { day: "Sun", hours: 0, target: 3 },
]

const totalWeekHours = weeklyProgress.reduce((acc, d) => acc + d.hours, 0)
const targetWeekHours = weeklyProgress.reduce((acc, d) => acc + d.target, 0)

export function MyProgress() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">My Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekly Goal */}
        <div className="mb-6 p-4 rounded-lg bg-accent/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Weekly Goal</span>
            <span className="text-sm text-muted-foreground">
              {totalWeekHours}h / {targetWeekHours}h
            </span>
          </div>
          <Progress value={(totalWeekHours / targetWeekHours) * 100} className="h-2" />
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            This Week
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day) => {
              const heightPercent = (day.hours / 5) * 100
              const isComplete = day.hours >= day.target
              return (
                <div key={day.day} className="flex flex-col items-center gap-2">
                  <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full rounded-b-lg transition-all ${
                        isComplete ? "bg-success" : "bg-accent"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="font-medium text-foreground">Level 12</span>
            </div>
            <span className="text-sm text-muted-foreground">850 / 1000 XP</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">150 XP to Level 13</p>
        </div>
      </CardContent>
    </Card>
  )
}
