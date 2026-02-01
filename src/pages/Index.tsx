import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { InstructorCard } from "@/components/courses/InstructorCard";
import { TestimonialCard } from "@/components/courses/TestimonialCard";
import { 
  Play, 
  CheckCircle2, 
  Users, 
  Award, 
  BookOpen, 
  Code2, 
  Zap,
  ArrowRight,
  Star
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

// Sample data
const featuredCourses = [
  {
    id: "polars-fundamentals",
    title: "Python Polars Fundamentals",
    description: "Master the basics of Polars DataFrame library. Learn data manipulation, filtering, and aggregation with blazing-fast performance.",
    instructor: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
    duration: "8 hours",
    lessonsCount: 42,
    level: "beginner" as const,
    rating: 4.9,
    studentsCount: 12500,
    isNew: true,
  },
  {
    id: "polars-advanced",
    title: "Advanced Polars Techniques",
    description: "Deep dive into lazy evaluation, window functions, and complex data transformations for production data pipelines.",
    instructor: "Marcus Johnson",
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=340&fit=crop",
    duration: "12 hours",
    lessonsCount: 56,
    level: "advanced" as const,
    rating: 4.8,
    studentsCount: 8200,
  },
  {
    id: "polars-data-engineering",
    title: "Data Engineering with Polars",
    description: "Build scalable ETL pipelines using Polars. Integrate with databases, cloud storage, and streaming data sources.",
    instructor: "Emma Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
    duration: "15 hours",
    lessonsCount: 68,
    level: "intermediate" as const,
    rating: 4.7,
    studentsCount: 5800,
  },
];

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Senior Data Engineer",
    company: "DataFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    content: "This course transformed my data processing workflow. Polars is now my go-to tool for any data-intensive project. The hands-on exercises were incredibly valuable.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "ML Engineer",
    company: "TechVision Labs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Coming from pandas, I was amazed at how intuitive Polars is. The course structure made learning seamless, and now I can process datasets 10x faster.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Analytics Lead",
    company: "FinanceHub",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "The advanced techniques module alone was worth the entire course. Lazy evaluation has completely changed how I approach big data problems.",
    rating: 5,
  },
];

const stats = [
  { value: "25,000+", label: "Active Learners" },
  { value: "50+", label: "Expert Lessons" },
  { value: "4.9", label: "Average Rating" },
  { value: "95%", label: "Completion Rate" },
];

const features = [
  {
    icon: Code2,
    title: "Hands-on Coding",
    description: "Practice with real datasets and interactive Jupyter notebooks included with every lesson.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Learn performance optimization techniques that make Polars up to 100x faster than pandas.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description: "Get recognized with shareable certificates upon completing each course module.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join our active Discord community of data professionals learning together.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBg} 
            alt="" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>

        <div className="container-wide relative z-10 py-20 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge variant="new" className="px-4 py-1.5 text-sm">
                  🚀 New Course Available
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
                  Master Python Polars
                  <span className="block text-accent">The Fast Way</span>
                </h1>
                <p className="mx-auto max-w-xl text-lg text-primary-foreground/80 lg:mx-0">
                  Join thousands of data engineers and analysts learning the fastest DataFrame 
                  library in Python. Build production-ready data pipelines with expert-led courses.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/course/polars-fundamentals">
                    <Play className="h-5 w-5" />
                    Start Learning Free
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/catalog">
                    Browse Courses
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-primary bg-muted"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-primary-foreground/70">
                    <span className="font-semibold text-primary-foreground">25,000+</span> learners enrolled
                  </p>
                </div>
              </div>
            </div>

            {/* Video Preview Card */}
            <div className="mx-auto w-full max-w-lg lg:mx-0">
              <div className="overflow-hidden rounded-2xl bg-card shadow-hero">
                <div className="video-container group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
                    alt="Course Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground">
                    Watch Course Preview
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get a glimpse of what you'll learn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">Featured Courses</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Start Your Polars Journey
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From beginner to advanced, our courses cover everything you need to become 
              a Polars expert. Each course includes hands-on projects and quizzes.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/catalog">
                View All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">Why Polars Academy</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Succeed
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">Meet Your Instructor</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Learn From Industry Experts
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <InstructorCard
              name="Sarah Chen"
              title="Senior Data Engineer at Netflix, Polars Core Contributor"
              avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
              bio="Sarah has been working with data at scale for over 10 years. As a core contributor to the Polars project, she brings deep expertise in high-performance data processing. She's passionate about teaching and has helped thousands of developers level up their data skills."
              coursesCount={5}
              studentsCount={25000}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">Student Reviews</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What Our Learners Say
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-20">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to Transform Your Data Skills?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join over 25,000 data professionals who have accelerated their careers 
            with Polars Academy. Start with our free fundamentals course today.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
