import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            Cika Online Courses
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="default" size="sm" asChild>
            <Link to="/course/python-zero-to-hero">Start Course</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-wide flex flex-col gap-2 py-4">
            <Button variant="default" size="sm" asChild>
              <Link to="/course/python-zero-to-hero" onClick={() => setIsMobileMenuOpen(false)}>
                Start Course
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
