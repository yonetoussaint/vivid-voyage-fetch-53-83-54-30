
-- Insert sample comments for the post
-- Note: We'll use the profiles table to get real user IDs, or create sample ones

-- First, let's insert some sample comments from different users
INSERT INTO post_comments (post_id, user_id, content, like_count, love_count, haha_count, created_at)
VALUES
  -- Main comments
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 0),
    'This looks amazing! When will it be available?',
    15,
    8,
    2,
    NOW() - INTERVAL '2 hours'
  ),
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 1),
    'Great quality! I already bought one and it''s perfect 👍',
    25,
    12,
    0,
    NOW() - INTERVAL '5 hours'
  ),
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 2),
    'How much does it cost? Can you ship internationally?',
    8,
    3,
    0,
    NOW() - INTERVAL '8 hours'
  ),
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 3),
    'This is exactly what I''ve been looking for! 😍',
    18,
    20,
    1,
    NOW() - INTERVAL '12 hours'
  ),
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 4),
    'Can you tell me more about the specifications?',
    5,
    2,
    0,
    NOW() - INTERVAL '1 day'
  );

-- Insert some replies to the first comment
INSERT INTO post_comments (post_id, user_id, parent_comment_id, content, like_count, love_count, haha_count, created_at)
VALUES
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles WHERE id IN (SELECT seller_id FROM seller_posts WHERE id = '3c9112e9-713e-4957-84a0-2602702f4f5d') LIMIT 1),
    (SELECT id FROM post_comments WHERE post_id = '3c9112e9-713e-4957-84a0-2602702f4f5d' ORDER BY created_at DESC LIMIT 1 OFFSET 4),
    'Thank you for your interest! It will be available next week 🎉',
    10,
    5,
    0,
    NOW() - INTERVAL '1 hour 30 minutes'
  ),
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 5),
    (SELECT id FROM post_comments WHERE post_id = '3c9112e9-713e-4957-84a0-2602702f4f5d' ORDER BY created_at DESC LIMIT 1 OFFSET 2),
    'Yes, we ship worldwide! The price is very competitive.',
    6,
    3,
    0,
    NOW() - INTERVAL '7 hours'
  );

-- Insert a comment with an image
INSERT INTO post_comments (post_id, user_id, content, image_url, like_count, love_count, haha_count, created_at)
VALUES
  (
    '3c9112e9-713e-4957-84a0-2602702f4f5d',
    (SELECT id FROM profiles LIMIT 1 OFFSET 6),
    'Here''s how mine looks after using it for a week!',
    'https://wkfzhcszhgewkvwukzes.supabase.co/storage/v1/object/public/hero-banners/hero_banner_1747065132548.jpg',
    30,
    15,
    5,
    NOW() - INTERVAL '3 days'
  );
