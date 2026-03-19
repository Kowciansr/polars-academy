import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { CourseHighlights } from "@/components/landing/CourseHighlights";
import { LessonPreview } from "@/components/landing/LessonPreview";
import { WhyThisCourse } from "@/components/landing/WhyThisCourse";
import { CTASection } from "@/components/landing/CTASection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CourseHighlights />
      <LessonPreview />
      <WhyThisCourse />
      <CTASection />
      <Footer />
    </div>
  );
}
