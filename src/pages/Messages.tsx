import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Loader2, 
  Plus, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  WifiOff,
  Wifi,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useConversations } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { UserSelectionDialog } from '@/components/messages/UserSelectionDialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

// Loading Skeleton Component
const ConversationSkeleton = () => (
  <div className="animate-pulse px-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="py-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-neutral-200" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
            <div className="h-3 bg-neutral-100 rounded w-16" />
          </div>
          <div className="h-3 bg-neutral-100 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Swipeable Conversation Item
const SwipeableConversation = ({ 
  conversation, 
  onClick, 
  onArchive, 
  onDelete, 
  onMarkAsRead 
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const SWIPE_THRESHOLD = 60;

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (diff > 0) {
      setSwipeOffset(-Math.min(diff, 160));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    if (Math.abs(swipeOffset) > SWIPE_THRESHOLD) {
      if (Math.abs(swipeOffset) > 120) {
        onDelete?.(conversation.id);
      } else {
        if (conversation.unread_count > 0) {
          onMarkAsRead?.(conversation.id);
        } else {
          onArchive?.(conversation.id);
        }
      }
    }
    
    setSwipeOffset(0);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: false });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className="relative overflow-hidden px-4">
      {/* Swipe Actions Background */}
      <div 
        className="absolute inset-y-0 right-0 flex transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <div className="w-full flex">
          {/* Read/Archive Action */}
          <button
            onClick={() => conversation.unread_count > 0 ? onMarkAsRead(conversation.id) : onArchive(conversation.id)}
            className={`flex-1 flex items-center justify-center ${
              conversation.unread_count > 0 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : 'bg-neutral-800 hover:bg-neutral-700'
            } text-white min-w-[80px]`}
          >
            {conversation.unread_count > 0 ? (
              <>
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-xs">Read</span>
              </>
            ) : (
              <>
                <Archive className="h-5 w-5 mr-1" />
                <span className="text-xs">Archive</span>
              </>
            )}
          </button>
          
          {/* Delete Action */}
          <button
            onClick={() => onDelete(conversation.id)}
            className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white min-w-[80px]"
          >
            <Trash2 className="h-5 w-5 mr-1" />
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Conversation Content */}
      <div
        className={`relative bg-white rounded-xl shadow-sm mb-2 active:scale-[0.99] transition-all ${
          isSwiping ? 'cursor-grabbing' : 'cursor-pointer'
        }`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (!isSwiping && !conversation.id.startsWith('blocked-')) {
            onClick();
          }
        }}
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0 relative">
            <AvatarImage src={conversation.other_user.avatar_url || ''} />
            <AvatarFallback className="bg-black text-white text-sm">
              {getInitials(conversation.other_user.full_name)}
            </AvatarFallback>
            {conversation.other_user.is_online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </Avatar>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm ${conversation.unread_count > 0 ? 'font-semibold' : 'font-normal'}`}>
                  {conversation.other_user.full_name}
                </h3>
                {conversation.id.startsWith('blocked-') && (
                  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
                    Blocked
                  </span>
                )}
                {conversation.archived && (
                  <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">
                    Archived
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-500">
                {conversation.last_message ? formatTimestamp(conversation.last_message.created_at) : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-sm truncate flex-1 ${
                conversation.unread_count > 0 ? 'text-black font-semibold' : 'text-neutral-500'
              }`}>
                {conversation.last_message?.content || 'Start a conversation'}
              </p>
              {conversation.unread_count > 0 && (
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {conversation.unread_count}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 text-neutral-400 hover:text-neutral-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'blocked' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, isLoading } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const currentUserId = user?.id || '';

  const { 
    conversations, 
    loading, 
    error, 
    refetch,
    markAsRead,
    archiveConversation,
    deleteConversation
  } = useConversations(currentUserId, activeTab);

  const filteredConversations = conversations.filter(conv => 
    conv.other_user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (pullStartY === 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;
    
    if (distance > 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      await refetch();
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
    setPullStartY(0);
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="px-6 py-20 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-600 text-sm mb-3">Please log in to view your messages</p>
          <button
            onClick={() => openAuthOverlay()}
            className="px-5 py-2 text-sm bg-black text-white rounded-xl shadow hover:bg-neutral-800"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-neutral-50 min-h-screen px-6 py-20 text-center">
        <WifiOff className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-600 text-sm mb-3">You're offline</p>
        <p className="text-neutral-400 text-xs mb-4">Messages will sync when you're back online</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 text-sm border border-neutral-300 rounded-xl hover:bg-neutral-100"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-50 min-h-screen px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-600 text-sm mb-3">Failed to load messages</p>
        <p className="text-neutral-400 text-xs mb-4">{error.message}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => refetch()}
            className="px-5 py-2 text-sm bg-black text-white rounded-xl shadow hover:bg-neutral-800"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 text-sm border border-neutral-300 rounded-xl hover:bg-neutral-100"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-neutral-50 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div className="sticky top-0 z-50 flex justify-center pt-2">
          <div 
            className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"
            style={{ 
              transform: `scale(${pullDistance / 100})`,
              opacity: pullDistance / 100
            }}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>
        </div>
      )}

      {/* Modern Pill Style Tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'blocked', label: 'Blocked' },
          { id: 'archived', label: 'Archived' }
        ].map((tab) => {
          const unreadCount = conversations.filter(c => c.unread_count > 0).length;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSearchParams({ filter: tab.id });
                setSearchQuery('');
              }}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeTab === tab.id 
                  ? 'bg-black text-white shadow-sm' 
                  : 'bg-white text-neutral-500 border border-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Modern Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black/80 focus:border-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <XCircle className="h-4 w-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Online Status & Refresh */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 mr-1 text-green-500" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1 text-neutral-400" />
              <span>Offline</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            setIsRefreshing(true);
            refetch().finally(() => {
              setTimeout(() => setIsRefreshing(false), 500);
            });
          }}
          disabled={isRefreshing || loading}
          className="flex items-center text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Conversations List */}
      <div className="pb-24">
        {loading ? (
          <ConversationSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-600 text-sm mb-3">
              {searchQuery
                ? 'No conversations match your search'
                : activeTab === 'all' && 'No messages yet'
                || activeTab === 'unread' && 'No unread messages'
                || activeTab === 'blocked' && 'No blocked users'
                || activeTab === 'archived' && 'No archived conversations'
              }
            </p>
            {!searchQuery && activeTab === 'all' && (
              <button
                onClick={() => setShowUserSelection(true)}
                className="px-5 py-2 text-sm bg-black text-white rounded-xl shadow hover:bg-neutral-800"
              >
                Start a Conversation
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2 text-sm border border-neutral-300 rounded-xl hover:bg-neutral-100"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {filteredConversations.map((conversation) => (
              <SwipeableConversation
                key={conversation.id}
                conversation={conversation}
                onClick={() => {
                  if (!conversation.id.startsWith('blocked-')) {
                    navigate(`/messages/${conversation.id}`);
                  }
                }}
                onArchive={(id) => archiveConversation(id)}
                onDelete={(id) => deleteConversation(id)}
                onMarkAsRead={(id) => markAsRead(id)}
              />
            ))}
            
            <div className="px-4 py-3 text-center text-xs text-neutral-400">
              Showing {filteredConversations.length} of {conversations.length} conversations
            </div>
          </>
        )}
      </div>

      {/* Clean Floating Button */}
      {user && (
        <>
          <button
            className="fixed bottom-20 right-4 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-neutral-800 active:scale-95 transition-all"
            onClick={() => setShowUserSelection(true)}
            aria-label="New message"
            type="button"
          >
            <Plus size={24} />
          </button>

          <UserSelectionDialog
            open={showUserSelection}
            onOpenChange={setShowUserSelection}
            currentUserId={currentUserId}
          />
        </>
      )}
    </div>
  );
}