"use client"

import { LearningStats } from "@/components/playground/learning-stats"
import { CourseCategories } from "@/components/playground/course-categories"
import { FeaturedCourses } from "@/components/playground/featured-courses"
import { MyProgress } from "@/components/playground/my-progress"
import { ContinueLearning } from "@/components/playground/continue-learning"
import { Achievements } from "@/components/playground/achievements"
import { RecommendedPaths } from "@/components/playground/recommended-paths"
import { CoursesProvider } from "@/components/playground/courses-context"

export default function PlaygroundPage() {
  return (
    <CoursesProvider>
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Learning Playground</h1>
            <p className="text-sm md:text-base text-muted-foreground">Enhance your financial knowledge with curated courses</p>
          </div>
        </div>

        {/* Learning Stats */}
        <LearningStats />

        {/* Continue Learning and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <ContinueLearning />
          </div>
          <MyProgress />
        </div>

        {/* Course Categories */}
        <CourseCategories />

        {/* Featured Courses and Recommended Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <FeaturedCourses />
          </div>
          <RecommendedPaths />
        </div>

        {/* Achievements */}
        <Achievements />
      </div>
    </CoursesProvider>
  )
}
