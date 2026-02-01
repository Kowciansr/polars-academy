import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Sample courses data
const allCourses = [
  {
    id: "polars-fundamentals",
    title: "Python Polars Fundamentals",
    description: "Master the basics of Polars DataFrame library. Learn data manipulation, filtering, and aggregation with blazing-fast performance.",
    instructor: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
    duration: "8 hours",
    lessonsCount: 42,
    level: "beginner" as const,
    rating: 4.9,
    studentsCount: 12500,
    isNew: true,
    tags: ["fundamentals", "dataframes", "basics"],
  },
  {
    id: "polars-advanced",
    title: "Advanced Polars Techniques",
    description: "Deep dive into lazy evaluation, window functions, and complex data transformations for production data pipelines.",
    instructor: "Marcus Johnson",
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=340&fit=crop",
    duration: "12 hours",
    lessonsCount: 56,
    level: "advanced" as const,
    rating: 4.8,
    studentsCount: 8200,
    tags: ["advanced", "lazy evaluation", "optimization"],
  },
  {
    id: "polars-data-engineering",
    title: "Data Engineering with Polars",
    description: "Build scalable ETL pipelines using Polars. Integrate with databases, cloud storage, and streaming data sources.",
    instructor: "Emma Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
    duration: "15 hours",
    lessonsCount: 68,
    level: "intermediate" as const,
    rating: 4.7,
    studentsCount: 5800,
    tags: ["data engineering", "ETL", "pipelines"],
  },
  {
    id: "polars-sql",
    title: "SQL to Polars Migration",
    description: "Transition your SQL skills to Polars. Learn equivalent operations and when to choose Polars over traditional SQL.",
    instructor: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=340&fit=crop",
    duration: "6 hours",
    lessonsCount: 32,
    level: "beginner" as const,
    rating: 4.6,
    studentsCount: 4200,
    tags: ["SQL", "migration", "basics"],
  },
  {
    id: "polars-performance",
    title: "Polars Performance Optimization",
    description: "Master performance tuning techniques. Learn memory management, parallel processing, and benchmarking strategies.",
    instructor: "Marcus Johnson",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=340&fit=crop",
    duration: "10 hours",
    lessonsCount: 45,
    level: "advanced" as const,
    rating: 4.9,
    studentsCount: 3100,
    isNew: true,
    tags: ["performance", "optimization", "memory"],
  },
  {
    id: "polars-pandas-comparison",
    title: "From Pandas to Polars",
    description: "A comprehensive guide for pandas users transitioning to Polars. Compare syntax, performance, and best practices.",
    instructor: "Emma Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
    duration: "4 hours",
    lessonsCount: 24,
    level: "beginner" as const,
    rating: 4.7,
    studentsCount: 9800,
    tags: ["pandas", "migration", "comparison"],
  },
];

const levels = ["All Levels", "beginner", "intermediate", "advanced"];
const durations = ["All Durations", "0-5 hours", "5-10 hours", "10+ hours"];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;

    const hours = parseInt(course.duration);
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
              Explore our comprehensive collection of Python Polars courses. 
              From beginner fundamentals to advanced data engineering.
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
              {filteredCourses.length} course{filteredCourses.length !== 1 && "s"} found
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

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No courses found matching your criteria.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
