ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS category_tags text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.concerts.category_tags IS 'Optional category tags (e.g. Rock, Festival). Multiple allowed per concert.';
