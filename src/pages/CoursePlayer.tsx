import { useState, useEffect } from "react";
import { Quiz, type QuizQuestion } from "@/components/courses/Quiz";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourse, useLessonProgress, useUpdateLessonProgress } from "@/hooks/use-courses";
import { useAuth } from "@/contexts/AuthContext";

const getLessonIcon = (type: string) => {
  switch (type) {
    case "reading":
      return BookOpen;
    case "quiz":
      return HelpCircle;
    case "assignment":
      return FileText;
    default:
      return BookOpen;
  }
};

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<string[]>([]);

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: lessonProgress, isLoading: progressLoading } = useLessonProgress(course?.id);
  const updateProgressMutation = useUpdateLessonProgress();

  // Build flat lesson list
  const allLessons = course?.modules?.flatMap((m) =>
    m.lessons?.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })) || []
  ) || [];

  // Find current lesson
  const currentLessonIndex = lessonId 
    ? allLessons.findIndex((l) => l.id === lessonId)
    : 0;
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  const prevLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  // Build progress map
  const progressMap = new Map(lessonProgress?.map((p) => [p.lesson_id, p]) || []);

  // Calculate progress
  const completedCount = lessonProgress?.filter((p) => p.completed).length || 0;
  const progressPercent = allLessons.length > 0 
    ? Math.round((completedCount / allLessons.length) * 100) 
    : 0;

  // Auto-expand module containing current lesson
  useEffect(() => {
    if (currentLesson?.moduleId && !openModules.includes(currentLesson.moduleId)) {
      setOpenModules((prev) => [...prev, currentLesson.moduleId]);
    }
  }, [currentLesson?.moduleId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !courseLoading) {
      navigate("/login");
    }
  }, [user, courseLoading, navigate]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const navigateToLesson = (lessonId: string) => {
    navigate(`/learn/${courseId}/${lessonId}`);
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !user) return;

    try {
      await updateProgressMutation.mutateAsync({
        lessonId: currentLesson.id,
        completed: true,
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    if (!currentLesson || !user) return;

    try {
      await updateProgressMutation.mutateAsync({
        lessonId: currentLesson.id,
        completed: true,
        quizScore: (score / total) * 100,
      });
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  };

  // Get reading content from lesson
  const getReadingContent = (): string => {
    if (!currentLesson?.content) return "";
    const content = currentLesson.content as { body?: string };
    return content.body || "";
  };

  // Loading state
  if (courseLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-4 w-32" />
        </header>
        <div className="flex flex-1">
          <aside className="w-80 border-r border-border bg-card p-4 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </aside>
          <main className="flex-1 p-8">
            <Skeleton className="aspect-video w-full max-w-4xl" />
          </main>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/catalog")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link
            to={`/course/${courseId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Back to course</span>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <h1 className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{progressPercent}% complete</span>
            <Progress value={progressPercent} className="w-24 h-2" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300",
            sidebarOpen ? "w-80" : "w-0 md:w-0",
            "absolute md:relative z-40 h-[calc(100vh-3.5rem)] md:h-auto"
          )}
        >
          {sidebarOpen && (
            <>
              {/* Course Progress Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Course Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedCount}/{allLessons.length} lessons
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Modules List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {course.modules?.map((module, moduleIndex) => {
                    const moduleLessons = module.lessons || [];
                    const moduleLessonsCompleted = moduleLessons.filter(
                      (l) => progressMap.get(l.id)?.completed
                    ).length;
                    const moduleCompleted = moduleLessonsCompleted === moduleLessons.length && moduleLessons.length > 0;

                    return (
                      <Collapsible
                        key={module.id}
                        open={openModules.includes(module.id)}
                        onOpenChange={() => toggleModule(module.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                                moduleCompleted
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {moduleCompleted ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                moduleIndex + 1
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {module.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {moduleLessonsCompleted}/{moduleLessons.length} completed
                              </p>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                openModules.includes(module.id) && "rotate-180"
                              )}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-4 border-l border-border pl-4 py-1">
                            {moduleLessons.map((lesson) => {
                              const Icon = getLessonIcon(lesson.type);
                              const isActive = lesson.id === currentLesson?.id;
                              const isCompleted = progressMap.get(lesson.id)?.completed;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => navigateToLesson(lesson.id)}
                                  className={cn(
                                    "w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors",
                                    isActive
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted/50 text-foreground"
                                  )}
                                >
                                  <div className="mt-0.5">
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-4 w-4 text-accent" />
                                    ) : (
                                      <Icon
                                        className={cn(
                                          "h-4 w-4",
                                          isActive ? "text-primary" : "text-muted-foreground"
                                        )}
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        "text-sm line-clamp-2",
                                        isActive && "font-medium"
                                      )}
                                    >
                                      {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {lesson.type}
                                      </Badge>
                                      {lesson.duration && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {lesson.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </aside>

        {/* Sidebar Toggle for Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-50 h-12 w-6 items-center justify-center rounded-r-lg border border-l-0 border-border bg-card hover:bg-muted transition-colors"
          style={{ left: sidebarOpen ? "320px" : "0" }}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Content based on lesson type */}
            <div className="bg-card border-b border-border">
              {currentLesson?.type === "reading" ? (
                <div className="max-w-3xl mx-auto p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Reading</span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                      {getReadingContent() || "No content available for this lesson."}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border flex justify-end">
                    <Button
                      onClick={handleLessonComplete}
                      disabled={updateProgressMutation.isPending || !!progressMap.get(currentLesson.id)?.completed}
                    >
                      {updateProgressMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      {progressMap.get(currentLesson.id)?.completed ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </div>
              ) : currentLesson?.type === "quiz" ? (
                <div className="p-6">
                  <Quiz
                    questions={(() => {
                      if (!currentLesson?.content) return [];
                      const content = currentLesson.content as { questions?: QuizQuestion[] };
                      return content.questions || [];
                    })()}
                    title={currentLesson.title}
                    onComplete={handleQuizComplete}
                  />
                </div>
              ) : (
                <div className="max-w-3xl mx-auto p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-accent">Lab / Assignment</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {currentLesson?.title || "Assignment"}
                  </h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                      {getReadingContent() || "Complete this assignment to continue with the course."}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border flex justify-end">
                    <Button
                      variant="accent"
                      onClick={handleLessonComplete}
                      disabled={updateProgressMutation.isPending || !!progressMap.get(currentLesson?.id || "")?.completed}
                    >
                      {updateProgressMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      {progressMap.get(currentLesson?.id || "")?.completed ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info & Navigation */}
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {currentLesson?.moduleTitle}
                  </p>
                  <h2 className="text-xl font-bold text-foreground">
                    {currentLesson?.title || "Select a lesson"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lesson Description */}
            {currentLesson && (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="capitalize">
                    {currentLesson.type}
                  </Badge>
                  {currentLesson.duration && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentLesson.duration}
                    </span>
                  )}
                  {progressMap.get(currentLesson.id)?.completed && (
                    <Badge variant="completed">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
