import { useState } from "react";
import ReactPlayer from "react-player";
import { Quiz, type QuizQuestion } from "@/components/courses/Quiz";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Play,
  FileText,
  HelpCircle,
  Download,
  CheckCircle2,
  Clock,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock course data - will be replaced with real data from database
const mockCourse = {
  id: "polars-fundamentals",
  title: "Python Polars Fundamentals",
  modules: [
    {
      id: "mod-1",
      title: "Introduction to Polars",
      lessons: [
        { id: "les-1-1", title: "What is Polars?", type: "video", duration: "8:24", completed: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-1-2", title: "Installation & Setup", type: "video", duration: "5:12", completed: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-1-3", title: "Your First DataFrame", type: "video", duration: "12:45", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-1-4", title: "Module Quiz", type: "quiz", duration: "10 min", completed: false },
      ],
    },
    {
      id: "mod-2",
      title: "Data Selection & Filtering",
      lessons: [
        { id: "les-2-1", title: "Selecting Columns", type: "video", duration: "10:30", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-2-2", title: "Filtering Rows", type: "video", duration: "14:20", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-2-3", title: "Practice Exercise", type: "assignment", duration: "20 min", completed: false },
        { id: "les-2-4", title: "Advanced Filtering", type: "video", duration: "11:15", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      ],
    },
    {
      id: "mod-3",
      title: "Data Transformations",
      lessons: [
        { id: "les-3-1", title: "Creating New Columns", type: "video", duration: "9:45", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-3-2", title: "Expressions Deep Dive", type: "video", duration: "18:30", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-3-3", title: "Lazy vs Eager Execution", type: "video", duration: "15:00", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-3-4", title: "Transformation Quiz", type: "quiz", duration: "15 min", completed: false },
      ],
    },
    {
      id: "mod-4",
      title: "Aggregations & GroupBy",
      lessons: [
        { id: "les-4-1", title: "Basic Aggregations", type: "video", duration: "12:00", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-4-2", title: "GroupBy Operations", type: "video", duration: "16:45", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-4-3", title: "Window Functions", type: "video", duration: "20:30", completed: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "les-4-4", title: "Final Project", type: "assignment", duration: "45 min", completed: false },
      ],
    },
  ],
};

// Mock quiz data - will be replaced with real data from database
const mockQuizzes: Record<string, QuizQuestion[]> = {
  "les-1-4": [
    {
      id: "q1",
      question: "What is Polars primarily used for?",
      options: [
        "Web development",
        "Data manipulation and analysis",
        "Machine learning model training",
        "Database management",
      ],
      correctAnswer: 1,
      explanation: "Polars is a fast DataFrame library designed for data manipulation and analysis, similar to pandas but with better performance.",
    },
    {
      id: "q2",
      question: "Which language is Polars written in?",
      options: ["Python", "JavaScript", "Rust", "C++"],
      correctAnswer: 2,
      explanation: "Polars is written in Rust, which provides memory safety and excellent performance. It has Python bindings for easy use.",
    },
    {
      id: "q3",
      question: "What is a key advantage of Polars over pandas?",
      options: [
        "More functions available",
        "Better documentation",
        "Lazy evaluation and parallel processing",
        "Easier syntax",
      ],
      correctAnswer: 2,
      explanation: "Polars supports lazy evaluation which optimizes query execution, and automatically parallelizes operations for better performance.",
    },
  ],
  "les-3-4": [
    {
      id: "q1",
      question: "What does lazy evaluation mean in Polars?",
      options: [
        "Operations are executed immediately",
        "Operations are queued and optimized before execution",
        "Only simple operations are supported",
        "Data is loaded partially",
      ],
      correctAnswer: 1,
      explanation: "Lazy evaluation means operations are not executed immediately. Instead, they are queued and the query plan is optimized before execution.",
    },
    {
      id: "q2",
      question: "How do you trigger execution of a lazy DataFrame?",
      options: [
        "Call .execute()",
        "Call .collect()",
        "Call .run()",
        "It executes automatically",
      ],
      correctAnswer: 1,
      explanation: "The .collect() method triggers the execution of a lazy DataFrame and returns an eager DataFrame with the results.",
    },
  ],
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return Play;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<string[]>(["mod-1", "mod-2"]);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  // Find current lesson
  const allLessons = mockCourse.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId) || 0;
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  const prevLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  // Calculate progress
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

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
            {mockCourse.title}
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
                  {mockCourse.modules.map((module, moduleIndex) => {
                    const moduleCompleted = module.lessons.every((l) => l.completed);
                    const moduleLessonsCompleted = module.lessons.filter((l) => l.completed).length;

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
                                {moduleLessonsCompleted}/{module.lessons.length} completed
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
                            {module.lessons.map((lesson) => {
                              const Icon = getLessonIcon(lesson.type);
                              const isActive = lesson.id === currentLesson?.id;

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
                                    {lesson.completed ? (
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
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}
                                      </span>
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
            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              {currentLesson?.type === "video" && currentLesson?.videoUrl ? (
                <ReactPlayer
                  src={currentLesson.videoUrl}
                  width="100%"
                  height="100%"
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    if (video.duration) {
                      setPlayed(video.currentTime / video.duration);
                    }
                  }}
                  onEnded={() => {
                    setPlaying(false);
                    // Auto-advance to next lesson when video ends
                    if (nextLesson) {
                      navigateToLesson(nextLesson.id);
                    }
                  }}
                  controls
                />
              ) : currentLesson?.type === "quiz" ? (
                <div className="bg-muted/30">
                  <Quiz
                    questions={mockQuizzes[currentLesson.id] || []}
                    title={currentLesson.title}
                    onComplete={(score, total) => {
                      console.log(`Quiz completed: ${score}/${total}`);
                      // TODO: Save progress to database
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Assignment content will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="p-6 md:p-8">
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{currentLesson?.moduleTitle}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Lesson {currentLessonIndex + 1}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {currentLesson?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {currentLesson?.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentLesson?.duration}
                  </span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mark-complete"
                      checked={currentLesson?.completed}
                      className="border-accent data-[state=checked]:bg-accent"
                    />
                    <label
                      htmlFor="mark-complete"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Mark as complete
                    </label>
                  </div>
                </div>
              </div>

              {/* Lesson Description */}
              <div className="prose prose-sm max-w-none mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  In this lesson, you'll learn the fundamentals of working with Polars DataFrames.
                  We'll cover how to create DataFrames from various sources, explore their structure,
                  and perform basic operations. By the end, you'll have a solid foundation for
                  data manipulation with Polars.
                </p>
              </div>

              {/* Resources */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Jupyter Notebook</p>
                      <p className="text-sm text-muted-foreground">lesson-03-dataframes.ipynb</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Lesson Slides</p>
                      <p className="text-sm text-muted-foreground">slides-03.pdf</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Code Snippet Example */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Code Example</h3>
                <div className="rounded-lg bg-[hsl(var(--primary)/0.05)] border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                    <span className="text-sm font-medium text-muted-foreground">Python</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Copy
                    </Button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-foreground">{`import polars as pl

# Create a DataFrame from a dictionary
df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["New York", "London", "Paris"]
})

# Display the DataFrame
print(df)

# Basic operations
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns}")
print(f"Schema: {df.schema}")`}</code>
                  </pre>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => navigateToLesson(prevLesson.id)}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous:</span>
                    <span className="truncate max-w-[150px]">{prevLesson.title}</span>
                  </Button>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Button
                    variant="accent"
                    onClick={() => navigateToLesson(nextLesson.id)}
                    className="flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Next:</span>
                    <span className="truncate max-w-[150px]">{nextLesson.title}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="accent" className="flex items-center gap-2">
                    Complete Course
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
