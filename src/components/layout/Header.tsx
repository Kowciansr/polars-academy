import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            Polars Academy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <Link
            to="/catalog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalog
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        {/* Search & Auth */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          {!isLoading && (
            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(profile?.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(profile?.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{profile?.full_name || "Learner"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button variant="accent" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-wide flex flex-col gap-2 py-4">
            <Link
              to="/courses"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/catalog"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button variant="accent" asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
