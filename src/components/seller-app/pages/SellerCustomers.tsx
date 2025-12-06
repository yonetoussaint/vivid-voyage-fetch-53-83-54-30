import React, { useState } from 'react';
import { 
  MessageCircle, Mail, Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SellerCustomers = () => {
  const [displayCount, setDisplayCount] = useState(15);

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      unread: 3,
      status: 'Active',
      rating: 4.8,
      lastChat: '2 min ago',
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      unread: 0,
      status: 'Active',
      rating: 4.6,
      lastChat: '1 hour ago',
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      unread: 1,
      status: 'VIP',
      rating: 4.9,
      lastChat: 'Yesterday',
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      unread: 0,
      status: 'New',
      rating: 4.5,
      lastChat: '2 days ago',
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      unread: 5,
      status: 'Active',
      rating: 4.3,
      lastChat: 'Just now',
    },
    {
      id: '6',
      name: 'James Wilson',
      email: 'james@example.com',
      unread: 0,
      status: 'Active',
      rating: 4.7,
      lastChat: '3 hours ago',
    },
    {
      id: '7',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      unread: 2,
      status: 'VIP',
      rating: 4.4,
      lastChat: '5 min ago',
    },
    {
      id: '8',
      name: 'David Brown',
      email: 'david@example.com',
      unread: 0,
      status: 'Active',
      rating: 4.8,
      lastChat: '1 day ago',
    },
    {
      id: '9',
      name: 'Rachel Miller',
      email: 'rachel@example.com',
      unread: 1,
      status: 'New',
      rating: 4.6,
      lastChat: '30 min ago',
    },
    {
      id: '10',
      name: 'Thomas Lee',
      email: 'thomas@example.com',
      unread: 0,
      status: 'Active',
      rating: 4.2,
      lastChat: '4 days ago',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'New': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Infinite scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= customers.length) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setDisplayCount(prev => Math.min(prev + 10, customers.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount]);

  const handleChat = (customerId) => {
    console.log('Open chat with:', customerId);
    // Open chat interface
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
            <p className="text-xs text-gray-500">Tap to chat with customers</p>
          </div>
          <div className="text-sm text-gray-500">
            {customers.filter(c => c.unread > 0).length} unread
          </div>
        </div>
      </div>

      {/* Ultra Minimal Chat-Focused List */}
      <div className="px-2 py-1">
        {customers.slice(0, displayCount).map((customer) => (
          <Card 
            key={customer.id} 
            className="mb-1 border border-gray-200 bg-white hover:bg-blue-50 transition-colors cursor-pointer active:bg-blue-100"
            onClick={() => handleChat(customer.id)}
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                {/* Customer Info */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Initials Avatar */}
                  <div className="relative">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Unread indicator */}
                    {customer.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{customer.unread}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name and Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {customer.name}
                      </span>
                      <Badge className={`${getStatusColor(customer.status)} px-1.5 py-0 text-xs h-5`}>
                        {customer.status}
                      </Badge>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{customer.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Chat Info and Button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Last Chat Time */}
                  <div className="text-xs text-gray-500 text-right">
                    {customer.lastChat}
                  </div>
                  
                  {/* Chat Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 p-0 rounded-full ${
                      customer.unread > 0 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChat(customer.id);
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerCustomers;