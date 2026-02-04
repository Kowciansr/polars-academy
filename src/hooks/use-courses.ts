import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Course = Tables<"courses"> & {
  instructor?: Tables<"profiles">;
  modules?: (Tables<"modules"> & {
    lessons?: Tables<"lessons">[];
  })[];
  enrollmentCount?: number;
};

export type Module = Tables<"modules"> & {
  lessons?: Tables<"lessons">[];
};

export type Lesson = Tables<"lessons">;
export type Enrollment = Tables<"enrollments">;
export type LessonProgress = Tables<"lesson_progress">;

// Fetch all published courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!courses) return [];

      // Fetch instructors for all courses
      const instructorIds = [...new Set(courses.map((c) => c.instructor_id))];
      const { data: instructors } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", instructorIds);

      const instructorMap = new Map(
        instructors?.map((i) => [i.user_id, i]) || []
      );

      return courses.map((course) => ({
        ...course,
        instructor: instructorMap.get(course.instructor_id),
      })) as Course[];
    },
  });
}

// Fetch a single course with modules and lessons
export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;

      // First try to find by slug
      let { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", courseId)
        .maybeSingle();

      // If not found by slug, try by id
      if (!course && !error) {
        const result = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .maybeSingle();
        
        course = result.data;
        error = result.error;
      }

      if (error) throw error;
      if (!course) return null;

      // Fetch instructor
      const { data: instructor } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", course.instructor_id)
        .maybeSingle();

      // Fetch modules with lessons
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`
          *,
          lessons(*)
        `)
        .eq("course_id", course.id)
        .order("order_index", { ascending: true });

      if (modulesError) throw modulesError;

      // Sort lessons within each module
      const sortedModules = modules?.map((mod) => ({
        ...mod,
        lessons: mod.lessons?.sort((a, b) => a.order_index - b.order_index),
      }));

      return { ...course, instructor, modules: sortedModules } as Course;
    },
    enabled: !!courseId,
  });
}

// Fetch user's enrollments
export function useEnrollments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First fetch enrollments
      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(
            *,
            modules(
              *,
              lessons(*)
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      if (!enrollments) return [];

      // Fetch instructor profiles separately
      const instructorIds = enrollments
        .map((e) => e.course?.instructor_id)
        .filter(Boolean) as string[];

      const { data: instructors } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", instructorIds);

      const instructorMap = new Map(
        instructors?.map((i) => [i.user_id, i]) || []
      );

      // Attach instructors to courses
      return enrollments.map((enrollment) => ({
        ...enrollment,
        course: enrollment.course ? {
          ...enrollment.course,
          instructor: instructorMap.get(enrollment.course.instructor_id),
        } : null,
      }));
    },
    enabled: !!user,
  });
}

// Check if user is enrolled in a course
export function useIsEnrolled(courseId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollment", user?.id, courseId],
    queryFn: async () => {
      if (!user || !courseId) return false;

      const { data, error } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!courseId,
  });
}

// Enroll in a course
export function useEnroll() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("Must be logged in to enroll");

      const { data, error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: courseId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", user?.id, courseId] });
    },
  });
}

// Fetch lesson progress for a course
export function useLessonProgress(courseId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["lesson-progress", user?.id, courseId],
    queryFn: async () => {
      if (!user || !courseId) return [];

      // Get all lesson IDs for this course
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("lessons(id)")
        .eq("course_id", courseId);

      if (modulesError) throw modulesError;

      const lessonIds = modules?.flatMap((m) => m.lessons?.map((l) => l.id) || []) || [];

      if (lessonIds.length === 0) return [];

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!user && !!courseId,
  });
}

// Update lesson progress
export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      lessonId,
      completed,
      quizScore,
      quizAnswers,
    }: {
      lessonId: string;
      completed?: boolean;
      quizScore?: number;
      quizAnswers?: Record<string, number>;
    }) => {
      if (!user) throw new Error("Must be logged in");

      // Check if progress exists
      const { data: existing } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      const progressData = {
        user_id: user.id,
        lesson_id: lessonId,
        completed: completed ?? false,
        completed_at: completed ? new Date().toISOString() : null,
        quiz_score: quizScore ?? null,
        quiz_answers: quizAnswers ?? null,
      };

      if (existing) {
        const { data, error } = await supabase
          .from("lesson_progress")
          .update(progressData)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("lesson_progress")
          .insert(progressData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}
