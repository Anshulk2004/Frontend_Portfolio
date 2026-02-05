"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Star } from "lucide-react"
import { useCourses } from "./courses-context"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function MyProgress() {
  const { userCourses } = useCourses()
  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ day: string; hours: number; target: number }>>([])
  const [totalWeekHours, setTotalWeekHours] = useState(0)
  const [targetWeekHours, setTargetWeekHours] = useState(21) // 3 hours per day
  const [xpProgress, setXpProgress] = useState({ current: 0, target: 1000, level: 12 })

  useEffect(() => {
    const progress = weekDays.map(day => ({
      day,
      hours: 0, 
      target: 3
    }))
    if (userCourses.length > 0) {
      const hoursPerCourse = 2.5
      const totalHours = userCourses.length * hoursPerCourse
      const hoursPerDay = totalHours / 7
      
      progress.forEach((day, idx) => {
        if (idx < 5) { 
          day.hours = Math.min(hoursPerDay * 1.5, 4)
        } else {
          day.hours = hoursPerDay * 0.5
        }
      })
    }

    setWeeklyProgress(progress)
    const total = progress.reduce((acc, d) => acc + d.hours, 0)
    setTotalWeekHours(total)
    const totalProgress = userCourses.reduce((acc, uc) => acc + uc.progress, 0)
    const avgProgress = userCourses.length > 0 ? totalProgress / userCourses.length : 0
    const xp = Math.floor(avgProgress * 10) 
    
    setXpProgress({
      current: 850 + xp,
      target: 1000,
      level: 12 + Math.floor(xp / 150)
    })
  }, [userCourses])

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
              {totalWeekHours.toFixed(1)}h / {targetWeekHours}h
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
              <span className="font-medium text-foreground">Level {xpProgress.level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {xpProgress.current} / {xpProgress.target} XP
            </span>
          </div>
          <Progress value={(xpProgress.current / xpProgress.target) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {xpProgress.target - xpProgress.current} XP to Level {xpProgress.level + 1}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
