
-- Fix the trigger function to properly return OLD on DELETE
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
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Decrease old reaction count
    UPDATE post_comments
    SET 
      like_count = GREATEST(0, like_count - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END),
      love_count = GREATEST(0, love_count - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END),
      haha_count = GREATEST(0, haha_count - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END)
    WHERE id = OLD.comment_id;
    
    -- Increase new reaction count
    UPDATE post_comments
    SET 
      like_count = like_count + CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END,
      love_count = love_count + CASE WHEN NEW.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count + CASE WHEN NEW.reaction_type = 'haha' THEN 1 ELSE 0 END
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments
    SET 
      like_count = GREATEST(0, like_count - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END),
      love_count = GREATEST(0, love_count - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END),
      haha_count = GREATEST(0, haha_count - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END)
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
