import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="hero-gradient py-20">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
          Ready to Start Coding?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
          Jump into the course and write your first Python program in under 5 minutes. 
          It's completely free.
        </p>
        <div className="mt-8">
          <Button variant="hero" size="xl" asChild>
            <Link to="/course/python-zero-to-hero">
              Start Learning Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
