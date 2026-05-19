-- Optional planned budget per concert (null = no budget set)
ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS budget numeric;

COMMENT ON COLUMN public.concerts.budget IS 'Optional planned budget in USD; null means no budget set';

-- Allow users to update and delete their own concerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'concerts' AND policyname = 'Users can update own concerts'
  ) THEN
    CREATE POLICY "Users can update own concerts"
      ON public.concerts
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'concerts' AND policyname = 'Users can delete own concerts'
  ) THEN
    CREATE POLICY "Users can delete own concerts"
      ON public.concerts
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;
