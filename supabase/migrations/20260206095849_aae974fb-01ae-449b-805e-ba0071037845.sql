-- Allow users to self-assign instructor role (for demo purposes)
-- In production, this would typically require admin approval
CREATE POLICY "Users can become instructors" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'instructor'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'instructor'
  )
);