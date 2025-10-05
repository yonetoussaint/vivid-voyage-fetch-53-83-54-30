import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageCircle, Loader2, Plus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useConversations } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { UserSelectionDialog } from '@/components/messages/UserSelectionDialog';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'blocked' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  
  const currentUserId = '00000000-0000-0000-0000-000000000004';
  
  const { conversations, loading } = useConversations(currentUserId, activeTab);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: false });
    } catch {
      return 'just now';
    }
  };

  const handleConversationClick = (conversationId: string) => {
    if (conversationId.startsWith('blocked-')) {
      return;
    }
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-white pt-[var(--header-height)]">
      <PageContainer maxWidth="lg" padding="none">

        {/* Conversations List */}
        <div className="pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                {activeTab === 'all' && 'No messages yet'}
                {activeTab === 'unread' && 'No unread messages'}
                {activeTab === 'blocked' && 'No blocked users'}
                {activeTab === 'archived' && 'No archived conversations'}
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`w-full px-4 py-4 flex items-center gap-3 transition-colors border-b border-gray-50 ${
                  conversation.id.startsWith('blocked-') 
                    ? 'cursor-default opacity-60' 
                    : 'hover:bg-gray-50 active:bg-gray-100 cursor-pointer'
                }`}
              >
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={conversation.other_user.avatar_url || ''} />
                  <AvatarFallback className="bg-black text-white text-sm">
                    {getInitials(conversation.other_user.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm ${conversation.unread_count > 0 ? 'font-semibold' : 'font-normal'}`}>
                      {conversation.other_user.full_name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.last_message ? formatTimestamp(conversation.last_message.created_at) : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate flex-1 ${conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {conversation.last_message?.content || 'Start a conversation'}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

      </PageContainer>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-20 right-4 z-[9999] bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-all active:scale-90 border-2 border-white"
        onClick={() => setShowUserSelection(true)}
        aria-label="New message"
        type="button"
      >
        <Plus size={24} strokeWidth={2.5} />
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
