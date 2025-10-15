-- Ensure reactions modify post_comments counts via trigger
DROP TRIGGER IF EXISTS trg_update_comment_reaction_counts ON public.comment_reactions;

CREATE TRIGGER trg_update_comment_reaction_counts
AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
FOR EACH ROW
EXECUTE FUNCTION public.update_comment_reaction_counts();