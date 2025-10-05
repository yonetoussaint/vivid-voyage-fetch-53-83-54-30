import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages(true);

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          fetchMessages(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  async function fetchMessages(isInitial: boolean = false) {
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
      setError(err as Error);
    } finally {
      if (isInitial) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }

  async function markMessagesAsRead() {
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
  }

  async function sendMessage(content: string) {
    if (!conversationId || !content.trim()) return;

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
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }

  async function blockUser(userIdToBlock: string) {
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
  }

  async function archiveConversation() {
    if (!conversationId) return;

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
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    blockUser,
    archiveConversation,
    refetch: () => fetchMessages(true),
  };
}
