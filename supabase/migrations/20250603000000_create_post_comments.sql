
-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES seller_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  like_count INTEGER DEFAULT 0,
  love_count INTEGER DEFAULT 0,
  haha_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view comments"
  ON post_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON post_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for tracking user reactions to comments
CREATE TABLE IF NOT EXISTS post_comment_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'haha')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create index for reactions
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON post_comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON post_comment_reactions(user_id);

-- Enable RLS for reactions
ALTER TABLE post_comment_reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reactions
CREATE POLICY "Anyone can view reactions"
  ON post_comment_reactions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their reactions"
  ON post_comment_reactions
  FOR ALL
  USING (auth.uid() = user_id);

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seller_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seller_posts 
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment count
CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Function to update reaction counts
CREATE OR REPLACE FUNCTION update_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE post_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    ELSIF NEW.reaction_type = 'love' THEN
      UPDATE post_comments SET love_count = love_count + 1 WHERE id = NEW.comment_id;
    ELSIF NEW.reaction_type = 'haha' THEN
      UPDATE post_comments SET haha_count = haha_count + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE post_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
    ELSIF OLD.reaction_type = 'love' THEN
      UPDATE post_comments SET love_count = GREATEST(love_count - 1, 0) WHERE id = OLD.comment_id;
    ELSIF OLD.reaction_type = 'haha' THEN
      UPDATE post_comments SET haha_count = GREATEST(haha_count - 1, 0) WHERE id = OLD.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Remove old reaction
    IF OLD.reaction_type = 'like' THEN
      UPDATE post_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
    ELSIF OLD.reaction_type = 'love' THEN
      UPDATE post_comments SET love_count = GREATEST(love_count - 1, 0) WHERE id = OLD.comment_id;
    ELSIF OLD.reaction_type = 'haha' THEN
      UPDATE post_comments SET haha_count = GREATEST(haha_count - 1, 0) WHERE id = OLD.comment_id;
    END IF;
    -- Add new reaction
    IF NEW.reaction_type = 'like' THEN
      UPDATE post_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    ELSIF NEW.reaction_type = 'love' THEN
      UPDATE post_comments SET love_count = love_count + 1 WHERE id = NEW.comment_id;
    ELSIF NEW.reaction_type = 'haha' THEN
      UPDATE post_comments SET haha_count = haha_count + 1 WHERE id = NEW.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reaction counts
CREATE TRIGGER update_comment_reaction_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON post_comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reaction_counts();
