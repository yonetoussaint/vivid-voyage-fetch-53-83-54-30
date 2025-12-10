import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edit, Pin, VolumeX, Check, CheckCheck, Camera, Mic, BadgeCheck, Phone, Video, Archive, Trash2, Star, Clock, Users, Loader2, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useConversations } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { UserSelectionDialog } from '@/components/messages/UserSelectionDialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'groups' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const currentUserId = user?.id || '';

  const { conversations, loading } = useConversations(currentUserId, activeTab);

  // Map API data to match the UI structure
  const mappedConversations = conversations.map(conv => ({
    id: conv.id,
    name: conv.other_user.full_name,
    preview: conv.last_message?.content || 'Start a conversation',
    date: formatDistanceToNow(new Date(conv.last_message?.created_at || conv.updated_at), { addSuffix: false }),
    time: formatDistanceToNow(new Date(conv.last_message?.created_at || conv.updated_at), { addSuffix: true }),
    avatar: `bg-${['gray-300', 'orange-300', 'lime-300', 'green-300', 'blue-300', 'red-100'][Math.floor(Math.random() * 6)]}`,
    unreadCount: conv.unread_count || 0,
    isOnline: Math.random() > 0.5,
    isPinned: Math.random() > 0.7,
    isMuted: Math.random() > 0.8,
    isRead: conv.unread_count === 0,
    messageType: 'text',
    deliveryStatus: conv.last_message?.sent_by === currentUserId ? (Math.random() > 0.5 ? 'read' : 'delivered') : null,
    sentByYou: conv.last_message?.sent_by === currentUserId,
    isTyping: false,
    isVerified: Math.random() > 0.7,
    isGroup: false,
    hasStory: Math.random() > 0.5,
    lastSeen: Math.random() > 0.5 ? 'online' : `${Math.floor(Math.random() * 60)}m ago`,
    reactions: Math.random() > 0.8 ? '❤️' : null,
    hasDraft: false,
    isStarred: Math.random() > 0.8,
    hasScheduled: Math.random() > 0.9,
    isArchived: false
  }));

  const handleTabChange = (tab: 'all' | 'unread' | 'groups' | 'archived') => {
    setSearchParams({ filter: tab });
  };

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
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
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
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <style>{`
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
      `}</style>
      
      <div className="max-w-2xl mx-auto">
        {/* Tabs/Filters */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex">
            <button
              onClick={() => handleTabChange('all')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'all' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTabChange('unread')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'unread' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => handleTabChange('groups')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'groups' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => handleTabChange('archived')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'archived' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Conversations list */}
        <div className="bg-white">
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
                {activeTab === 'groups' && 'No group conversations'}
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
      </div>

      {/* Floating action button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        onClick={() => setShowUserSelection(true)}
        aria-label="New message"
        type="button"
      >
        <Edit size={24} />
      </button>

      {/* User Selection Dialog */}
      <UserSelectionDialog
        open={showUserSelection}
        onOpenChange={setShowUserSelection}
        currentUserId={currentUserId}
      />
    </div>
  );
}