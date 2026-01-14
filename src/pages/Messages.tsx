import { 
  Edit, BadgeCheck, Camera, Mic, Star, Check, CheckCheck,
  Loader2, Search, X
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  useMessagesList,
  useUserSelection,
  handleUserSelect,
  ConversationListItem,
  User
} from '@/hooks/useMessages';

// ==================== SUB-COMPONENTS ====================

interface ConversationItemProps {
  conv: ConversationListItem;
  onClick: () => void;
}

function ConversationItem({ conv, onClick }: ConversationItemProps) {
  const getMessageIcon = (type: string) => {
    switch(type) {
      case 'image': return <Camera size={14} className="text-gray-500" />;
      case 'voice': return <Mic size={14} className="text-gray-500" />;
      default: return null;
    }
  };

  const getDeliveryIcon = (status: string) => {
    switch(status) {
      case 'sent': return <Check size={14} className="text-gray-400" />;
      case 'delivered': return <CheckCheck size={14} className="text-gray-400" />;
      case 'read': return <CheckCheck size={14} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div
      className="flex items-center px-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0 mr-3">
        <div className="w-12 h-12 rounded-full relative z-10 flex items-center justify-center">
          {conv.avatar ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={conv.avatar} />
              <AvatarFallback className="bg-black text-white">
                {conv.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {conv.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          )}
        </div>
        {conv.isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <h3 className={`text-base truncate ${conv.isRead ? 'font-normal text-gray-900' : 'font-bold text-gray-900'}`}>
              {conv.name}
            </h3>
            {conv.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-current flex-shrink-0" />}
          </div>
          <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
            <span className={`text-xs ${conv.isRead ? 'text-gray-400' : 'text-red-500 font-semibold'}`}>
              {conv.lastOnline}
            </span>
            {conv.unreadCount > 0 && (
              <div className="min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold px-1.5">
                {conv.unreadCount}
              </div>
            )}
          </div>
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
            ) : (
              <>
                {conv.sentByYou && getDeliveryIcon(conv.deliveryStatus!)}
                {getMessageIcon(conv.messageType)}
                <p className={`text-sm truncate ${conv.isRead ? 'text-gray-500' : 'text-gray-900 font-semibold'}`}>
                  {conv.sentByYou && 'You: '}{conv.preview}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  navigate: ReturnType<typeof useNavigate>;
}

function UserSelectionDialog({ 
  open, 
  onOpenChange, 
  currentUserId,
  navigate 
}: UserSelectionDialogProps) {
  const userSelection = useUserSelection();

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onUserSelect = (selectedUserId: string) => {
    handleUserSelect(selectedUserId, currentUserId, navigate);
    onOpenChange(false);
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
              value={userSelection.searchQuery}
              onChange={(e) => userSelection.setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userSelection.loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : userSelection.filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                {userSelection.searchQuery ? 'No users found' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userSelection.filteredUsers.map((user: User) => (
                <button
                  key={user.id}
                  onClick={() => onUserSelect(user.id)}
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

// ==================== MAIN COMPONENT ====================

export default function Messages() {
  const {
    // State
    activeTab,
    showUserSelection,
    setShowUserSelection,
    
    // Data
    user,
    isLoading,
    loading,
    conversations,
    currentUserId,
    
    // Actions
    openAuthOverlay,
    handleConversationClick,
    navigate
  } = useMessagesList();

  if (isLoading) {
    return (
      <div className="bg-gray-50 h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 h-screen flex items-center justify-center p-4">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-500 mb-4">Please log in to view your messages</p>
          <button
            onClick={openAuthOverlay}
            className="px-6 py-2 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-screen text-gray-900 font-sans overflow-hidden">
      <div className="h-full max-w-2xl mx-auto flex flex-col">
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden bg-white"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Edit className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500">
                {activeTab === 'all' && 'No messages yet'}
                {activeTab === 'unread' && 'No unread messages'}
                {activeTab === 'archived' && 'No archived conversations'}
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                onClick={() => handleConversationClick(conv.id)}
              />
            ))
          )}
        </div>

        <button
          className="fixed bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          onClick={() => setShowUserSelection(true)}
          aria-label="New message"
          type="button"
        >
          <Edit size={24} />
        </button>
      </div>

      <UserSelectionDialog
        open={showUserSelection}
        onOpenChange={setShowUserSelection}
        currentUserId={currentUserId}
        navigate={navigate}
      />
    </div>
  );
}