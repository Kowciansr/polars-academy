import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressRing } from "@/components/courses/ProgressRing";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrollments, useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
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

export default function Dashboard() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: allCourses, isLoading: coursesLoading } = useCourses();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const isLoading = authLoading || enrollmentsLoading || coursesLoading;

  // Calculate enrollment progress
  const enrolledCourses = enrollments?.map((enrollment) => {
    const course = enrollment.course;
    if (!course) return null;

    const totalLessons = course.modules?.reduce(
      (acc, m) => acc + (m.lessons?.length || 0),
      0
    ) || 0;

    // For now, we'd need to fetch lesson progress separately
    // This is a simplified version
    const completedLessons = 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      id: course.slug,
      title: course.title,
      instructor: course.instructor?.full_name || "Unknown Instructor",
      thumbnail: course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
      progress,
      nextLesson: course.modules?.[0]?.lessons?.[0]?.title || "Start learning",
      totalLessons,
      completedLessons,
      lastAccessed: new Date(enrollment.enrolled_at).toLocaleDateString(),
      enrolledAt: enrollment.enrolled_at,
    };
  }).filter(Boolean) || [];

  // Get recommended courses (courses user isn't enrolled in)
  const enrolledCourseIds = new Set(enrollments?.map((e) => e.course_id) || []);
  const recommendedCourses = (allCourses || [])
    .filter((course) => !enrolledCourseIds.has(course.id))
    .slice(0, 3);

  // Calculate stats
  const totalHours = 0; // Would need to track watch time
  const coursesCompleted = enrollments?.filter((e) => e.completed_at).length || 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container-wide">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="container-wide">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                alt={profile?.full_name || "User"}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-primary/10"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {profile?.full_name?.split(" ")[0] || "Learner"}!
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
                  <p className="text-2xl font-bold text-foreground">0</p>
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
                  <p className="text-2xl font-bold text-foreground">{totalHours}h</p>
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
                  <p className="text-2xl font-bold text-foreground">{coursesCompleted}</p>
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
                  <p className="text-2xl font-bold text-foreground">{coursesCompleted}</p>
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
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                        <Skeleton className="h-24 w-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course!.id}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg sm:aspect-square sm:w-32">
                          <img
                            src={course!.thumbnail}
                            alt={course!.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{course!.title}</h3>
                            <p className="text-sm text-muted-foreground">By {course!.instructor}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Next:</span> {course!.nextLesson}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ProgressRing progress={course!.progress} size={48} strokeWidth={4} />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {course!.completedLessons}/{course!.totalLessons} lessons
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Enrolled {course!.lastAccessed}
                                </p>
                              </div>
                            </div>
                            <Button variant="accent" size="sm" asChild>
                              <Link to={`/learn/${course!.id}`}>
                                <Play className="h-4 w-4" />
                                Continue
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Button variant="accent" asChild>
                      <Link to="/catalog">Browse Courses</Link>
                    </Button>
                  </div>
                )}
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
                  <ProgressRing progress={0} size={80} strokeWidth={6} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">0/5</p>
                    <p className="text-sm text-muted-foreground">lessons this week</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Complete 5 lessons to reach your weekly goal!
                </p>
              </div>

              {/* Recommended */}
              {recommendedCourses.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Recommended for You</h3>
                  <div className="space-y-4">
                    {recommendedCourses.map((course) => (
                      <Link
                        key={course.id}
                        to={`/course/${course.slug}`}
                        className="block group"
                      >
                        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
                          <img
                            src={course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop"}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <Badge variant="beginner" className="mb-2 capitalize">
                          Beginner
                        </Badge>
                        <h4 className="font-medium text-foreground group-hover:text-primary">
                          {course.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          By {course.instructor?.full_name || "Unknown"}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                      <Flame className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">7 Day Streak</p>
                      <p className="text-xs text-muted-foreground">Not earned yet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">First Quiz Ace</p>
                      <p className="text-xs text-muted-foreground">Not earned yet</p>
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
