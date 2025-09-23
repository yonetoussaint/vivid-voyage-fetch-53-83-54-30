-- Add seller_id foreign key to hero_banners table
ALTER TABLE hero_banners 
ADD COLUMN seller_id uuid NULL 
REFERENCES sellers(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_hero_banners_seller_id ON hero_banners(seller_id);

-- Insert some test data by associating existing banners with a seller
UPDATE hero_banners 
SET seller_id = (SELECT id FROM sellers LIMIT 1)
WHERE seller_id IS NULL
LIMIT 2;
