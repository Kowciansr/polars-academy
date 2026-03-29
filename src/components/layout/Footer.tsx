import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-lg font-bold text-foreground">Cika Online Courses</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cika Online Courses. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
