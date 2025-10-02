-- Enable RLS on all user-related tables
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist;
CREATE POLICY "Users can view their own wishlist" 
ON wishlist FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own wishlist" ON wishlist;
CREATE POLICY "Users can insert into their own wishlist" 
ON wishlist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own wishlist" ON wishlist;
CREATE POLICY "Users can delete from their own wishlist" 
ON wishlist FOR DELETE 
USING (auth.uid() = user_id);

-- Cart policies
DROP POLICY IF EXISTS "Users can view their own cart" ON cart;
CREATE POLICY "Users can view their own cart" 
ON cart FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own cart" ON cart;
CREATE POLICY "Users can insert into their own cart" 
ON cart FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart" ON cart;
CREATE POLICY "Users can update their own cart" 
ON cart FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own cart" ON cart;
CREATE POLICY "Users can delete from their own cart" 
ON cart FOR DELETE 
USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- User addresses policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON user_addresses;
CREATE POLICY "Users can view their own addresses" 
ON user_addresses FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON user_addresses;
CREATE POLICY "Users can insert their own addresses" 
ON user_addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON user_addresses;
CREATE POLICY "Users can update their own addresses" 
ON user_addresses FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON user_addresses;
CREATE POLICY "Users can delete their own addresses" 
ON user_addresses FOR DELETE 
USING (auth.uid() = user_id);

-- Help tickets policies
DROP POLICY IF EXISTS "Users can view their own help tickets" ON help_tickets;
CREATE POLICY "Users can view their own help tickets" 
ON help_tickets FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create help tickets" ON help_tickets;
CREATE POLICY "Users can create help tickets" 
ON help_tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own help tickets" ON help_tickets;
CREATE POLICY "Users can update their own help tickets" 
ON help_tickets FOR UPDATE 
USING (auth.uid() = user_id);

-- User preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences" 
ON user_preferences FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
CREATE POLICY "Users can insert their own preferences" 
ON user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
CREATE POLICY "Users can update their own preferences" 
ON user_preferences FOR UPDATE 
USING (auth.uid() = user_id);