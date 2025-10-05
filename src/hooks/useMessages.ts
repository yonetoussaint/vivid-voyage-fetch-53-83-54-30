import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export function useMessages(conversationId: string | null, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async (isInitial: boolean = false) => {
    if (!conversationId) return;

    try {
      if (isInitial) {
        setLoading(true);
      }

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          is_read,
          profiles!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const messagesWithSender = (data || []).map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
        is_read: msg.is_read,
        sender: msg.profiles ? {
          id: msg.profiles.id,
          full_name: msg.profiles.full_name || 'Unknown',
          avatar_url: msg.profiles.avatar_url,
        } : undefined,
      }));

      setMessages(messagesWithSender);
      setError(null);
      
      await markMessagesAsRead();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [conversationId, currentUserId]);

  const markMessagesAsRead = useCallback(async () => {
    if (!conversationId || !currentUserId) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserId)
        .eq('is_read', false);

      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [conversationId, currentUserId]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!conversationId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('Setting up real-time subscription for conversation:', conversationId);

    const channel = supabase
      .channel(`messages-${conversationId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received via real-time:', payload);
          
          setMessages((current) => {
            // Check if message already exists to prevent duplicates
            const exists = current.some(msg => msg.id === payload.new.id);
            if (exists) {
              console.log('Message already exists, skipping:', payload.new.id);
              // Update the message to ensure we have latest data
              return current.map(msg =>
                msg.id === payload.new.id
                  ? { ...msg, is_read: payload.new.is_read }
                  : msg
              );
            }
            
            // Add new message
            console.log('Adding new message from real-time:', payload.new.id);
            const newMessage: Message = {
              id: payload.new.id,
              conversation_id: payload.new.conversation_id,
              sender_id: payload.new.sender_id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              is_read: payload.new.is_read,
            };
            
            return [...current, newMessage];
          });
          
          if (payload.new.sender_id !== currentUserId) {
            markMessagesAsRead();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Message updated via real-time:', payload);
          setMessages((current) =>
            current.map((msg) =>
              msg.id === payload.new.id
                ? { ...msg, ...payload.new }
                : msg
            )
          );
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to messages');
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.error(`❌ Subscription issue: ${status} - attempting retry`);
          setIsConnected(false);
          
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            console.log('Retrying subscription after', status);
            setupRealtimeSubscription();
          }, 3000);
        }
      });

    channelRef.current = channel;
  }, [conversationId, currentUserId, markMessagesAsRead]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      setIsConnected(false);
      return;
    }

    fetchMessages(true);
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
  }, [conversationId, fetchMessages, setupRealtimeSubscription]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return false;

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: content.trim(),
        });

      if (insertError) throw insertError;

      await supabase
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      // Defensive refetch to ensure message appears even if real-time is lagging
      setTimeout(() => fetchMessages(false), 100);

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      return false;
    }
  };

  const blockUser = async (userIdToBlock: string) => {
    try {
      const { error: blockError } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: currentUserId,
          blocked_id: userIdToBlock,
        });

      if (blockError) throw blockError;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  const archiveConversation = async () => {
    if (!conversationId) return false;

    try {
      const { error: archiveError } = await supabase
        .from('conversations')
        .update({ is_archived: true })
        .eq('id', conversationId);

      if (archiveError) throw archiveError;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    isConnected,
    sendMessage,
    blockUser,
    archiveConversation,
    refetch: () => fetchMessages(true),
  };
}
