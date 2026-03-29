import { PythonIDE } from "./PythonIDE";
import { Flashcards, type Flashcard } from "./Flashcards";
import { BookOpen, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeSnippet {
  title?: string;
  description?: string;
  code: string;
}

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    content: any;
  };
  isCompleted: boolean;
  isPending: boolean;
  onComplete: () => void;
}

export function LessonContent({ lesson, isCompleted, isPending, onComplete }: LessonContentProps) {
  const content = lesson.content as { body?: string; code_snippets?: CodeSnippet[]; flashcards?: Flashcard[] } | null;
  const body = content?.body || "";
  const codeSnippets = content?.code_snippets || [];
  const flashcards = content?.flashcards || [];

  if (lesson.type === "assignment") {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium text-accent">Lab / Assignment</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-4">{lesson.title}</h2>
        {body && (
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            {body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-foreground leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        {codeSnippets.map((snippet, i) => (
          <div key={i} className="mb-6">
            <PythonIDE
              initialCode={snippet.code}
              title={snippet.title}
              description={snippet.description}
            />
          </div>
        ))}
        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <CompleteButton isCompleted={isCompleted} isPending={isPending} onComplete={onComplete} />
        </div>
      </div>
    );
  }

  // Reading type (default)
  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-primary">Reading</span>
      </div>
      {body ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-foreground leading-relaxed text-base mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No content available for this lesson.</p>
      )}

      {codeSnippets.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Try it yourself</h3>
          {codeSnippets.map((snippet, i) => (
            <PythonIDE
              key={i}
              initialCode={snippet.code}
              title={snippet.title}
              description={snippet.description}
            />
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border flex justify-end">
        <CompleteButton isCompleted={isCompleted} isPending={isPending} onComplete={onComplete} />
      </div>
    </div>
  );
}

function CompleteButton({ isCompleted, isPending, onComplete }: { isCompleted: boolean; isPending: boolean; onComplete: () => void }) {
  return (
    <Button onClick={onComplete} disabled={isPending || isCompleted}>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <CheckCircle2 className="h-4 w-4 mr-2" />
      )}
      {isCompleted ? "Completed" : "Mark as Complete"}
    </Button>
  );
}
