"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen } from "lucide-react"
// import { useCourses } from "@/contexts/courses-content"
import { useCourses } from "./courses-context"

export function ContinueLearning() {
  const { enrolledCourses, playCourse } = useCourses()

  return (
    <Card className="bg-card border-border min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Your learning journey starts here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <img src={course.image} className="w-20 h-12 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{course.title}</h4>
                  <Progress value={course.progress} className="h-1.5 mt-2" />
                </div>
                <Button size="icon" variant="ghost" onClick={playCourse}>
                  <Play className="w-5 h-5 fill-accent text-accent" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}