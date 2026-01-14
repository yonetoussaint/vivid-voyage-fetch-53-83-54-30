import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// ==================== INTERFACES AND TYPES ====================

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

export interface ConversationListItem {
  id: string;
  name: string;
  preview: string;
  lastOnline: string;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
  isRead: boolean;
  messageType: string;
  deliveryStatus: string | null;
  sentByYou: boolean;
  isTyping: boolean;
  isVerified: boolean;
  otherUser: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

// ==================== CONVERSATIONS HOOK ====================

export function useConversations(userId: string, filter: 'all' | 'unread' | 'archived' = 'all') {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversations = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) setLoading(true);

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
        setLoading(false);
        return;
      }

      const [otherParticipantsResult, lastMessagesResult] = await Promise.all([
        supabase
          .from('conversation_participants')
          .select('conversation_id, user_id, profiles!inner(id, full_name, email, avatar_url)')
          .in('conversation_id', conversationIds)
          .neq('user_id', userId),
        supabase
          .from('messages')
          .select('conversation_id, content, created_at, sender_id, is_read')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false })
      ]);

      const conversationsMap = new Map();

      participantData.forEach((participant: any) => {
        const conversation = participant.conversations;
        const otherParticipant = otherParticipantsResult.data?.find(
          (op: any) => op.conversation_id === conversation.id
        );

        const conversationMessages = lastMessagesResult.data?.filter(
          (msg: any) => msg.conversation_id === conversation.id
        ) || [];

        const lastMessage = conversationMessages[0] || null;
        const unreadCount = conversationMessages.filter(
          (msg: any) => !msg.is_read && msg.sender_id !== userId
        ).length;

        // Apply filters
        if (filter === 'archived' && !conversation.is_archived) return;
        if (filter === 'all' && conversation.is_archived) return;
        if (filter === 'unread' && unreadCount === 0) return;

        if (otherParticipant) {
          conversationsMap.set(conversation.id, {
            id: conversation.id,
            last_message_at: conversation.last_message_at,
            is_archived: conversation.is_archived,
            other_user: otherParticipant.profiles,
            last_message: lastMessage,
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
      if (isInitial) setLoading(false);
    }
  }, [userId, filter]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!userId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`conversations-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, () => fetchConversations(false))
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations' 
      }, () => fetchConversations(false))
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'CHANNEL_ERROR') {
          retryTimeoutRef.current = setTimeout(() => setupRealtimeSubscription(), 3000);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [userId, fetchConversations]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConversations(true);
    const cleanup = setupRealtimeSubscription();

    return cleanup;
  }, [userId, filter, fetchConversations, setupRealtimeSubscription]);

  return { conversations, loading, error, isConnected, refetch: () => fetchConversations(true) };
}

// ==================== USER SELECTION HOOK ====================

export function useUserSelection() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(user =>
          user.full_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async (currentUserId: string) => {
    if (!currentUserId) {
      console.error('No current user ID available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .neq('id', currentUserId)
        .order('full_name', { ascending: true });

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    loading,
    setSearchQuery,
    fetchUsers
  };
}

// ==================== CONVERSATION UTILITIES ====================

export function formatLastOnlineTime(lastMessageAt: string): string {
  const now = new Date();
  const messageDate = new Date(lastMessageAt);
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return formatDistanceToNow(messageDate, { addSuffix: true });
  }
  
  return messageDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function mapConversationToListItem(
  conv: ConversationWithDetails, 
  currentUserId: string
): ConversationListItem {
  const lastMessageTime = conv.last_message?.created_at || conv.last_message_at;
  const lastOnlineTime = formatLastOnlineTime(lastMessageTime);
  
  return {
    id: conv.id,
    name: conv.other_user.full_name,
    preview: conv.last_message?.content || 'Start a conversation',
    lastOnline: lastOnlineTime,
    avatar: conv.other_user.avatar_url || '',
    unreadCount: conv.unread_count || 0,
    isOnline: Math.random() > 0.5,
    isRead: conv.unread_count === 0,
    messageType: 'text',
    deliveryStatus: conv.last_message?.sender_id === currentUserId ? 'read' : null,
    sentByYou: conv.last_message?.sender_id === currentUserId,
    isTyping: false,
    isVerified: Math.random() > 0.7,
    otherUser: conv.other_user
  };
}

export function filterConversationsByTab(
  conversations: ConversationListItem[],
  activeTab: 'all' | 'unread' | 'archived'
): ConversationListItem[] {
  switch(activeTab) {
    case 'unread':
      return conversations.filter(c => c.unreadCount > 0);
    case 'archived':
      return conversations.filter(c => false);
    default:
      return conversations;
  }
}

// ==================== USER SELECTION LOGIC ====================

export async function handleUserSelect(
  selectedUserId: string,
  currentUserId: string,
  navigate: ReturnType<typeof useNavigate>
) {
  try {
    // Check for existing conversation
    const { data: myConversations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUserId);

    if (myConversations && myConversations.length > 0) {
      const conversationIds = myConversations.map(c => c.conversation_id);
      const { data: sharedConversation } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', selectedUserId)
        .in('conversation_id', conversationIds)
        .limit(1)
        .single();

      if (sharedConversation) {
        navigate(`/messages/${sharedConversation.conversation_id}`);
        return;
      }
    }

    // Create new conversation
    const { data: newConversation } = await supabase
      .from('conversations')
      .insert({ last_message_at: new Date().toISOString(), is_archived: false })
      .select()
      .single();

    if (newConversation) {
      await supabase
        .from('conversation_participants')
        .insert([
          { 
            conversation_id: newConversation.id, 
            user_id: currentUserId, 
            last_read_at: new Date().toISOString() 
          },
          { 
            conversation_id: newConversation.id, 
            user_id: selectedUserId, 
            last_read_at: new Date().toISOString() 
          },
        ]);

      navigate(`/messages/${newConversation.id}`);
    }
  } catch (error) {
    console.error('Error in handleUserSelect:', error);
  }
}

// ==================== MESSAGES LIST HOOK ====================

export function useMessagesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  
  const { user, isLoading } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const currentUserId = user?.id || '';
  const { conversations, loading } = useConversations(currentUserId, activeTab);

  const mappedConversations = conversations.map(conv => 
    mapConversationToListItem(conv, currentUserId)
  );

  const filteredConversations = filterConversationsByTab(mappedConversations, activeTab);

  const handleConversationClick = (convId: string) => {
    navigate(`/messages/${convId}`);
  };

  return {
    // State
    activeTab,
    showUserSelection,
    setShowUserSelection,
    
    // Data
    user,
    isLoading,
    loading,
    conversations: filteredConversations,
    currentUserId,
    
    // Actions
    openAuthOverlay,
    handleConversationClick,
    navigate
  };
}