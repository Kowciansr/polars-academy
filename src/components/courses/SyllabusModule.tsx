import { useState } from "react";
import { ChevronDown, PlayCircle, FileText, HelpCircle, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "assignment";
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface SyllabusModuleProps {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

const lessonIcons = {
  video: PlayCircle,
  quiz: HelpCircle,
  assignment: FileText,
};

export function SyllabusModule({
  moduleNumber,
  title,
  description,
  lessons,
  isExpanded: initialExpanded = false,
}: SyllabusModuleProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const totalDuration = lessons.reduce((acc, l) => {
    const [mins] = l.duration.split(" ");
    return acc + parseInt(mins);
  }, 0);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {moduleNumber}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden text-right text-sm text-muted-foreground sm:block">
            <p>{lessons.length} lessons</p>
            <p>{totalDuration} min</p>
          </div>
          {completedLessons > 0 && (
            <Badge variant="completed" className="hidden sm:flex">
              {completedLessons}/{lessons.length}
            </Badge>
          )}
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Lessons */}
      {isExpanded && (
        <div className="border-t border-border">
          {lessons.map((lesson) => {
            const Icon = lessonIcons[lesson.type];
            return (
              <div
                key={lesson.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0",
                  lesson.isLocked && "opacity-50",
                  !lesson.isLocked && "hover:bg-muted/30 cursor-pointer"
                )}
              >
                {lesson.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : lesson.isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Icon className="h-5 w-5 text-muted-foreground" />
                )}
                
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    lesson.isCompleted ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {lesson.title}
                  </p>
                </div>

                <Badge variant={lesson.type} className="hidden sm:flex">
                  {lesson.type}
                </Badge>
                
                <span className="text-sm text-muted-foreground">
                  {lesson.duration}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
