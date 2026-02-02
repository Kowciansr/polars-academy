import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SyllabusModule, type Lesson } from "@/components/courses/SyllabusModule";
import { InstructorCard } from "@/components/courses/InstructorCard";
import { TestimonialCard } from "@/components/courses/TestimonialCard";
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  Users, 
  Star,
  CheckCircle2,
  Download,
  Globe,
  Calendar,
  ArrowRight
} from "lucide-react";

// Sample course data
const courseData = {
  id: "polars-fundamentals",
  title: "Python Polars Fundamentals",
  subtitle: "Master the fastest DataFrame library in Python from scratch",
  description: "Learn how to process and analyze data with unprecedented speed using Python Polars. This comprehensive course covers everything from basic data manipulation to advanced lazy evaluation patterns. Perfect for data engineers, analysts, and Python developers looking to supercharge their data workflows.",
  instructor: {
    name: "Sarah Chen",
    title: "Senior Data Engineer at Netflix, Polars Core Contributor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    bio: "Sarah has been working with data at scale for over 10 years. As a core contributor to the Polars project, she brings deep expertise in high-performance data processing.",
    coursesCount: 5,
    studentsCount: 25000,
  },
  thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
  duration: "8 hours",
  lessonsCount: 42,
  level: "beginner" as const,
  rating: 4.9,
  ratingsCount: 2840,
  studentsCount: 12500,
  lastUpdated: "January 2026",
  language: "English",
  features: [
    "8+ hours of HD video content",
    "42 interactive lessons",
    "Downloadable Jupyter notebooks",
    "Hands-on coding exercises",
    "5 real-world projects",
    "Certificate of completion",
    "Lifetime access",
    "Community forum access",
  ],
  learningOutcomes: [
    "Understand Polars' architecture and why it's faster than pandas",
    "Master DataFrame creation, selection, and manipulation",
    "Apply filtering, grouping, and aggregation operations",
    "Implement lazy evaluation for optimal performance",
    "Work with multiple data sources (CSV, Parquet, JSON)",
    "Build efficient data pipelines for production use",
  ],
  modules: [
    {
      title: "Getting Started with Polars",
      description: "Installation, setup, and first steps",
      lessons: [
        { id: "1-1", title: "Introduction to Polars", duration: "8 min", type: "video" as const },
        { id: "1-2", title: "Installation and Setup", duration: "5 min", type: "video" as const },
        { id: "1-3", title: "Your First DataFrame", duration: "12 min", type: "video" as const },
        { id: "1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz" as const },
      ],
    },
    {
      title: "Data Selection & Manipulation",
      description: "Select, filter, and transform your data",
      lessons: [
        { id: "2-1", title: "Selecting Columns", duration: "10 min", type: "video" as const },
        { id: "2-2", title: "Filtering Rows", duration: "12 min", type: "video" as const },
        { id: "2-3", title: "Adding and Modifying Columns", duration: "15 min", type: "video" as const },
        { id: "2-4", title: "Hands-on: Data Cleaning", duration: "20 min", type: "assignment" as const },
        { id: "2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz" as const },
      ],
    },
    {
      title: "Aggregations & GroupBy",
      description: "Powerful data summarization techniques",
      lessons: [
        { id: "3-1", title: "Basic Aggregations", duration: "10 min", type: "video" as const },
        { id: "3-2", title: "GroupBy Operations", duration: "15 min", type: "video" as const },
        { id: "3-3", title: "Window Functions", duration: "18 min", type: "video" as const },
        { id: "3-4", title: "Hands-on: Sales Analysis", duration: "25 min", type: "assignment" as const },
        { id: "3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz" as const },
      ],
    },
    {
      title: "Lazy Evaluation & Performance",
      description: "Optimize your data pipelines",
      lessons: [
        { id: "4-1", title: "Understanding Lazy Evaluation", duration: "12 min", type: "video" as const, isLocked: true },
        { id: "4-2", title: "Query Optimization", duration: "15 min", type: "video" as const, isLocked: true },
        { id: "4-3", title: "Memory Management", duration: "10 min", type: "video" as const, isLocked: true },
        { id: "4-4", title: "Benchmarking Your Code", duration: "12 min", type: "video" as const, isLocked: true },
        { id: "4-5", title: "Final Project", duration: "60 min", type: "assignment" as const, isLocked: true },
      ],
    },
  ],
};

