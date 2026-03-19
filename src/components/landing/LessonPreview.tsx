import { Play, TerminalSquare } from "lucide-react";

export function LessonPreview() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container-wide">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Interactive Learning</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Code Runs Right in Your Browser
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            No downloads, no installations. Our built-in Python IDE powered by Pyodide 
            lets you write and execute real Python code instantly.
          </p>
        </div>

        {/* Fake IDE Preview */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border" style={{ boxShadow: "var(--shadow-xl)" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 bg-foreground px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/80" />
              <div className="h-3 w-3 rounded-full bg-warning/80" />
              <div className="h-3 w-3 rounded-full bg-success/80" />
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <TerminalSquare className="h-4 w-4 text-muted" />
              <span className="text-xs font-medium text-muted">Python IDE — Lesson 2</span>
            </div>
          </div>

          {/* Code area */}
          <div className="bg-card p-6 font-mono text-sm leading-relaxed">
            <div className="space-y-1">
              <p><span className="text-accent font-semibold">name</span> = <span className="text-success">"Alice"</span></p>
              <p><span className="text-accent font-semibold">age</span> = <span className="text-warning">30</span></p>
              <p><span className="text-accent font-semibold">is_student</span> = <span className="text-warning">True</span></p>
              <p className="pt-2"><span className="text-muted-foreground">print</span>(<span className="text-success">f"</span><span className="text-success">{'{'}</span><span className="text-accent">name</span><span className="text-success">{'}'} is {'{'}</span><span className="text-accent">age</span><span className="text-success">{'}'} years old</span><span className="text-success">"</span>)</p>
            </div>
          </div>

          {/* Output area */}
          <div className="border-t border-border bg-muted/50 px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-3.5 w-3.5 text-success" />
              <span className="text-xs font-semibold text-success uppercase tracking-wider">Output</span>
            </div>
            <p className="font-mono text-sm text-foreground">Alice is 30 years old</p>
          </div>
        </div>
      </div>
    </section>
  );
}
