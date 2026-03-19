import { Laptop, Zap, Shield, GraduationCap } from "lucide-react";

const reasons = [
  {
    icon: Laptop,
    title: "Zero Setup Required",
    description: "Everything runs in your browser via Pyodide. No Python installation, no terminal — just open and start coding.",
  },
  {
    icon: Zap,
    title: "Learn by Doing",
    description: "Every lesson includes runnable code snippets you can edit and execute. Concepts stick when you write real code.",
  },
  {
    icon: Shield,
    title: "Progress Tracking",
    description: "Mark lessons complete, take quizzes, and track your journey through the course with persistent progress.",
  },
  {
    icon: GraduationCap,
    title: "Built for Beginners",
    description: "No prior programming experience needed. We start from absolute zero and build up to functions and data structures.",
  },
];

export function WhyThisCourse() {
  return (
    <section className="py-20 bg-background">
      <div className="container-wide">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Why This Course</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Built for a Great Learning Experience
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <reason.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
