import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/use-courses";
import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react";

const levels = ["All Levels", "beginner", "intermediate", "advanced"];
const durations = ["All Durations", "0-5 hours", "5-10 hours", "10+ hours"];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [showFilters, setShowFilters] = useState(false);

  const { data: courses, isLoading, error } = useCourses();

  // Calculate duration in hours from lessons
  const getCourseDuration = (course: NonNullable<typeof courses>[0]) => {
    // For now, return a placeholder - this would need lesson duration data
    return 8; // Default to 8 hours
  };

  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (course.instructor?.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    // Level filtering would need to be added to the course schema
    const matchesLevel = selectedLevel === "All Levels";

    const hours = getCourseDuration(course);
    const matchesDuration =
      selectedDuration === "All Durations" ||
      (selectedDuration === "0-5 hours" && hours <= 5) ||
      (selectedDuration === "5-10 hours" && hours > 5 && hours <= 10) ||
      (selectedDuration === "10+ hours" && hours > 10);

    return matchesSearch && matchesLevel && matchesDuration;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All Levels");
    setSelectedDuration("All Durations");
  };

  const hasActiveFilters =
    searchQuery || selectedLevel !== "All Levels" || selectedDuration !== "All Durations";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Course Catalog
            </h1>
            <p className="mt-4 text-muted-foreground">
              Explore our comprehensive collection of courses. 
              From beginner fundamentals to advanced techniques.
            </p>

            {/* Search */}
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="container-wide">
          {/* Filter Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredCourses.length} course${filteredCourses.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mb-8 rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap gap-6">
                {/* Level Filter */}
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Level</p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <Button
                        key={level}
                        variant={selectedLevel === level ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLevel(level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Duration</p>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(duration)}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedLevel !== "All Levels" && (
                <Badge variant="secondary" className="gap-1 px-3 py-1 capitalize">
                  Level: {selectedLevel}
                  <button onClick={() => setSelectedLevel("All Levels")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedDuration !== "All Durations" && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Duration: {selectedDuration}
                  <button onClick={() => setSelectedDuration("All Durations")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-20 text-center">
              <p className="text-lg text-destructive">
                Failed to load courses. Please try again.
              </p>
            </div>
          )}

          {/* Course Grid */}
          {!isLoading && !error && filteredCourses.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.slug}
                  title={course.title}
                  description={course.description || ""}
                  instructor={course.instructor?.full_name || "Unknown Instructor"}
                  thumbnail={course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop"}
                  duration={`${getCourseDuration(course)} hours`}
                  lessonsCount={course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}
                  level="beginner"
                  rating={4.5}
                  studentsCount={0}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredCourses.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              {hasActiveFilters ? (
                <>
                  <p className="text-lg text-muted-foreground">
                    No courses found matching your criteria.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </>
              ) : (
                <p className="text-lg text-muted-foreground">
                  No courses available yet. Check back soon!
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
