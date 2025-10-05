import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConversationWithDetails {
  id: string;
  last_message_at: string;
  is_archived: boolean;
  other_user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
  unread_count: number;
}

export function useConversations(userId: string, filter: 'all' | 'unread' | 'blocked' | 'archived' = 'all') {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConversations(true);

    const channel = supabase
      .channel(`conversations-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        console.log('Message change detected in useConversations:', payload);
        // Refetch conversations when any message is inserted or updated
        fetchConversations(false);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations' 
      }, (payload) => {
        console.log('Conversation change detected:', payload);
        fetchConversations(false);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversation_participants',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Participant change detected for user:', payload);
        // Refetch conversations when user is added/removed from a conversation
        fetchConversations(false);
      })
      .subscribe((status) => {
        console.log('Conversations subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to conversations updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to conversations channel');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, filter]);

  async function fetchConversations(isInitial: boolean = false) {
    try {
      if (isInitial) {
        setLoading(true);
      }

      if (filter === 'blocked') {
        const { data: blockedUsers } = await supabase
          .from('blocked_users')
          .select('blocked_id, profiles!blocked_users_blocked_id_fkey(id, full_name, email, avatar_url)')
          .eq('blocker_id', userId);

        const blockedConversations: ConversationWithDetails[] = (blockedUsers || []).map((blocked: any) => ({
          id: `blocked-${blocked.blocked_id}`,
          last_message_at: new Date().toISOString(),
          is_archived: false,
          other_user: {
            id: blocked.profiles.id,
            full_name: blocked.profiles.full_name || 'Unknown',
            email: blocked.profiles.email || '',
            avatar_url: blocked.profiles.avatar_url,
          },
          last_message: {
            content: 'User blocked',
            created_at: new Date().toISOString(),
            sender_id: userId,
          },
          unread_count: 0,
        }));

        setConversations(blockedConversations);
        if (isInitial) {
          setLoading(false);
          setIsInitialLoad(false);
        }
        return;
      }

      const { data: participantData } = await supabase
        .from('conversation_participants')
        .select('conversation_id, last_read_at, conversations!inner(*)')
        .eq('user_id', userId);

      if (!participantData) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participantData.map((p: any) => p.conversation_id);

      const { data: otherParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id, profiles!inner(id, full_name, email, avatar_url)')
        .in('conversation_id', conversationIds)
        .neq('user_id', userId);

      const { data: lastMessages } = await supabase
        .from('messages')
        .select('conversation_id, content, created_at, sender_id, is_read')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      const conversationsMap = new Map();

      participantData.forEach((participant: any) => {
        const conversation = participant.conversations;
        const otherParticipant = otherParticipants?.find(
          (op: any) => op.conversation_id === conversation.id
        );

        const conversationMessages = lastMessages?.filter(
          (msg: any) => msg.conversation_id === conversation.id
        ) || [];

        const lastMessage = conversationMessages[0] || null;
        const unreadCount = conversationMessages.filter(
          (msg: any) => !msg.is_read && msg.sender_id !== userId
        ).length;

        if (filter === 'archived' && !conversation.is_archived) return;
        if (filter === 'all' && conversation.is_archived) return;
        if (filter === 'unread' && unreadCount === 0) return;

        if (otherParticipant) {
          conversationsMap.set(conversation.id, {
            id: conversation.id,
            last_message_at: conversation.last_message_at,
            is_archived: conversation.is_archived,
            other_user: {
              id: otherParticipant.profiles.id,
              full_name: otherParticipant.profiles.full_name || 'Unknown',
              email: otherParticipant.profiles.email || '',
              avatar_url: otherParticipant.profiles.avatar_url,
            },
            last_message: lastMessage ? {
              content: lastMessage.content,
              created_at: lastMessage.created_at,
              sender_id: lastMessage.sender_id,
            } : null,
            unread_count: unreadCount,
          });
        }
      });

      const conversationsList = Array.from(conversationsMap.values()).sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(conversationsList);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      if (isInitial) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }

  return { conversations, loading, error, refetch: () => fetchConversations(true) };
}
