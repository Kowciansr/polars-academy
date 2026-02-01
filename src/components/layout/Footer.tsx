import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-base font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-lg font-bold text-foreground">Polars Academy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Master Python Polars with expert-led courses designed for data professionals.
            </p>
          </div>

          {/* Learning */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Learning</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="text-sm text-muted-foreground hover:text-foreground">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="text-sm text-muted-foreground hover:text-foreground">
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://pola.rs/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                  Polars Docs
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-sm text-muted-foreground hover:text-foreground">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Polars Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
