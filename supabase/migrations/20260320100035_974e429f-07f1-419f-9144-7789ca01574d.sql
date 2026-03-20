-- Fix 1: Drop self-grant instructor policy and weak admin policy on user_roles
DROP POLICY IF EXISTS "Users can become instructors" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Replace with explicit per-operation admin-only policies
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Restrict lesson/module access for paid courses, keep free courses public
DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON public.modules;
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON public.lessons;

-- Modules: free published courses are public, paid ones require enrollment
CREATE POLICY "Anyone can view modules of free published courses"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = modules.course_id
        AND c.is_published = true
        AND (c.price IS NULL OR c.price = 0)
    )
  );

CREATE POLICY "Enrolled users can view modules of paid courses"
  ON public.modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = modules.course_id
        AND c.is_published = true
        AND c.price > 0
        AND public.is_enrolled(auth.uid(), c.id)
    )
  );

-- Lessons: free published courses are public, paid ones require enrollment
CREATE POLICY "Anyone can view lessons of free published courses"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND c.is_published = true
        AND (c.price IS NULL OR c.price = 0)
    )
  );

CREATE POLICY "Enrolled users can view lessons of paid courses"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND c.is_published = true
        AND c.price > 0
        AND public.is_enrolled(auth.uid(), c.id)
    )
  );