
-- Create table to track user reactions on comments
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON public.comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON public.comment_reactions(user_id);

-- Enable RLS
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all reactions" ON public.comment_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can add reactions" ON public.comment_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" ON public.comment_reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON public.comment_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update comment reaction counts
CREATE OR REPLACE FUNCTION update_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the counts in post_comments table
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments
    SET 
      like_count = like_count + CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END,
      love_count = love_count + CASE WHEN NEW.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count + CASE WHEN NEW.reaction_type = 'haha' THEN 1 ELSE 0 END
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Decrease old reaction count
    UPDATE post_comments
    SET 
      like_count = like_count - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END,
      love_count = love_count - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END
    WHERE id = OLD.comment_id;
    
    -- Increase new reaction count
    UPDATE post_comments
    SET 
      like_count = like_count + CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END,
      love_count = love_count + CASE WHEN NEW.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count + CASE WHEN NEW.reaction_type = 'haha' THEN 1 ELSE 0 END
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments
    SET 
      like_count = GREATEST(0, like_count - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END),
      love_count = GREATEST(0, love_count - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END),
      haha_count = GREATEST(0, haha_count - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END)
    WHERE id = OLD.comment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS comment_reaction_counts_trigger ON public.comment_reactions;
CREATE TRIGGER comment_reaction_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reaction_counts();
