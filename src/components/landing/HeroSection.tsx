import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient">
        {/* Decorative code lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-20 top-10 rotate-12 font-mono text-sm text-primary-foreground leading-relaxed whitespace-pre">
{`def hello():
    print("Hello, World!")
    
for i in range(10):
    x = i ** 2
    
data = [1, 2, 3, 4, 5]
result = sum(data)`}
          </div>
          <div className="absolute -left-10 bottom-20 -rotate-6 font-mono text-sm text-primary-foreground leading-relaxed whitespace-pre">
{`names = ["Alice", "Bob"]
ages = {"Alice": 30}

def greet(name):
    return f"Hi {name}!"}`}
          </div>
        </div>

        <div className="container-wide relative z-10 py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <Badge variant="secondary" className="bg-accent/20 text-primary-foreground border-accent/30 px-4 py-1.5 text-sm">
              <Terminal className="mr-1.5 h-3.5 w-3.5" />
              Interactive Python Course
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Learn Python by
              <span className="block text-accent mt-1">Writing Real Code</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 md:text-xl leading-relaxed">
              A hands-on course with an in-browser Python IDE. No setup needed — 
              write, run, and learn from 4 interactive lessons covering variables, 
              loops, functions, and more.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-2">
              <Button variant="hero" size="xl" asChild>
                <Link to="/course/python-zero-to-hero">
                  <Play className="h-5 w-5" />
                  Start the Course
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/catalog">
                  View Syllabus
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Mini stats */}
            <div className="flex items-center justify-center gap-8 pt-4 text-primary-foreground/70 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-foreground">4</p>
                <p>Lessons</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-foreground">Free</p>
                <p>No cost</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-foreground">Live</p>
                <p>Code Editor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
