// src/pages/ConversationDetail.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageBubble from '@/components/messages/MessageBubble';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Archive,
  Ban,
  Loader2,
  Phone,
  Video,
  Camera,
  Image as ImageIcon,
  Mic,
  Plus,
  CheckCircle,
  Shield,
  Package,
  DollarSign,
  MapPin,
  Calendar,
  Truck,
  Star,
  X,
  MicOff,
  VideoOff,
  PhoneCall,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/auth/AuthContext';

// PiP video call component (compact, same as demo)
function PiPVideoCall({ onClose, isMinimized, onToggleMinimize, otherUser }: any) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [position, setPosition] = useState<'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'>('top-right');

  const positions: Record<string, string> = {
    'top-left': 'top-20 left-4',
    'top-right': 'top-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4',
  };

  const cyclePosition = () => {
    const order: any = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
    const i = order.indexOf(position);
    setPosition(order[(i + 1) % order.length]);
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${positions[position]} w-24 h-24 bg-gray-900 rounded-full overflow-hidden border-2 border-blue-500 shadow-2xl z-40 group cursor-move`}>
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">JS</span>
          </div>
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
            <button onClick={() => setIsAudioMuted(!isAudioMuted)} className={`w-7 h-7 rounded-full flex items-center justify-center ${isAudioMuted ? 'bg-red-500' : 'bg-white/30'}`}>
              {isAudioMuted ? <MicOff className="w-3 h-3 text-white" /> : <Mic className="w-3 h-3 text-white" />}
            </button>
            <div className="flex gap-1">
              <button onClick={onToggleMinimize} className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center"><Maximize2 className="w-3 h-3 text-white" /></button>
              <button onClick={onClose} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><X className="w-3 h-3 text-white" /></button>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 px-2 py-0.5 rounded-full">
            <p className="text-white text-xs font-medium">0:45</p>
          </div>
          <div className="absolute top-1 left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positions[position]} w-56 h-72 bg-gray-900 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl z-40`}>
      <div className="p-2 flex items-center justify-between bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">JS</div>
          <div>
            <p className="text-white font-semibold text-xs">{otherUser?.full_name || 'Seller'}</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <p className="text-gray-300 text-xs">0:45</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={cyclePosition} className="text-white hover:bg-white/10 p-1 rounded" title="Change position">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </button>
          <button onClick={onToggleMinimize} className="text-white hover:bg-white/10 p-1 rounded"><Minimize2 className="w-3 h-3" /></button>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded"><X className="w-3 h-3" /></button>
        </div>
      </div>

      <div className="relative h-44 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold mx-auto">JS</div>
          <p className="text-white text-xs font-medium mt-1">John</p>
        </div>

        <div className="absolute bottom-1.5 right-1.5 w-12 h-16 bg-gray-800 rounded-md overflow-hidden border border-white/20">
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center"><p className="text-white text-xs">You</p></div>
        </div>

        <div className="absolute top-1.5 right-1.5 bg-green-500/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <div className="flex gap-0.5"><div className="w-0.5 h-1.5 bg-green-500 rounded"></div><div className="w-0.5 h-2 bg-green-500 rounded"></div><div className="w-0.5 h-2.5 bg-green-500 rounded"></div></div>
        </div>
      </div>

      <div className="p-2 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setIsAudioMuted(!isAudioMuted)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isAudioMuted ? 'bg-red-500' : 'bg-white/20'}`}>
            {isAudioMuted ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
          </button>

          <button onClick={onClose} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600">
            <PhoneCall className="w-4 h-4 text-white transform rotate-135" />
          </button>

          <button onClick={() => setIsVideoMuted(!isVideoMuted)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isVideoMuted ? 'bg-red-500' : 'bg-white/20'}`}>
            {isVideoMuted ? <VideoOff className="w-4 h-4 text-white" /> : <Video className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConversationDetail() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useAuth();
  const currentUserId = user?.id || '';

  const { messages, loading, isConnected, sendMessage, blockUser, archiveConversation } = useMessages(
    conversationId || null,
    currentUserId
  );

  useEffect(() => {
    if (conversationId) fetchOtherUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function fetchOtherUser() {
    try {
      setLoadingUser(true);
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, profiles!conversation_participants_user_id_fkey(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .neq('user_id', currentUserId);

      if (participants && participants.length > 0) {
        setOtherUser(participants[0].profiles);
      }
    } catch (err) {
      console.error('fetchOtherUser err', err);
    } finally {
      setLoadingUser(false);
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const success = await sendMessage(messageText.trim());
    if (success) setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBlockUser = async () => {
    if (!otherUser) return;
    const success = await blockUser(otherUser.id);
    if (success) navigate('/messages');
  };

  const handleArchive = async () => {
    const success = await archiveConversation();
    if (success) navigate('/messages');
  };

  const getInitials = (name?: string) =>
    (name || 'U')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Example quick actions & payment methods (you can wire them to real actions)
  const quickActions = [
    { icon: DollarSign, label: 'Offer' },
    { icon: MapPin, label: 'Location' },
    { icon: Calendar, label: 'Schedule' },
    { icon: ImageIcon, label: 'Photos' },
    { icon: DollarSign, label: 'Payment' },
    { icon: Truck, label: 'Shipping' },
    { icon: Star, label: 'Review' },
    { icon: Package, label: 'Warranty' },
  ];

  const product = {
    title: 'iPhone 15 Pro Max - 256GB',
    price: '$899',
    oldPrice: '$1,099',
    inStock: true,
    listedAgo: '2 days ago',
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={() => navigate('/messages')}>
            <ArrowLeft className="w-6 h-6 text-blue-600 shrink-0" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shrink-0 flex items-center justify-center relative">
            {otherUser?.avatar_url ? (
              <img src={otherUser.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-white font-bold text-sm">{getInitials(otherUser?.full_name)}</span>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold text-base truncate flex items-center gap-1">
              {otherUser?.full_name || 'User'}
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{otherUser?.rating ? `${otherUser.rating} •` : '4.9 •'} Active now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Phone className="w-5 h-5 text-blue-600 cursor-pointer" onClick={() => setShowVideoCall(true)} />
          <Video className="w-5 h-5 text-blue-600 cursor-pointer" onClick={() => setShowVideoCall(true)} />
          <div className="relative">
            <MoreVertical className="w-5 h-5 text-blue-600 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl py-2 w-48 z-50 border border-gray-200">
                {[
                  { icon: Shield, label: 'View Seller Profile' },
                  { icon: Star, label: 'View Reviews' },
                  { icon: Shield, label: 'Report User', danger: true },
                  { icon: Ban, label: 'Block User', danger: true },
                ].map((item: any, i: number) => (
                  <button key={i} onClick={() => { if (item.label === 'Block User') handleBlockUser(); }} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${item.danger ? 'text-red-600' : ''}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Card */}
      <div className="mx-4 mt-3 bg-white rounded-xl p-3 shrink-0 border border-gray-200 shadow-sm">
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-green-600 font-bold text-lg">{product.price}</p>
              <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">In Stock</span>
              <span className="text-xs text-gray-500">Listed 2 days ago</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4" />
            Buy Now
          </button>
          <button className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-300" onClick={() => setShowPaymentModal(true)}>
            <DollarSign className="w-4 h-4" />
            Make Offer
          </button>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-center text-gray-500 text-xs mb-4 uppercase">Today</div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
            <Shield className="w-3.5 h-3.5 text-gray-600" />
            <p className="text-xs text-gray-600">Messages are encrypted</p>
          </div>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-center">
            <div>
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((m: any) => {
            const isCurrentUser = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
                <MessageBubble message={m} isCurrentUser={isCurrentUser} />
              </div>
            );
          })
        )}

        {/* Typing indicator bubble */}
        <div className="flex items-start gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">JS</div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
            <div className="flex gap-1">
              {[0, 0.1, 0.2].map((delay, i) => (
                <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards (examples) */}
        <div className="max-w-[90%]">
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900 text-sm font-semibold">Warranty Information</span>
            </div>
            <p className="text-gray-700 text-xs mb-0.5">Apple Limited Warranty</p>
            <p className="text-gray-500 text-xs">Valid until June 15, 2025 • 6 months remaining</p>
          </div>

          <div className="bg-white border-2 border-yellow-400 rounded-xl p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-yellow-700" />
              <span className="text-gray-900 text-sm font-semibold">Counter Offer</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-gray-900 font-bold text-2xl">$880</p>
              <span className="text-gray-600 text-sm">Final price</span>
            </div>
            <p className="text-gray-600 text-xs">Includes all original accessories and 6 months warranty</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700">Accept Offer</button>
              <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-900 hover:bg-gray-300">Counter</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900 text-sm font-semibold">Meeting Proposal</span>
            </div>
            <div className="space-y-3 mb-3">
              {[{ icon: MapPin, title: 'Starbucks Downtown', desc: '123 Main St, Safe public location' }, { icon: Calendar, title: 'Tomorrow, Dec 11', desc: '3:00 PM - 4:00 PM' }, { icon: Truck, title: 'Hand Delivery', desc: 'Meet in person for exchange' }].map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <item.icon className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-600 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-blue-700 text-xs">💡 Tip: Always meet in safe, public places during daylight hours</p>
            </div>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0 shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <action.icon className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="px-2 py-2 flex items-center gap-1 shrink-0 bg-white border-t border-gray-200">
        <button className="p-2 shrink-0" onClick={() => setShowQuickActions(!showQuickActions)}>
          <Plus className={`w-6 h-6 transition-transform ${showQuickActions ? 'rotate-45 text-gray-500' : 'text-blue-600'}`} />
        </button>
        <button className="p-2 shrink-0"><Camera className="w-6 h-6 text-blue-600" /></button>
        <button className="p-2 shrink-0"><ImageIcon className="w-6 h-6 text-blue-600" /></button>
        <button className="p-2 shrink-0"><Mic className="w-6 h-6 text-blue-600" /></button>

        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center min-w-0">
          <textarea
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            className="bg-transparent flex-1 outline-none text-gray-900 text-sm resize-none min-h-[30px] max-h-32"
          />
          <button className="ml-2 mr-0">
            <span className="text-gray-500 text-xs">Aa</span>
          </button>
        </div>

        <button onClick={handleSendMessage} className="p-2 shrink-0">
          {messageText ? <Send className="w-6 h-6 text-blue-600" /> : <CheckCircle className="w-6 h-6 text-blue-600" />}
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Choose Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)}><X className="w-6 h-6 text-gray-600" /></button>
            </div>
            <div className="space-y-3">
              <div className="bg-white border-2 rounded-xl p-4 shadow-sm border-green-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-xs font-bold text-white">$</div>
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-600">Pay when you receive the item</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 shadow-sm hover:border-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">M</div>
                    <div>
                      <p className="font-semibold text-gray-900">Moncash</p>
                      <p className="text-xs text-gray-600">Mobile money transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 shadow-sm hover:border-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold text-white">N</div>
                    <div>
                      <p className="font-semibold text-gray-900">Natcash</p>
                      <p className="text-xs text-gray-600">Mobile money transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium mt-6 hover:bg-green-700">Continue with Cash on Delivery</button>
          </div>
        </div>
      )}

      {/* PiP Video Call */}
      {showVideoCall && (
        <PiPVideoCall
          onClose={() => setShowVideoCall(false)}
          isMinimized={isCallMinimized}
          onToggleMinimize={() => setIsCallMinimized(!isCallMinimized)}
          otherUser={otherUser}
        />
      )}
    </div>
  );
}