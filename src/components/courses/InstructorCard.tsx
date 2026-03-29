import { Badge } from "@/components/ui/badge";

export interface InstructorCardProps {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  coursesCount: number;
}

export function InstructorCard({
  name,
  title,
  avatar,
  bio,
  coursesCount,
}: InstructorCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center sm:flex-row sm:items-start sm:text-left">
      {/* Avatar */}
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl ring-4 ring-primary/10">
            {name.split(" ").map(n => n[0]).join("")}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          ★
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>

        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Badge variant="secondary">
            {coursesCount} Courses
          </Badge>
        </div>
      </div>
    </div>
  );
}
