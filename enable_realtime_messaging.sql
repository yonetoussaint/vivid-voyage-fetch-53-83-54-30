-- Enable realtime for messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS messages;

-- Verify it's enabled
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('conversations', 'conversation_participants', 'messages')
ORDER BY tablename;
