import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Star, Users } from "lucide-react";

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  lessonsCount: number;
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  studentsCount: number;
  isNew?: boolean;
  progress?: number;
}

export function CourseCard({
  id,
  title,
  description,
  instructor,
  thumbnail,
  duration,
  lessonsCount,
  level,
  rating,
  studentsCount,
  isNew,
  progress,
}: CourseCardProps) {
  return (
    <Link to={`/course/${id}`} className="group block">
      <article className="course-card h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <Badge variant="new" className="absolute left-3 top-3">
              New
            </Badge>
          )}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="progress-bar h-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-5">
          {/* Level Badge */}
          <Badge variant={level} className="w-fit capitalize">
            {level}
          </Badge>

          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>

          {/* Instructor */}
          <p className="text-sm text-muted-foreground">
            By <span className="font-medium text-foreground">{instructor}</span>
          </p>

          {/* Meta Info */}
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{lessonsCount} lessons</span>
            </div>
          </div>

          {/* Rating & Students */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{studentsCount.toLocaleString()} students</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
