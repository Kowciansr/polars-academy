-- Replace 'video' with 'reading' in the lesson_type enum
ALTER TYPE public.lesson_type RENAME TO lesson_type_old;

CREATE TYPE public.lesson_type AS ENUM ('reading', 'quiz', 'assignment');

-- Update existing lessons column to use new enum (cast through text)
ALTER TABLE public.lessons 
  ALTER COLUMN type DROP DEFAULT;

ALTER TABLE public.lessons 
  ALTER COLUMN type TYPE public.lesson_type 
  USING (
    CASE WHEN type::text = 'video' THEN 'reading'::public.lesson_type
         ELSE type::text::public.lesson_type
    END
  );

ALTER TABLE public.lessons 
  ALTER COLUMN type SET DEFAULT 'reading'::public.lesson_type;

DROP TYPE public.lesson_type_old;