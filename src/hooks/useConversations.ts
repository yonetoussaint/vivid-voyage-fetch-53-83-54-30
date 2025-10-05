import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversations = useCallback(async (isInitial: boolean = false) => {
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

      if (conversationIds.length === 0) {
        setConversations([]);
        if (isInitial) {
          setLoading(false);
        }
        return;
      }

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
      console.error('Error fetching conversations:', err);
      setError(err as Error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [userId, filter]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!userId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('Setting up conversations real-time subscription for user:', userId);

    const channel = supabase
      .channel(`conversations-${userId}-${Date.now()}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        console.log('Message change detected in conversations:', payload);
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
        fetchConversations(false);
      })
      .subscribe((status) => {
        console.log('Conversations subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to conversation updates');
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to conversations channel');
          setIsConnected(false);
          
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            console.log('Retrying conversations subscription...');
            setupRealtimeSubscription();
          }, 3000);
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Conversations subscription timed out');
          setIsConnected(false);
        } else if (status === 'CLOSED') {
          console.log('🔌 Conversations subscription closed');
          setIsConnected(false);
        }
      });

    channelRef.current = channel;
  }, [userId, fetchConversations]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConversations(true);
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [userId, filter, fetchConversations, setupRealtimeSubscription]);

  return { 
    conversations, 
    loading, 
    error, 
    isConnected,
    refetch: () => fetchConversations(true) 
  };
}
