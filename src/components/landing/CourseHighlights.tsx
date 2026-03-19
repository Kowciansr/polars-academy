import { BookOpen, Code2, Brain, Trophy } from "lucide-react";

const lessons = [
  {
    icon: BookOpen,
    number: "01",
    title: "Why Python?",
    description: "Discover why Python is the world's most popular programming language and write your first \"Hello, World!\" program.",
    tags: ["Introduction", "print()"],
  },
  {
    icon: Code2,
    number: "02",
    title: "Variables & Data Types",
    description: "Master strings, integers, floats, and booleans. Learn how Python stores and manipulates different kinds of data.",
    tags: ["Variables", "Strings", "Numbers"],
  },
  {
    icon: Brain,
    number: "03",
    title: "Lists, Loops & Functions",
    description: "Build reusable code with functions, iterate through data with loops, and organize information in lists.",
    tags: ["for loops", "def", "Lists"],
  },
  {
    icon: Trophy,
    number: "04",
    title: "Quiz: Python Basics",
    description: "Test your knowledge with an interactive quiz covering everything from the course. Earn your completion!",
    tags: ["Assessment", "Certificate"],
  },
];

export function CourseHighlights() {
  return (
    <section className="py-20 bg-background">
      <div className="container-wide">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Course Curriculum</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            4 Lessons to Python Fluency
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Each lesson includes explanations, runnable code examples, and hands-on exercises 
            you complete directly in your browser.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.number}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <lesson.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Lesson {lesson.number}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lesson.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
