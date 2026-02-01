import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressRing } from "@/components/courses/ProgressRing";
import { 
  Play, 
  BookOpen, 
  Award, 
  Clock,
  ArrowRight,
  Trophy,
  Target,
  Flame
} from "lucide-react";

// Sample user data
const userData = {
  name: "Alex Thompson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  streak: 12,
  totalHours: 24,
  coursesCompleted: 2,
  certificatesEarned: 2,
};

const enrolledCourses = [
  {
    id: "polars-fundamentals",
    title: "Python Polars Fundamentals",
    instructor: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
    progress: 65,
    nextLesson: "Window Functions",
    totalLessons: 42,
    completedLessons: 27,
    lastAccessed: "Today",
  },
  {
    id: "polars-advanced",
    title: "Advanced Polars Techniques",
    instructor: "Marcus Johnson",
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=340&fit=crop",
    progress: 20,
    nextLesson: "Lazy Evaluation Patterns",
    totalLessons: 56,
    completedLessons: 11,
    lastAccessed: "2 days ago",
  },
];

const completedCourses = [
  {
    id: "python-basics",
    title: "Python for Data Science",
    completedDate: "Dec 2025",
    certificateId: "CERT-12345",
  },
  {
    id: "pandas-mastery",
    title: "Pandas Mastery",
    completedDate: "Nov 2025",
    certificateId: "CERT-12344",
  },
];

const recommendedCourses = [
  {
    id: "polars-data-engineering",
    title: "Data Engineering with Polars",
    instructor: "Emma Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
    level: "intermediate" as const,
    duration: "15 hours",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="container-wide">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-primary/10"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {userData.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">
                  Keep up the great work on your learning journey.
                </p>
              </div>
            </div>
            <Button variant="accent" asChild>
              <Link to="/catalog">
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Flame className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userData.streak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userData.totalHours}h</p>
                  <p className="text-sm text-muted-foreground">Learning Time</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userData.coursesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userData.certificatesEarned}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Continue Learning */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-foreground">Continue Learning</h2>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg sm:aspect-square sm:w-32">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Next:</span> {course.nextLesson}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ProgressRing progress={course.progress} size={48} strokeWidth={4} />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {course.completedLessons}/{course.totalLessons} lessons
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Last accessed {course.lastAccessed}
                              </p>
                            </div>
                          </div>
                          <Button variant="accent" size="sm" asChild>
                            <Link to={`/course/${course.id}/learn`}>
                              <Play className="h-4 w-4" />
                              Continue
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Completed Courses */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-foreground">Completed Courses</h2>
                <div className="space-y-3">
                  {completedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <Trophy className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">Completed {course.completedDate}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Award className="h-4 w-4" />
                        View Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weekly Goal */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Weekly Goal</h3>
                  <Badge variant="inProgress">In Progress</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressRing progress={60} size={80} strokeWidth={6} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">3/5</p>
                    <p className="text-sm text-muted-foreground">lessons this week</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Complete 2 more lessons to reach your weekly goal!
                </p>
              </div>

              {/* Recommended */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Recommended for You</h3>
                {recommendedCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="block group"
                  >
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <Badge variant={course.level} className="mb-2 capitalize">
                      {course.level}
                    </Badge>
                    <h4 className="font-medium text-foreground group-hover:text-primary">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      By {course.instructor} • {course.duration}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Achievements */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                      <Flame className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">10 Day Streak</p>
                      <p className="text-xs text-muted-foreground">Earned 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">First Quiz Ace</p>
                      <p className="text-xs text-muted-foreground">Earned 5 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
