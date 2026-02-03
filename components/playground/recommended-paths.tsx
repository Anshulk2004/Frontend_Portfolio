"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Route, Clock, BookOpen, ArrowRight } from "lucide-react"

const paths = [
  {
    title: "Beginner to Pro Trader",
    description: "Master trading from basics to advanced strategies",
    courses: 8,
    duration: "45 hours",
    level: "Beginner",
    color: "#10b981",
  },
  {
    title: "Wealth Building Journey",
    description: "Learn to build and grow your wealth systematically",
    courses: 6,
    duration: "32 hours",
    level: "Intermediate",
    color: "#4F46E5",
  },
  {
    title: "Risk Management Expert",
    description: "Protect your portfolio with advanced techniques",
    courses: 5,
    duration: "28 hours",
    level: "Advanced",
    color: "#f59e0b",
  },
]

export function RecommendedPaths() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">Learning Paths</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paths.map((path, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border hover:border-accent/50 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${path.color}15` }}
                >
                  <Route className="w-5 h-5" style={{ color: path.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {path.courses} courses
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {path.duration}
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: `${path.color}15`, color: path.color }}
                >
                  {path.level}
                </span>
              </div>

              <Button size="sm" variant="ghost" className="w-full justify-between text-accent">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
