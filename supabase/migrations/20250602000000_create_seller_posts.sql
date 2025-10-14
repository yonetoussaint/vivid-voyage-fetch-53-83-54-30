
-- Create seller_posts table
CREATE TABLE IF NOT EXISTS seller_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  product_ids UUID[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_seller_posts_seller_id ON seller_posts(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_posts_created_at ON seller_posts(created_at DESC);

-- Enable RLS
ALTER TABLE seller_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view active seller posts"
  ON seller_posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = seller_posts.seller_id
      AND sellers.status = 'active'
    )
  );

CREATE POLICY "Sellers can manage their own posts"
  ON seller_posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = seller_posts.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_seller_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_seller_posts_updated_at
  BEFORE UPDATE ON seller_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_posts_updated_at();
