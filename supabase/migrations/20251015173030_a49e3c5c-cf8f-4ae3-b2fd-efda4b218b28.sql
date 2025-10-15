-- 1) Deduplicate any existing duplicate reactions to avoid unique constraint failure
WITH ranked AS (
  SELECT id, comment_id, user_id,
         ROW_NUMBER() OVER (PARTITION BY comment_id, user_id ORDER BY created_at DESC, id DESC) AS rn
  FROM public.comment_reactions
)
DELETE FROM public.comment_reactions cr
USING ranked r
WHERE cr.id = r.id AND r.rn > 1;

-- 2) Enforce single reaction per user per comment
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'comment_reactions_unique'
  ) THEN
    ALTER TABLE public.comment_reactions
    ADD CONSTRAINT comment_reactions_unique UNIQUE (comment_id, user_id);
  END IF;
END $$;

-- 3) Attach trigger to keep post_comments reaction counters in sync
DROP TRIGGER IF EXISTS trg_update_comment_reaction_counts ON public.comment_reactions;
CREATE TRIGGER trg_update_comment_reaction_counts
AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
FOR EACH ROW EXECUTE FUNCTION public.update_comment_reaction_counts();

-- 4) Ensure realtime works reliably for these tables
ALTER TABLE public.comment_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'comment_reactions'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.comment_reactions';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'post_comments'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments';
  END IF;
END $$;