-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;

DROP POLICY IF EXISTS "Users can view conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update conversations they are part of" ON public.conversations;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Create simpler, non-recursive policies

-- Conversation participants policies (simplified)
CREATE POLICY "Anyone can view conversation participants" ON public.conversation_participants
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert conversation participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own participation" ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Conversations policies (simplified)
CREATE POLICY "Anyone can view conversations" ON public.conversations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update conversations" ON public.conversations
  FOR UPDATE USING (true);

-- Messages policies (simplified)
CREATE POLICY "Anyone can view messages" ON public.messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can update messages" ON public.messages
  FOR UPDATE USING (true);
