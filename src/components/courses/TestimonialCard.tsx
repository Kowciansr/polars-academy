import { Star } from "lucide-react";

export interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export function TestimonialCard({
  name,
  role,
  company,
  avatar,
  content,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="testimonial-card flex flex-col gap-4">
      {/* Rating */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-warning text-warning"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="flex-1 text-sm text-muted-foreground italic">
        "{content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {role} at {company}
          </p>
        </div>
      </div>
    </div>
  );
}
