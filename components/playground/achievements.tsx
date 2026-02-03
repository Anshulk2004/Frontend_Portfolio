"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Award,
  Flame,
  BookOpen,
  Target,
  Star,
  Lock,
} from "lucide-react"

const achievements = [
  {
    name: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    earned: true,
    date: "Jan 2024",
    xp: 100,
  },
  {
    name: "Knowledge Seeker",
    description: "Complete 10 lessons",
    icon: Target,
    earned: true,
    date: "Feb 2024",
    xp: 250,
  },
  {
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    earned: true,
    date: "Feb 2024",
    xp: 500,
  },
  {
    name: "Course Champion",
    description: "Complete your first course",
    icon: Award,
    earned: false,
    date: null,
    xp: 750,
  },
  {
    name: "Star Student",
    description: "Achieve 90%+ on 5 quizzes",
    icon: Star,
    earned: false,
    date: null,
    xp: 500,
  },
]

export function Achievements() {
  const earnedCount = achievements.filter(a => a.earned).length

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          <CardTitle className="text-lg font-semibold text-foreground">Achievements</CardTitle>
        </div>
        <span className="text-sm text-muted-foreground">
          {earnedCount}/{achievements.length} unlocked
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg text-center transition-all ${
                achievement.earned
                  ? "bg-warning/10 hover:bg-warning/20"
                  : "bg-muted/50 opacity-60"
              }`}
            >
              {!achievement.earned && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  achievement.earned ? "bg-warning/20" : "bg-muted"
                }`}
              >
                <achievement.icon
                  className={`w-6 h-6 ${
                    achievement.earned ? "text-warning" : "text-muted-foreground"
                  }`}
                />
              </div>
              <p className="font-medium text-foreground text-xs leading-tight mb-1">
                {achievement.name}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {achievement.description}
              </p>
              <span
                className={`text-xs font-medium ${
                  achievement.earned ? "text-warning" : "text-muted-foreground"
                }`}
              >
                +{achievement.xp} XP
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
