-- Create enum for lesson types
CREATE TYPE public.lesson_type AS ENUM ('video', 'quiz', 'assignment');

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_id UUID NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type lesson_type NOT NULL DEFAULT 'video',
  duration TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_score NUMERIC(5, 2),
  quiz_answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for performance
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_modules_order ON public.modules(course_id, order_index);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_order ON public.lessons(module_id, order_index);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_slug ON public.courses(slug);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND course_id = _course_id
  )
$$;

-- Helper function to check if user is instructor of a course
CREATE OR REPLACE FUNCTION public.is_instructor(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = _course_id AND instructor_id = _user_id
  )
$$;

-- COURSES POLICIES
-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses"
ON public.courses FOR SELECT
USING (is_published = true);

-- Instructors and admins can view their own courses (including unpublished)
CREATE POLICY "Instructors can view own courses"
ON public.courses FOR SELECT
USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Instructors can create courses
CREATE POLICY "Instructors can create courses"
ON public.courses FOR INSERT
WITH CHECK (
  instructor_id = auth.uid() AND 
  (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'))
);

-- Instructors can update their own courses
CREATE POLICY "Instructors can update own courses"
ON public.courses FOR UPDATE
USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Instructors can delete their own courses
CREATE POLICY "Instructors can delete own courses"
ON public.courses FOR DELETE
USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- MODULES POLICIES
-- Anyone can view modules of published courses
CREATE POLICY "Anyone can view modules of published courses"
ON public.modules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE id = course_id AND is_published = true
  )
);

-- Instructors can view modules of their courses
CREATE POLICY "Instructors can view own course modules"
ON public.modules FOR SELECT
USING (public.is_instructor(auth.uid(), course_id));

-- Instructors can manage modules
CREATE POLICY "Instructors can insert modules"
ON public.modules FOR INSERT
WITH CHECK (public.is_instructor(auth.uid(), course_id));

CREATE POLICY "Instructors can update modules"
ON public.modules FOR UPDATE
USING (public.is_instructor(auth.uid(), course_id));

CREATE POLICY "Instructors can delete modules"
ON public.modules FOR DELETE
USING (public.is_instructor(auth.uid(), course_id));

-- LESSONS POLICIES
-- Anyone can view lessons of published courses
CREATE POLICY "Anyone can view lessons of published courses"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.modules m
    JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = module_id AND c.is_published = true
  )
);

-- Instructors can view lessons of their courses
CREATE POLICY "Instructors can view own course lessons"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = module_id AND public.is_instructor(auth.uid(), m.course_id)
  )
);

-- Instructors can manage lessons
CREATE POLICY "Instructors can insert lessons"
ON public.lessons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = module_id AND public.is_instructor(auth.uid(), m.course_id)
  )
);

CREATE POLICY "Instructors can update lessons"
ON public.lessons FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = module_id AND public.is_instructor(auth.uid(), m.course_id)
  )
);

CREATE POLICY "Instructors can delete lessons"
ON public.lessons FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = module_id AND public.is_instructor(auth.uid(), m.course_id)
  )
);

-- ENROLLMENTS POLICIES
-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
ON public.enrollments FOR SELECT
USING (user_id = auth.uid());

-- Instructors can view enrollments for their courses
CREATE POLICY "Instructors can view course enrollments"
ON public.enrollments FOR SELECT
USING (public.is_instructor(auth.uid(), course_id));

-- Users can enroll themselves in published courses
CREATE POLICY "Users can enroll in courses"
ON public.enrollments FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND is_published = true)
);

-- Users can update their own enrollment (e.g., mark as completed)
CREATE POLICY "Users can update own enrollment"
ON public.enrollments FOR UPDATE
USING (user_id = auth.uid());

-- LESSON PROGRESS POLICIES
-- Users can view their own progress
CREATE POLICY "Users can view own progress"
ON public.lesson_progress FOR SELECT
USING (user_id = auth.uid());

-- Instructors can view progress for their course lessons
CREATE POLICY "Instructors can view course progress"
ON public.lesson_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE l.id = lesson_id AND public.is_instructor(auth.uid(), m.course_id)
  )
);

-- Users can create their own progress records
CREATE POLICY "Users can create own progress"
ON public.lesson_progress FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
ON public.lesson_progress FOR UPDATE
USING (user_id = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();