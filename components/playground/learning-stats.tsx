"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Award, Target, Flame, Trophy } from "lucide-react"

const stats = [
  {
    title: "Hours Learned",
    value: "127",
    subtitle: "This month: 24h",
    icon: Clock,
    color: "#4F46E5",
  },
  {
    title: "Courses Completed",
    value: "12",
    subtitle: "3 in progress",
    icon: BookOpen,
    color: "#10b981",
  },
  {
    title: "Certificates Earned",
    value: "8",
    subtitle: "2 pending",
    icon: Award,
    color: "#f59e0b",
  },
  {
    title: "Current Streak",
    value: "15 days",
    subtitle: "Best: 28 days",
    icon: Flame,
    color: "#ef4444",
  },
  {
    title: "XP Earned",
    value: "4,850",
    subtitle: "Level 12",
    icon: Trophy,
    color: "#8b5cf6",
  },
  {
    title: "Goals Completed",
    value: "8/10",
    subtitle: "80% progress",
    icon: Target,
    color: "#06b6d4",
  },
]

export function LearningStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 md:p-4">
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
