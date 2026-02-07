import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SyllabusModule, type Lesson } from "@/components/courses/SyllabusModule";
import { InstructorCard } from "@/components/courses/InstructorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourse, useIsEnrolled, useEnroll, useLessonProgress } from "@/hooks/use-courses";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  Users, 
  Star,
  CheckCircle2,
  Download,
  Globe,
  Calendar,
  Loader2
} from "lucide-react";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: course, isLoading, error } = useCourse(courseId);
  const { data: isEnrolled } = useIsEnrolled(course?.id);
  const { data: lessonProgress } = useLessonProgress(course?.id);
  const enrollMutation = useEnroll();

  const handleStartLearning = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!course) return;

    // If not enrolled, enroll first
    if (!isEnrolled) {
      try {
        await enrollMutation.mutateAsync(course.id);
        toast({
          title: "Enrolled successfully!",
          description: "You can now start learning.",
        });
      } catch (error) {
        toast({
          title: "Enrollment failed",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    // Navigate to the first lesson
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learn/${course.slug}/${firstLesson.id}`);
    } else {
      navigate(`/learn/${course.slug}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="hero-gradient">
          <div className="container-wide py-12 md:py-20">
            <div className="grid items-start gap-12 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div>
                <Skeleton className="aspect-video w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-wide py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/catalog")}>Browse Courses</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate course stats
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalDurationMinutes = course.modules?.reduce((acc, m) => {
    return acc + (m.lessons?.reduce((lessonAcc, l) => {
      const durationStr = l.duration || "0";
      const minutes = parseInt(durationStr.replace(/[^0-9]/g, "")) || 0;
      return lessonAcc + minutes;
    }, 0) || 0);
  }, 0) || 0;
  const totalHours = Math.ceil(totalDurationMinutes / 60);

  // Build lessons for syllabus with progress
  const progressMap = new Map(lessonProgress?.map((p) => [p.lesson_id, p]) || []);

  const syllabusModules = course.modules?.map((module) => ({
    title: module.title,
    description: module.description || "",
    lessons: module.lessons?.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration || "5 min",
      type: lesson.type as "reading" | "quiz" | "assignment",
      isCompleted: progressMap.get(lesson.id)?.completed || false,
    })) || [],
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Course Header */}
      <section className="hero-gradient">
        <div className="container-wide py-12 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-3">
            {/* Course Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="beginner" className="capitalize">
                  Beginner
                </Badge>
                {course.price === 0 && <Badge variant="new">Free</Badge>}
              </div>

              <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
                {course.title}
              </h1>
              <p className="text-lg text-primary-foreground/80">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i <= 4 ? "fill-warning text-warning" : "fill-primary-foreground/30 text-primary-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-primary-foreground">4.5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>New Course</span>
                </div>
              </div>

              {course.instructor && (
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructor.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                    alt={course.instructor.full_name || "Instructor"}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/20"
                  />
                  <div>
                    <p className="text-sm text-primary-foreground/70">Created by</p>
                    <p className="font-medium text-primary-foreground">
                      {course.instructor.full_name || "Unknown Instructor"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(course.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                <div className="video-container group cursor-pointer">
                  <img
                    src={course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop"}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Lifetime access</p>
                  </div>

                  <Button 
                    variant="accent" 
                    size="xl" 
                    className="w-full" 
                    onClick={handleStartLearning}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    {isEnrolled ? "Continue Learning" : "Start Learning"}
                  </Button>

                  <div className="space-y-3 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-foreground">This course includes:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        {totalHours}+ hours of content
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        {totalLessons} lessons
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Lifetime access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              {/* Description */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Syllabus */}
              {syllabusModules.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Course Syllabus</h2>
                    <p className="text-sm text-muted-foreground">
                      {course.modules?.length || 0} modules • {totalLessons} lessons • {totalHours}h
                    </p>
                  </div>
                  <div className="space-y-4">
                    {syllabusModules.map((module, index) => (
                      <SyllabusModule
                        key={index}
                        moduleNumber={index + 1}
                        title={module.title}
                        description={module.description}
                        lessons={module.lessons}
                        isExpanded={index === 0}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor */}
              {course.instructor && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Your Instructor</h2>
                  <InstructorCard
                    name={course.instructor.full_name || "Unknown"}
                    title={course.instructor.bio || "Instructor"}
                    avatar={course.instructor.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                    bio={course.instructor.bio || ""}
                    coursesCount={1}
                    studentsCount={0}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Course Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Duration
                      </div>
                      <span className="font-medium text-foreground">{totalHours}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        Lessons
                      </div>
                      <span className="font-medium text-foreground">{totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        Certificate
                      </div>
                      <span className="font-medium text-foreground">Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join learners and start your journey today.
          </p>
          <Button 
            variant="accent" 
            size="xl" 
            className="mt-8" 
            onClick={handleStartLearning}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            Start Learning Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
