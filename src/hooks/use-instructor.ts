import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, Json } from "@/integrations/supabase/types";

export type InstructorCourse = Tables<"courses"> & {
  modules?: (Tables<"modules"> & {
    lessons?: Tables<"lessons">[];
  })[];
  enrollmentCount?: number;
};

// Check if current user is an instructor
export function useIsInstructor() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-instructor", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["instructor", "admin"]);

      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
  });
}

// Fetch instructor's courses
export function useInstructorCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["instructor-courses", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: courses, error } = await supabase
        .from("courses")
        .select(`
          *,
          modules(
            *,
            lessons(*)
          )
        `)
        .eq("instructor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch enrollment counts
      const courseIds = courses?.map((c) => c.id) || [];
      if (courseIds.length === 0) return [];

      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .in("course_id", courseIds);

      const enrollmentCounts = new Map<string, number>();
      enrollments?.forEach((e) => {
        enrollmentCounts.set(e.course_id, (enrollmentCounts.get(e.course_id) || 0) + 1);
      });

      return courses?.map((course) => ({
        ...course,
        modules: course.modules?.sort((a, b) => a.order_index - b.order_index).map((mod) => ({
          ...mod,
          lessons: mod.lessons?.sort((a, b) => a.order_index - b.order_index),
        })),
        enrollmentCount: enrollmentCounts.get(course.id) || 0,
      })) as InstructorCourse[];
    },
    enabled: !!user,
  });
}

// Create a new course
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      slug: string;
      description?: string;
      price?: number;
      thumbnailUrl?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data: course, error } = await supabase
        .from("courses")
        .insert({
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          price: data.price || 0,
          thumbnail_url: data.thumbnailUrl || null,
          instructor_id: user.id,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;
      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Update a course
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      data,
    }: {
      courseId: string;
      data: {
        title?: string;
        slug?: string;
        description?: string;
        price?: number;
        thumbnailUrl?: string;
        isPublished?: boolean;
      };
    }) => {
      const { data: course, error } = await supabase
        .from("courses")
        .update({
          title: data.title,
          slug: data.slug,
          description: data.description,
          price: data.price,
          thumbnail_url: data.thumbnailUrl,
          is_published: data.isPublished,
        })
        .eq("id", courseId)
        .select()
        .single();

      if (error) throw error;
      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

// Delete a course
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

// Create a module
export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      courseId: string;
      title: string;
      description?: string;
      orderIndex: number;
    }) => {
      const { data: module, error } = await supabase
        .from("modules")
        .insert({
          course_id: data.courseId,
          title: data.title,
          description: data.description || null,
          order_index: data.orderIndex,
        })
        .select()
        .single();

      if (error) throw error;
      return module;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Update a module
export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      data,
    }: {
      moduleId: string;
      data: {
        title?: string;
        description?: string;
        orderIndex?: number;
      };
    }) => {
      const { data: module, error } = await supabase
        .from("modules")
        .update({
          title: data.title,
          description: data.description,
          order_index: data.orderIndex,
        })
        .eq("id", moduleId)
        .select()
        .single();

      if (error) throw error;
      return module;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Delete a module
export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", moduleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Create a lesson
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      moduleId: string;
      title: string;
      type: "video" | "quiz" | "assignment";
      duration?: string;
      content?: Json;
      orderIndex: number;
    }) => {
      const { data: lesson, error } = await supabase
        .from("lessons")
        .insert({
          module_id: data.moduleId,
          title: data.title,
          type: data.type,
          duration: data.duration || null,
          content: data.content || {},
          order_index: data.orderIndex,
        })
        .select()
        .single();

      if (error) throw error;
      return lesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Update a lesson
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      data,
    }: {
      lessonId: string;
      data: {
        title?: string;
        type?: "video" | "quiz" | "assignment";
        duration?: string;
        content?: Json;
        orderIndex?: number;
      };
    }) => {
      const { data: lesson, error } = await supabase
        .from("lessons")
        .update({
          title: data.title,
          type: data.type,
          duration: data.duration,
          content: data.content,
          order_index: data.orderIndex,
        })
        .eq("id", lessonId)
        .select()
        .single();

      if (error) throw error;
      return lesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Delete a lesson
export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

// Become an instructor (request instructor role)
export function useBecomeInstructor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");

      // Check if already has instructor role
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "instructor")
        .maybeSingle();

      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role: "instructor",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["is-instructor"] });
    },
  });
}