const testimonials = [
  {
    name: "David Kim",
    role: "Data Analyst",
    company: "Stripe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content: "This course gave me the foundation I needed to switch from pandas to Polars. Now I can process our daily reports 10x faster!",
    rating: 5,
  },
  {
    name: "Lisa Park",
    role: "ML Engineer",
    company: "Spotify",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "Sarah explains complex concepts in a way that's easy to understand. The hands-on projects were the highlight for me.",
    rating: 5,
  },
];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/learn/${courseId || courseData.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Course Header */}
      <section className="hero-gradient">
        <div className="container-wide py-12 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-3">
            {/* Course Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={courseData.level} className="capitalize">
                  {courseData.level}
                </Badge>
                <Badge variant="new">Bestseller</Badge>
              </div>

              <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
                {courseData.title}
              </h1>
              <p className="text-lg text-primary-foreground/80">
                {courseData.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i <= Math.floor(courseData.rating) ? "fill-warning text-warning" : "fill-primary-foreground/30 text-primary-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-primary-foreground">
                    {courseData.rating}
                  </span>
                  <span>({courseData.ratingsCount.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{courseData.studentsCount.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/20"
                />
                <div>
                  <p className="text-sm text-primary-foreground/70">Created by</p>
                  <p className="font-medium text-primary-foreground">
                    {courseData.instructor.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {courseData.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>{courseData.language}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                <div className="video-container group cursor-pointer">
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">Free</p>
                    <p className="text-sm text-muted-foreground">Lifetime access</p>
                  </div>

                  <Button variant="accent" size="xl" className="w-full" onClick={handleStartLearning}>
                    <Play className="h-5 w-5" />
                    Start Learning
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4" />
                    Download Notebooks
                  </Button>

                  <div className="space-y-3 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-foreground">This course includes:</p>
                    <ul className="space-y-2">
                      {courseData.features.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              {/* Description */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {courseData.description}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">What You'll Learn</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {courseData.learningOutcomes.map((outcome) => (
                    <div key={outcome} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                      <p className="text-sm text-muted-foreground">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Syllabus */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Course Syllabus</h2>
                  <p className="text-sm text-muted-foreground">
                    {courseData.modules.length} modules • {courseData.lessonsCount} lessons • {courseData.duration}
                  </p>
                </div>
                <div className="space-y-4">
                  {courseData.modules.map((module, index) => (
                    <SyllabusModule
                      key={module.title}
                      moduleNumber={index + 1}
                      title={module.title}
                      description={module.description}
                      lessons={module.lessons}
                      isExpanded={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Your Instructor</h2>
                <InstructorCard {...courseData.instructor} />
              </div>

              {/* Reviews */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Student Reviews</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.name} {...testimonial} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              {/* Quick Stats */}
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Course Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Duration
                      </div>
                      <span className="font-medium text-foreground">{courseData.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        Lessons
                      </div>
                      <span className="font-medium text-foreground">{courseData.lessonsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        Certificate
                      </div>
                      <span className="font-medium text-foreground">Yes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Students
                      </div>
                      <span className="font-medium text-foreground">
                        {courseData.studentsCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to Master Python Polars?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join {courseData.studentsCount.toLocaleString()} learners and start your journey to becoming a Polars expert today.
          </p>
          <Button variant="accent" size="xl" className="mt-8" onClick={handleStartLearning}>
            <Play className="h-5 w-5" />
            Start Learning Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
