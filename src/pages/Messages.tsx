import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function Messages() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Listen for tab changes from URL params
  useEffect(() => {
    const filter = searchParams.get('filter') || 'all';
    setActiveFilter(filter);
  }, [searchParams]);

  const conversations: Message[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      lastMessage: 'Thanks for the quick delivery!',
      timestamp: '2m',
      unread: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'MC',
      lastMessage: 'Is the item still available?',
      timestamp: '1h',
      unread: true,
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'EW',
      lastMessage: 'Perfect, just what I needed',
      timestamp: '3h',
      unread: false,
    },
    {
      id: '4',
      name: 'David Brown',
      avatar: 'DB',
      lastMessage: 'Can you send more photos?',
      timestamp: '5h',
      unread: false,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      avatar: 'LA',
      lastMessage: 'Great product quality',
      timestamp: '1d',
      unread: false,
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'unread' && conv.unread);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white pt-[var(--header-height)]">
      <PageContainer maxWidth="lg" padding="none">
        
        {/* Conversations */}
        <div className="pb-20">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-black text-white text-sm">
                  {conversation.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm ${conversation.unread ? 'font-medium' : 'font-normal'}`}>
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {conversation.lastMessage}
                </p>
              </div>

              <button className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </button>
          ))}

          {filteredConversations.length === 0 && (
            <div className="px-4 py-16 text-center">
              <p className="text-sm text-gray-500">No messages found</p>
            </div>
          )}
        </div>

      </PageContainer>
    </div>
  );
}
