import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edit, Pin, VolumeX, Check, CheckCheck, Camera, Mic, BadgeCheck, Phone, Video, Archive, Trash2, Star, Clock, Users, Loader2, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Interfaces for useConversations hook
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

// useConversations hook moved inline
function useConversations(userId: string, filter: 'all' | 'unread' | 'blocked' | 'archived' = 'all') {
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

// User Selection Dialog Component
interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface UserSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

function UserSelectionDialog({ open, onOpenChange, currentUserId }: UserSelectionDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            (user.full_name || '').toLowerCase().includes(query) ||
            (user.email || '').toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
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

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUserSelect = async (selectedUserId: string) => {
    try {
      // Get all conversations where current user is a participant
      const { data: myConversations, error: fetchError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        throw fetchError;
      }

      // Check if any of my conversations includes the selected user
      if (myConversations && myConversations.length > 0) {
        const conversationIds = myConversations.map(c => c.conversation_id);

        // Find if selected user is in any of these conversations
        const { data: sharedConversation, error: sharedError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', selectedUserId)
          .in('conversation_id', conversationIds)
          .limit(1)
          .single();

        if (sharedConversation && !sharedError) {
          // Conversation exists, navigate to it
          console.log('Existing conversation found:', sharedConversation.conversation_id);
          navigate(`/messages/${sharedConversation.conversation_id}`);
          onOpenChange(false);
          return;
        }
      }

      // No existing conversation found, create a new one
      console.log('Creating new conversation...');

      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          last_message_at: new Date().toISOString(),
          is_archived: false,
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      console.log('New conversation created:', newConversation.id);

      // Add both participants to the conversation
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: newConversation.id,
            user_id: currentUserId,
            last_read_at: new Date().toISOString(),
          },
          {
            conversation_id: newConversation.id,
            user_id: selectedUserId,
            last_read_at: new Date().toISOString(),
          },
        ]);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      console.log('Participants added successfully');

      // Navigate to the new conversation
      navigate(`/messages/${newConversation.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
      // You could add a toast notification here to inform the user
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No users found' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-black text-white text-sm">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-sm font-medium truncate">{user.full_name || 'No name'}</h3>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Messages Component
export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'groups' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const currentUserId = user?.id || '';

  // Note: Using 'blocked' filter type from hook but mapping to 'groups' for UI display
  const { conversations, loading } = useConversations(
    currentUserId, 
    activeTab === 'groups' ? 'blocked' : activeTab === 'archived' ? 'archived' : activeTab === 'unread' ? 'unread' : 'all'
  );

  // Handle mobile viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  // Map API data to match the UI structure
  const mappedConversations = conversations.map(conv => ({
    id: conv.id,
    name: conv.other_user.full_name,
    preview: conv.last_message?.content || 'Start a conversation',
    date: formatDistanceToNow(new Date(conv.last_message?.created_at || conv.last_message_at), { addSuffix: false }),
    time: formatDistanceToNow(new Date(conv.last_message?.created_at || conv.last_message_at), { addSuffix: true }),
    avatar: `bg-${['gray-300', 'orange-300', 'lime-300', 'green-300', 'blue-300', 'red-100'][Math.floor(Math.random() * 6)]}`,
    unreadCount: conv.unread_count || 0,
    isOnline: Math.random() > 0.5,
    isPinned: Math.random() > 0.7,
    isMuted: Math.random() > 0.8,
    isRead: conv.unread_count === 0,
    messageType: 'text',
    deliveryStatus: conv.last_message?.sender_id === currentUserId ? (Math.random() > 0.5 ? 'read' : 'delivered') : null,
    sentByYou: conv.last_message?.sender_id === currentUserId,
    isTyping: false,
    isVerified: Math.random() > 0.7,
    isGroup: conv.id.startsWith('blocked-'), // Show blocked users as "groups" in UI
    hasStory: Math.random() > 0.5,
    lastSeen: Math.random() > 0.5 ? 'online' : `${Math.floor(Math.random() * 60)}m ago`,
    reactions: Math.random() > 0.8 ? '❤️' : null,
    hasDraft: false,
    isStarred: Math.random() > 0.8,
    hasScheduled: Math.random() > 0.9,
    isArchived: conv.is_archived
  }));

  const handleSwipe = (id: string, action: 'archive' | 'delete') => {
    console.log(`${action} conversation ${id}`);
    setSwipedItem(null);
    // TODO: Implement archive/delete functionality
  };

  const getMessageIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <Camera size={14} className="text-gray-500" />;
      case 'voice':
        return <Mic size={14} className="text-gray-500" />;
      default:
        return null;
    }
  };

  const getDeliveryIcon = (status: string) => {
    switch(status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const filterConversations = () => {
    switch(activeTab) {
      case 'unread':
        return mappedConversations.filter(c => c.unreadCount > 0 || !c.isRead);
      case 'groups':
        return mappedConversations.filter(c => c.isGroup);
      case 'archived':
        return mappedConversations.filter(c => c.isArchived);
      default:
        return mappedConversations.filter(c => !c.isArchived);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex items-center justify-center p-4">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-500 mb-4">Please log in to view your messages</p>
          <button
            onClick={() => openAuthOverlay()}
            className="px-6 py-2 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] text-gray-900 font-sans overflow-hidden">
      <style>{`
        :root {
          --vh: 1vh;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
        .dot-1 {
          animation: typing 1.4s infinite;
          animation-delay: 0s;
        }
        .dot-2 {
          animation: typing 1.4s infinite;
          animation-delay: 0.2s;
        }
        .dot-3 {
          animation: typing 1.4s infinite;
          animation-delay: 0.4s;
        }
        
        body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div className="h-full max-w-2xl mx-auto flex flex-col">
        {/* Conversations list - Scrollable area */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden bg-white"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filterConversations().length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Edit className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500">
                {activeTab === 'all' && 'No messages yet'}
                {activeTab === 'unread' && 'No unread messages'}
                {activeTab === 'groups' && 'No blocked users'}
                {activeTab === 'archived' && 'No archived conversations'}
              </p>
            </div>
          ) : (
            filterConversations().map((conv) => (
              <div
                key={conv.id}
                className={`relative overflow-hidden ${
                  conv.isPinned ? 'bg-gray-50' : ''
                }`}
              >
                {/* Swipe action buttons */}
                {swipedItem === conv.id && (
                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                    <button
                      onClick={() => handleSwipe(conv.id, 'archive')}
                      className="px-6 h-full bg-yellow-500 text-white flex items-center justify-center"
                    >
                      <Archive size={20} />
                    </button>
                    <button
                      onClick={() => handleSwipe(conv.id, 'delete')}
                      className="px-6 h-full bg-red-600 text-white flex items-center justify-center"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}

                <div
                  className="flex items-center px-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onTouchStart={(e) => {
                    const startX = e.touches[0].clientX;
                    const handleTouchMove = (e: TouchEvent) => {
                      const currentX = e.touches[0].clientX;
                      if (startX - currentX > 50) {
                        setSwipedItem(conv.id);
                      }
                    };
                    document.addEventListener('touchmove', handleTouchMove);
                    document.addEventListener('touchend', () => {
                      document.removeEventListener('touchmove', handleTouchMove);
                    }, { once: true });
                  }}
                  onClick={() => {
                    setSwipedItem(null);
                    if (!conv.id.startsWith('blocked-')) {
                      navigate(`/messages/${conv.id}`);
                    }
                  }}
                >
                  {/* Avatar with story ring and online status */}
                  <div className="relative flex-shrink-0 mr-3">
                    {conv.hasStory && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 -m-0.5">
                        <div className="w-full h-full bg-white rounded-full p-0.5"></div>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-full ${conv.avatar} relative z-10 flex items-center justify-center`}>
                      {conv.isGroup ? (
                        <Users size={20} className="text-white" />
                      ) : (
                        <Avatar className="w-full h-full">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-black text-white">
                            {conv.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    {conv.isOnline && !conv.isGroup && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h3 className={`text-base truncate ${conv.isRead ? 'font-normal text-gray-900' : 'font-bold text-gray-900'}`}>
                          {conv.name}
                        </h3>
                        {conv.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-current flex-shrink-0" />}
                        {conv.isStarred && <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                        {conv.isPinned && <Pin size={14} className="text-gray-400 fill-gray-400 flex-shrink-0" />}
                        {conv.isMuted && <VolumeX size={14} className="text-gray-400 flex-shrink-0" />}
                        {conv.hasScheduled && <Clock size={14} className="text-blue-500 flex-shrink-0" />}
                      </div>
                      <span className={`text-xs ml-2 flex-shrink-0 ${conv.isRead ? 'text-gray-400' : 'text-red-500 font-semibold'}`}>
                        {conv.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        {conv.isTyping ? (
                          <div className="flex items-center gap-1">
                            <span className="text-green-500 text-sm">typing</span>
                            <div className="flex gap-0.5 ml-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full dot-1"></div>
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full dot-2"></div>
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full dot-3"></div>
                            </div>
                          </div>
                        ) : conv.hasDraft ? (
                          <p className="text-sm truncate">
                            <span className="text-red-500 font-semibold">Draft: </span>
                            <span className="text-gray-500">{conv.preview}</span>
                          </p>
                        ) : (
                          <>
                            {conv.sentByYou && getDeliveryIcon(conv.deliveryStatus)}
                            {getMessageIcon(conv.messageType)}
                            <p className={`text-sm truncate ${conv.isRead ? 'text-gray-500' : 'text-gray-900 font-semibold'}`}>
                              {conv.sentByYou && 'You: '}{conv.preview}
                            </p>
                            {conv.reactions && (
                              <span className="text-sm ml-1 flex-shrink-0">{conv.reactions}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Last seen for individual chats */}
                      {!conv.isGroup && conv.lastSeen && !conv.isOnline && (
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{conv.lastSeen}</span>
                      )}
                    </div>
                  </div>

                  {/* Right side icons */}
                  <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0">
                    {conv.unreadCount > 0 && (
                      <div className="min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold px-1.5">
                        {conv.unreadCount}
                      </div>
                    )}
                    <div className="flex gap-1">
                      <button 
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement call functionality
                          console.log('Call', conv.id);
                        }}
                      >
                        <Phone size={16} className="text-gray-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement video call functionality
                          console.log('Video call', conv.id);
                        }}
                      >
                        <Video size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating action button */}
        <button
          className="fixed bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          onClick={() => setShowUserSelection(true)}
          aria-label="New message"
          type="button"
        >
          <Edit size={24} />
        </button>
      </div>

      {/* User Selection Dialog */}
      <UserSelectionDialog
        open={showUserSelection}
        onOpenChange={setShowUserSelection}
        currentUserId={currentUserId}
      />
    </div>
  );
}