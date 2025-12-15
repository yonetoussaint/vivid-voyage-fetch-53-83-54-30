import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'; // Added useParams here
import { 
  Edit, Pin, VolumeX, Check, CheckCheck, Camera, Mic, BadgeCheck, Phone, Video, 
  Archive, Trash2, Star, Clock, Users, Loader2, Search, X, ImageIcon as ImageIcon2,
  PhoneOff, VideoOff, MicOff, DollarSign, Package, ThumbsUp, Plus, Send, Play,
  Lock, Truck, Wallet, Receipt, Download, Share2, MoreVertical, ArrowLeft,
  Copy, Forward, Edit3, Bell, BellOff, MessageCircle, Truck as TruckIcon, 
  Wallet as WalletIcon, Receipt as ReceiptIcon, Shield, MessageCircle as MessageCircleIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

// ==================== DATABASE SETUP INSTRUCTIONS ====================
/*
Run these SQL commands in your Supabase SQL Editor:

1. Create necessary tables if they don't exist:

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_archived BOOLEAN DEFAULT false,
  is_group BOOLEAN DEFAULT false
);

-- Conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders table for marketplace features
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  original_price DECIMAL(10,2),
  offer_price DECIMAL(10,2),
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'offer' CHECK (status IN ('offer', 'accepted', 'payment_pending', 'delivery_pending', 'completed', 'refunded', 'cancelled')),
  receipt_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blocked users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);

-- User wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  pin_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Transaction history table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'deposit', 'withdrawal')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

2. Enable Row Level Security (RLS):

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

3. Create RLS policies:

-- Conversations: Users can only see conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT USING (EXISTS (
  SELECT 1 FROM conversation_participants 
  WHERE conversation_id = conversations.id 
  AND user_id = auth.uid()
));

-- Conversation participants: Users can only see their own participation
CREATE POLICY "Users can view their conversation participation" ON conversation_participants
FOR SELECT USING (user_id = auth.uid());

-- Messages: Users can only see messages from conversations they're part of
CREATE POLICY "Users can view messages from their conversations" ON messages
FOR SELECT USING (EXISTS (
  SELECT 1 FROM conversation_participants 
  WHERE conversation_id = messages.conversation_id 
  AND user_id = auth.uid()
));

-- Orders: Users can only see orders they're involved in
CREATE POLICY "Users can view their orders" ON orders
FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Blocked users: Users can only see their own blocked list
CREATE POLICY "Users can view their blocked users" ON blocked_users
FOR SELECT USING (blocker_id = auth.uid());

-- User wallets: Users can only see their own wallet
CREATE POLICY "Users can view their own wallet" ON user_wallets
FOR SELECT USING (user_id = auth.uid());

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can view their transactions" ON transactions
FOR SELECT USING (user_id = auth.uid());

4. Create indexes for better performance:

CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_orders_conversation_id ON orders(conversation_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_blocked_users_blocker_id ON blocked_users(blocker_id);

5. Create functions for common operations:

-- Function to create a new conversation
CREATE OR REPLACE FUNCTION create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  new_conversation_id UUID;
BEGIN
  INSERT INTO conversations (last_message_at) 
  VALUES (NOW()) 
  RETURNING id INTO new_conversation_id;
  
  INSERT INTO conversation_participants (conversation_id, user_id) 
  VALUES (new_conversation_id, user1_id);
  
  INSERT INTO conversation_participants (conversation_id, user_id) 
  VALUES (new_conversation_id, user2_id);
  
  RETURN new_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_conversation_as_read(p_conversation_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversation_participants 
  SET last_read_at = NOW() 
  WHERE conversation_id = p_conversation_id 
  AND user_id = p_user_id;
  
  UPDATE messages 
  SET is_read = true 
  WHERE conversation_id = p_conversation_id 
  AND sender_id != p_user_id;
END;
$$ LANGUAGE plpgsql;
*/

// ==================== INTERFACES AND TYPES ====================

interface ConversationWithDetails {
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

type ChatMessage = {
  id: number | string;
  sender: "buyer" | "seller" | string;
  text: string;
  time: string;
  timestamp: Date;
  hasImages?: boolean;
  images?: string[];
  status?: "sent" | "delivered" | "read";
  replyTo?: number;
  isEdited?: boolean;
  voiceDuration?: number;
  isDeleted?: boolean;
  sender_id?: string;
  content?: string;
  created_at?: string;
}

type Order = {
  id: string;
  amount: number;
  deliveryFee: number;
  total: number;
  status: "offer" | "accepted" | "payment_pending" | "delivery_pending" | "completed" | "refunded";
  timestamp: Date;
  receipt?: ReceiptData;
}

type ReceiptData = {
  id: string;
  amount: number;
  deliveryFee: number;
  total: number;
  date: string;
  time: string;
  product: string;
  seller: string;
  buyer: string;
}

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

// ==================== STEP CONFIGURATIONS ====================

const stepConfigs = [
  {
    id: "offer",
    title: "Offer",
    icon: DollarSign,
    iconColor: "text-emerald-600",
    show: () => true,
    isSeller: true,
    getStatusText: (order: Order) => {
      switch (order.status) {
        case "accepted": return "Accepted"
        case "payment_pending": return "Payment Pending"
        case "delivery_pending": return "Awaiting Delivery"
        case "completed": return "Completed"
        case "refunded": return "Refunded"
        default: return "Pending"
      }
    },
    getStatusIcon: (order: Order) => {
      switch (order.status) {
        case "accepted": return Check
        case "payment_pending": return Clock
        case "delivery_pending": return Truck
        case "completed": return Check
        case "refunded": return X
        default: return DollarSign
      }
    }
  },
  {
    id: "accepted",
    title: "Offer Approval",
    icon: Check,
    iconColor: "text-emerald-600",
    show: (order: Order) => ["accepted", "payment_pending", "delivery_pending", "completed", "refunded"].includes(order.status),
    isBuyer: true,
    borderColor: "border-emerald-200",
    getStatusText: (order: Order) => order.status === "accepted" ? "Pending" : "Completed",
    completionDate: (order: Order) => order.status === "accepted" ? order.timestamp : null
  },
  {
    id: "payment",
    title: "Payment",
    icon: Wallet,
    iconColor: "text-amber-600",
    show: (order: Order) => ["payment_pending", "delivery_pending", "completed", "refunded"].includes(order.status),
    isBuyer: true,
    borderColor: "border-amber-200",
    getStatusText: (order: Order) => {
      if (order.status === "payment_pending") return "Pending"
      if (order.status === "refunded") return "Refunded"
      return "Completed"
    },
    completionDate: (order: Order) => ["delivery_pending", "completed"].includes(order.status) ? order.timestamp : null
  },
  {
    id: "delivery",
    title: "Delivery",
    icon: Truck,
    iconColor: "text-blue-600",
    show: (order: Order) => ["delivery_pending", "completed", "refunded"].includes(order.status),
    isBuyer: true,
    borderColor: "border-blue-200",
    getStatusText: (order: Order) => {
      if (order.status === "delivery_pending") return "Pending"
      if (order.status === "completed") return "Completed"
      return "Cancelled"
    },
    completionDate: (order: Order) => order.status === "completed" ? order.timestamp : null
  },
  {
    id: "completed",
    title: "Completed",
    icon: Check,
    iconColor: "text-emerald-600",
    show: (order: Order) => order.status === "completed" && order.receipt,
    isBuyer: true,
    borderColor: "border-emerald-200",
    getStatusText: () => "Completed",
    completionDate: (order: Order) => order.receipt ? new Date(`${order.receipt.date} ${order.receipt.time}`) : null
  },
  {
    id: "refunded",
    title: "Refunded",
    icon: X,
    iconColor: "text-slate-600",
    show: (order: Order) => order.status === "refunded",
    isBuyer: true,
    borderColor: "border-slate-200",
    getStatusText: () => "Refunded",
    completionDate: (order: Order) => order.timestamp
  }
]

// ==================== HELPER COMPONENTS ====================

const OrderStepCard = ({ config, order, currentStep, onAction }: any) => {
  const { id, title, icon: Icon, iconColor, borderColor, isSeller, isBuyer, getStatusText, getStatusIcon, completionDate } = config

  const statusText = getStatusText(order)
  const StatusIcon = getStatusIcon ? getStatusIcon(order) : null
  const completedDate = completionDate ? completionDate(order) : null

  const getActionButtons = () => {
    switch (id) {
      case "offer":
        if (order.status === "offer") {
          return (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onAction("acceptOffer")}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                Counter
              </button>
            </div>
          )
        }
        break

      case "accepted":
        if (order.status === "accepted") {
          return (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onAction("initiatePayment")}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <Wallet className="w-4 h-4" />
                Continue
              </button>
              <button
                onClick={() => onAction("cancelOrder")}
                className="px-4 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        }
        break

      case "payment":
        if (order.status === "payment_pending") {
          return (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onAction("showPinModal")}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
              >
                <Lock className="w-4 h-4" />
                Enter PIN
              </button>
              <button
                onClick={() => onAction("cancelOrder")}
                className="px-4 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        }
        break

      case "delivery":
        if (order.status === "delivery_pending") {
          return (
            <>
              <div className="mt-3 mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Important: Only click "Confirm" when you have physically received the product. 
                  Once confirmed, payment will be released to the seller and cannot be reversed.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onAction("completeDelivery")}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => onAction("cancelOrder")}
                  className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )
        }
        break

      case "completed":
        return (
          <button
            onClick={() => onAction("showReceipt")}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 mt-4"
          >
            <Receipt className="w-4 h-4" />
            View Receipt
          </button>
        )

      case "refunded":
        return (
          <button
            onClick={() => onAction("showWalletBalance")}
            className="w-full bg-slate-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 mt-4"
          >
            <Wallet className="w-4 h-4" />
            Check Wallet
          </button>
        )
    }
    return null
  }

  const getStepContent = () => {
    switch (id) {
      case "offer":
        return (
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Item price</span>
              <span className="text-foreground">${order.amount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Delivery fee</span>
              </div>
              <span className="text-foreground">${order.deliveryFee}</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-emerald-600">${order.total}</span>
            </div>
          </div>
        )

      case "accepted":
        return (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-emerald-600">
              <span>Funds will be held securely until delivery</span>
            </div>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-amber-600">
              <span>
                {order.status === "payment_pending" 
                  ? `Awaiting PIN confirmation` 
                  : `$${order.total} paid from wallet`}
              </span>
            </div>
          </div>
        )

      case "delivery":
        return (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-blue-600">
              <span>
                {order.status === "delivery_pending" 
                  ? "Funds secured. Auto-refund in 24h if not delivered" 
                  : "Product received. Payment released to seller"}
              </span>
            </div>
          </div>
        )

      case "completed":
        return (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-emerald-600">
              <span>Product received. Payment released to seller.</span>
            </div>
          </div>
        )

      case "refunded":
        return (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-slate-600">
              <span>${order.total} refunded to your wallet</span>
            </div>
          </div>
        )
    }
  }

  // Seller's offer card
  if (isSeller) {
    return (
      <div className="flex justify-start mb-4">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
          {order.receipt?.seller?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'JS'}
        </div>
        <div className="max-w-[80%] w-full">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <span className="text-foreground text-sm font-semibold">{title}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground line-through">$899</span>
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  ${order.amount}
                </span>
              </div>
            </div>

            {getStepContent()}

            {/* Status bar at bottom */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {StatusIcon && <StatusIcon className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">{statusText}</span>
                </div>
                {completedDate && (
                  <span className="text-xs text-muted-foreground">
                    {completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>

            {getActionButtons()}
          </div>
        </div>
      </div>
    )
  }

  // Buyer's step cards
  if (isBuyer) {
    const isCompleted = statusText === "Completed" || statusText === "Refunded"
    const isCurrent = order.status === "payment_pending" && id === "payment" || 
                     order.status === "delivery_pending" && id === "delivery" ||
                     order.status === "accepted" && id === "accepted"

    return (
      <div className="relative">
        {/* Step Indicator for progress bar */}
        {currentStep > 0 && (
          <div className="absolute -left-8 top-4">
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              isCompleted 
                ? "bg-emerald-500 border-emerald-500" 
                : "bg-white border-gray-300"
            )}>
              {isCompleted && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        )}

        {/* Card */}
        <div className={`bg-card border ${borderColor} rounded-xl p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <span className="text-foreground text-sm font-semibold">{title}</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              ${order.total}
            </span>
          </div>

          {getStepContent()}

          {/* Status bar at bottom */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isCompleted ? "bg-emerald-500" : "bg-amber-500"
                )} />
                <span className="text-xs text-muted-foreground">{statusText}</span>
              </div>
              {completedDate && (
                <span className="text-xs text-muted-foreground">
                  {completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>

          {getActionButtons()}
        </div>
      </div>
    )
  }

  return null
}

const CallControlBand = ({ 
  callState, 
  callDuration, 
  isMuted, 
  isVideoOn,
  onToggleMute, 
  onToggleVideo, 
  onEndCall 
}: any) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between shadow-md border-b border-blue-800">
      {/* Left side - Call icon and duration */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <div className="text-white">
          <div className="text-sm font-medium">
            {callState === "ringing" ? "Calling..." : formatDuration(callDuration)}
          </div>
          <div className="text-xs text-white/80">
            {callState === "ringing" ? "Ringing..." : "Active call"}
          </div>
        </div>
      </div>

      {/* Right side - Control buttons */}
      <div className="flex items-center gap-2">
        {/* Video toggle - Disabled during ringing */}
        <button
          onClick={callState === "active" ? onToggleVideo : undefined}
          disabled={callState !== "active"}
          className={cn(
            "p-2 rounded-lg transition-colors",
            callState === "active" 
              ? (isVideoOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600')
              : 'bg-white/10 opacity-50 cursor-not-allowed'
          )}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Mute toggle - Disabled during ringing */}
        <button
          onClick={callState === "active" ? onToggleMute : undefined}
          disabled={callState !== "active"}
          className={cn(
            "p-2 rounded-lg transition-colors",
            callState === "active"
              ? (isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30')
              : 'bg-white/10 opacity-50 cursor-not-allowed'
          )}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>

        {/* End call button - Always enabled */}
        <button
          onClick={onEndCall}
          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

// ==================== HOOKS ====================

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

// ==================== COMPONENTS ====================

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
          // Conversation exists
          console.log('Existing conversation found:', sharedConversation.conversation_id);
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
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
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

// ==================== CHAT INTERFACE COMPONENT (Separate Full Page) ====================

export function ChatInterface({ 
  conversationId, 
  otherUser,
  onBack 
}: { 
  conversationId: string; 
  otherUser: { id: string; full_name: string; email: string; avatar_url: string | null };
  onBack: () => void;
}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "seller",
      text: "Hey! Thanks for your interest in the iPhone 15 Pro Max. It's in excellent condition!",
      time: "10:32 AM",
      timestamp: new Date(Date.now() - 3600000 * 2),
      status: "read",
    },
    {
      id: 2,
      sender: "seller",
      text: "Here are some photos of the device:",
      time: "10:33 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.9),
      hasImages: true,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1695048133025-52fd6dda2b62?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1695048133149-b39c00004c1a?w=400&h=400&fit=crop",
      ],
      status: "read",
    },
    {
      id: 3,
      sender: "buyer",
      text: "Looks amazing! Does it come with original box and accessories?",
      time: "10:34 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.8),
      status: "read",
    },
    {
      id: 4,
      sender: "seller",
      text: "Yes! Original box, charger, cable, and even the unused stickers. Everything included.",
      time: "10:35 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.7),
      status: "read",
    }
  ])
  const [loading, setLoading] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [messageActionsId, setMessageActionsId] = useState<number | string | null>(null)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCall, setActiveCall] = useState<null | "audio" | "video">(null)
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [sellerOnline, setSellerOnline] = useState(true)
  const [walletBalance, setWalletBalance] = useState(1250.50)
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  // Product info state
  const [productInfo, setProductInfo] = useState({
    name: "iPhone 15 Pro Max",
    originalPrice: 1099,
    offerPrice: 899,
    finalPrice: 880,
    deliveryFee: 15,
    total: 895
  });

  // Call control states
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAuth()

  // Calculate current step for progress bar
  const getCurrentStep = () => {
    if (!currentOrder) return 0;
    switch (currentOrder.status) {
      case "offer": return 0
      case "accepted": return 1
      case "payment_pending": return 2
      case "delivery_pending": return 3
      case "completed": return 4
      case "refunded": return 0
      default: return 0
    }
  }

  // Filter steps to show
  const visibleSteps = currentOrder ? stepConfigs.filter(config => config.show(currentOrder)) : []
  const hasProgressSteps = visibleSteps.filter(step => step.isBuyer).length > 0

  // Create offer function
  const createOffer = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      amount: productInfo.finalPrice,
      deliveryFee: productInfo.deliveryFee,
      total: productInfo.total,
      status: "offer",
      timestamp: new Date(),
    };
    setCurrentOrder(newOrder);
    
    // Add offer message to chat
    const offerMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "buyer",
      text: `I'd like to offer $${productInfo.finalPrice} for the ${productInfo.name} (including $${productInfo.deliveryFee} delivery). Total: $${productInfo.total}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
    };
    
    setMessages(prev => [...prev, offerMessage]);
    setTimeout(scrollToBottom, 100);
  };

  // Fetch messages
  useEffect(() => {
    if (conversationId && !conversationId.startsWith('test-')) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_id === user?.id ? "buyer" : "seller",
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(msg.created_at),
        status: msg.is_read ? "read" : "delivered",
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (callState === "active") {
      const interval = setInterval(() => setCallDuration(d => d + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [callState])

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000)
      return () => {
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
      }
    }
    setRecordingDuration(0)
  }, [isRecording])

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

  // Handlers
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > 100)
    }
  }

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!message.trim() && !isRecording) return

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "buyer",
      text: editingMessage ? message : message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
      replyTo: replyingTo?.id as number,
      isEdited: !!editingMessage,
      voiceDuration: isRecording ? recordingDuration : undefined,
    }

    try {
      if (editingMessage) {
        setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, text: message, isEdited: true } : m))
        setEditingMessage(null)
      } else {
        setMessages(prev => [...prev, newMessage])
        
        // Send to Supabase if not test chat
        if (!conversationId.startsWith('test-')) {
          const { error } = await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              content: message,
              sender_id: user?.id,
              is_read: false
            });

          if (error) throw error;
        }
      }

      setMessage("")
      setReplyingTo(null)
      setIsRecording(false)
      setTimeout(scrollToBottom, 100)

      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "delivered" } : m))
      }, 1000)
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m))
      }, 2500)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const deleteMessage = (messageId: number | string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true, text: "This message was deleted" } : m))
    setMessageActionsId(null)
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessageActionsId(null)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sent": return <Check className="w-3 h-3 text-muted-foreground" />
      case "delivered": return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case "read": return <CheckCheck className="w-3 h-3 text-blue-500" />
      default: return <Clock className="w-3 h-3 text-muted-foreground" />
    }
  }

  const handleCallStart = (type: "audio" | "video") => {
    setActiveCall(type)
    setCallState("ringing")
    setTimeout(() => setCallState("active"), 2000)
  }

  const handleCallEnd = () => {
    setCallState("idle")
    setActiveCall(null)
    setCallDuration(0)
    setIsMuted(false)
    setIsVideoOn(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  // Order action handlers
  const handleOrderAction = (action: string) => {
    if (!currentOrder) return;

    switch (action) {
      case "acceptOffer":
        const updatedOrder = { 
          ...currentOrder, 
          status: "accepted",
          timestamp: new Date()
        };
        setCurrentOrder(updatedOrder);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "buyer",
          text: "I accept your offer. Let's proceed with payment.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(),
          status: "sent",
        }])
        break

      case "initiatePayment":
        setCurrentOrder(prev => ({ ...prev!, status: "payment_pending" }))
        setShowPinModal(true)
        break

      case "completeDelivery":
        setShowPinModal(true)
        break

      case "cancelOrder":
        setCurrentOrder(prev => ({ ...prev!, status: "refunded" }))
        if (["payment_pending", "delivery_pending", "completed"].includes(currentOrder.status)) {
          setWalletBalance(prev => prev + currentOrder.total)
        }
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "buyer",
          text: "Order cancelled. Refund processed to wallet.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(),
          status: "sent",
        }])
        break

      case "showPinModal":
        setShowPinModal(true)
        break

      case "showReceipt":
        setShowReceipt(true)
        break

      case "showWalletBalance":
        setShowWalletBalance(true)
        break
    }
    setTimeout(scrollToBottom, 100)
  }

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    if (value && index < 3) pinInputRefs.current[index + 1]?.focus()
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
  }

  const processPayment = () => {
    if (!currentOrder) return;
    const total = currentOrder.total

    if (currentOrder.status === "delivery_pending") {
      setTimeout(() => {
        const receipt: ReceiptData = {
          id: `RCPT-${Date.now()}`,
          amount: currentOrder.amount,
          deliveryFee: currentOrder.deliveryFee,
          total: currentOrder.total,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          product: "iPhone 15 Pro Max",
          seller: otherUser.full_name,
          buyer: user?.full_name || "You",
        }

        setCurrentOrder(prev => ({ ...prev!, status: "completed", receipt }))
        setShowPinModal(false)
        setPin(["", "", "", ""])

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "buyer",
          text: `Order completed. Payment of $${total} released to seller.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(),
          status: "sent",
        }])
      }, 1000)
    } else if (currentOrder.status === "payment_pending") {
      if (total > walletBalance) {
        alert("Insufficient funds")
        setPin(["", "", "", ""])
        setShowPinModal(false)
        return
      }

      setTimeout(() => {
        setWalletBalance(prev => prev - total)
        setCurrentOrder(prev => ({ ...prev!, status: "delivery_pending" }))
        setShowPinModal(false)
        setPin(["", "", "", ""])

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "buyer",
          text: `Payment of $${total} completed via wallet. Funds held securely.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(),
          status: "sent",
        }])
      }, 1000)
    }
  }

  // Quick actions
  const quickActions = [
    { icon: DollarSign, label: "Wallet", action: () => setShowWalletBalance(true) },
    { icon: ImageIcon2, label: "Photos", action: () => {} },
    { icon: Receipt, label: "Receipt", action: () => currentOrder?.receipt && setShowReceipt(true) },
  ]

  return (
    <div className="w-full h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex flex-col overflow-hidden relative transition-colors duration-300 bg-background">
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

      <div className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
        {/* Header - Fixed height */}
        <div className="px-2 py-2 flex items-center gap-2 shrink-0 bg-card border-b border-border shadow-sm h-14">
          <button onClick={onBack} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                  {otherUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {sellerOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold text-sm truncate">{otherUser.full_name}</span>
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              </div>
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.5</span>
                <span className="mx-1">•</span>
                <span>Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Video call button */}
            <button 
              onClick={() => callState === "idle" && handleCallStart("video")}
              disabled={callState !== "idle"}
              className={cn(
                "p-2 hover:bg-muted rounded-full transition-colors",
                callState !== "idle" && "opacity-50 cursor-not-allowed"
              )}
            >
              <Video className="w-5 h-5 text-foreground" />
            </button>

            {/* Audio call button */}
            <button 
              onClick={() => callState === "idle" && handleCallStart("audio")}
              disabled={callState !== "idle"}
              className={cn(
                "p-2 hover:bg-muted rounded-full transition-colors",
                callState !== "idle" && "opacity-50 cursor-not-allowed"
              )}
            >
              <Phone className="w-5 h-5 text-foreground" />
            </button>

            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-foreground" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-border my-1" />
                    <button onClick={() => { setNotificationsMuted(!notificationsMuted); setShowMenu(false); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors">
                      {notificationsMuted ? <BellOff className="w-4 h-4 text-muted-foreground" /> : <Bell className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm text-foreground">{notificationsMuted ? "Unmute" : "Mute"} notifications</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Simplified Call Control Band - Only shown when call is ringing or active */}
        {callState !== "idle" && (
          <CallControlBand
            callState={callState}
            callDuration={callDuration}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onEndCall={handleCallEnd}
          />
        )}

        {/* Chat Content - Scrollable area */}
        <div 
          ref={chatContainerRef} 
          onScroll={handleScroll} 
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scroll-smooth"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="text-center text-muted-foreground text-xs mb-3 uppercase tracking-wide">Today</div>

              {/* Messages */}
              {messages.map((msg) => {
                const isBuyer = msg.sender === "buyer"
                const replyMessage = msg.replyTo ? messages.find((m: ChatMessage) => m.id === msg.replyTo) : null

                return (
                  <div key={msg.id} id={`message-${msg.id}`} className={cn("flex mb-2 transition-colors duration-500 rounded-lg", isBuyer ? "justify-end" : "justify-start")}>
                    {!isBuyer && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
                        {otherUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}

                    <div className={cn("max-w-[80%] relative group", isBuyer ? "items-end" : "items-start")}>
                      {replyMessage && (
                        <button className={cn("w-full mb-1 px-2 py-1 rounded-lg text-xs text-left truncate border-l-2", isBuyer ? "bg-blue-400/20 border-blue-300" : "bg-muted border-muted-foreground")}>
                          <span className="text-muted-foreground">{replyMessage.sender === "buyer" ? "You" : otherUser.full_name?.split(' ')[0]}: </span>
                          {replyMessage.text}
                        </button>
                      )}

                      <div className={cn("rounded-2xl px-3 py-2 shadow-sm relative", isBuyer ? "bg-blue-500 text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm", msg.isDeleted && "opacity-60 italic")}>
                        {msg.voiceDuration ? (
                          <div className="flex items-center gap-2 min-w-[150px]">
                            <button onClick={() => setMessageActionsId(msg.id)} className={cn("w-8 h-8 rounded-full flex items-center justify-center", isBuyer ? "bg-white/20" : "bg-muted")}>
                              <Play className="w-4 h-4" />
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(20)].map((_, i) => (
                                  <div key={i} className={cn("w-0.5 rounded-full", isBuyer ? "bg-white/60" : "bg-muted-foreground/60")} style={{ height: `${Math.random() * 16 + 4}px` }} />
                                ))}
                              </div>
                            </div>
                            <span className={cn("text-xs", isBuyer ? "text-white/70" : "text-muted-foreground")}>
                              {formatDuration(msg.voiceDuration || 0)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                            {msg.isEdited && <span className={cn("text-[10px] ml-1", isBuyer ? "text-white/60" : "text-muted-foreground")}>(edited)</span>}
                          </>
                        )}

                        {msg.hasImages && msg.images && (
                          <div className={cn("mt-2 grid gap-1", msg.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                            {msg.images.map((img: string, i: number) => (
                              <button key={i} onClick={() => setViewingImage(img)} className="rounded-lg overflow-hidden bg-muted">
                                <img src={img || "/placeholder.svg"} alt="" className="w-full h-24 object-cover" />
                              </button>
                            ))}
                          </div>
                        )}

                        <div className={cn("flex items-center gap-1 mt-1", isBuyer ? "justify-end" : "justify-start")}>
                          <span className={cn("text-[10px]", isBuyer ? "text-white/60" : "text-muted-foreground")}>{msg.time}</span>
                          {isBuyer && getStatusIcon(msg.status)}
                        </div>
                      </div>

                      <div className={cn("absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border border-border rounded-lg shadow-lg p-0.5", isBuyer ? "left-0 -translate-x-full mr-1" : "right-0 translate-x-full ml-1")}>
                        <button onClick={() => setReplyingTo(msg)} className="p-1 hover:bg-muted rounded">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => setMessageActionsId(messageActionsId === msg.id ? null : msg.id)} className="p-1 hover:bg-muted rounded">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      {messageActionsId === msg.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMessageActionsId(null)} />
                          <div className={cn("absolute top-8 z-50 w-40 bg-popover border border-border rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100", isBuyer ? "right-0" : "left-8")}>
                            <button onClick={() => { copyMessage(msg.text); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm">
                              <Copy className="w-4 h-4" /> Copy
                            </button>
                            <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm">
                              <Forward className="w-4 h-4" /> Forward
                            </button>
                            {isBuyer && (
                              <>
                                <div className="h-px bg-border my-1" />
                                <button onClick={() => { setEditingMessage(msg); setMessage(msg.text); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm">
                                  <Edit3 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => { deleteMessage(msg.id); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm text-red-600">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {isBuyer && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 text-[10px] font-bold text-white ml-1.5 mt-auto">
                        ME
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Order Steps */}
              {currentOrder && (
                <div className="space-y-2 mb-3">
                  {/* Seller's Offer Card */}
                  {visibleSteps.filter(step => step.id === "offer").map(config => (
                    <OrderStepCard
                      key={config.id}
                      config={config}
                      order={currentOrder}
                      currentStep={getCurrentStep()}
                      onAction={handleOrderAction}
                    />
                  ))}

                  {/* Progress Steps */}
                  {hasProgressSteps && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] w-full">
                        <div className="relative pl-8 mb-4">
                          {/* Vertical Progress Line */}
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 flex flex-col items-center">
                            <div className={cn(
                              "w-0.5 flex-1 transition-all duration-300",
                              getCurrentStep() >= 1 ? "bg-emerald-500" : "bg-gray-200"
                            )} />
                          </div>

                          {/* Progress Step Cards */}
                          <div className="space-y-6">
                            {visibleSteps
                              .filter(step => step.isBuyer)
                              .sort((a, b) => {
                                const order = ["accepted", "payment", "delivery", "completed", "refunded"]
                                return order.indexOf(a.id) - order.indexOf(b.id)
                              })
                              .map(config => (
                                <OrderStepCard
                                  key={config.id}
                                  config={config}
                                  order={currentOrder}
                                  currentStep={getCurrentStep()}
                                  onAction={handleOrderAction}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
                    {otherUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <span key={i} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* UI Components */}
        {showScrollToBottom && (
          <button onClick={scrollToBottom} className="absolute bottom-32 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-10">
            <MoreVertical className="w-5 h-5" />
          </button>
        )}

        {/* Fixed bottom sections */}
        <div className="shrink-0">
          {(replyingTo || editingMessage) && (
            <div className="px-3 py-2 bg-muted border-t border-border flex items-center gap-2">
              {replyingTo ? <MoreVertical className="w-4 h-4 text-blue-500" /> : <Edit3 className="w-4 h-4 text-amber-500" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {replyingTo ? `Replying to ${replyingTo.sender === "buyer" ? "yourself" : otherUser.full_name?.split(' ')[0]}` : "Editing message"}
                </p>
                <p className="text-sm text-foreground truncate">{replyingTo?.text || editingMessage?.text}</p>
              </div>
              <button onClick={() => { setReplyingTo(null); setEditingMessage(null); setMessage(""); }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Product info - Fixed height */}
          {!currentOrder ? (
            <div className="px-3 py-2 border-t border-border bg-card flex items-center gap-2 h-16">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm truncate">{productInfo.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-emerald-600 font-bold text-sm">${productInfo.offerPrice}</p>
                  <span className="text-xs text-muted-foreground line-through">${productInfo.originalPrice}</span>
                </div>
              </div>
              <button 
                onClick={createOffer}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3" />Make Offer
              </button>
              <button 
                onClick={() => setShowWalletBalance(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Wallet className="w-3 h-3" />${walletBalance.toFixed(0)}
              </button>
            </div>
          ) : (
            <div className="px-3 py-2 border-t border-border bg-card flex items-center gap-2 h-16">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm truncate">Product</p>
                <div className="flex items-center gap-2">
                  <p className="text-emerald-600 font-bold text-sm">${currentOrder.amount}</p>
                  <span className="text-xs text-muted-foreground">Order Active</span>
                </div>
              </div>
              <button 
                onClick={() => setShowWalletBalance(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Wallet className="w-3 h-3" />${walletBalance.toFixed(0)}
              </button>
            </div>
          )}

          {showQuickActions && (
            <div className="px-3 py-2 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map(({ icon: Icon, label, action }: any) => (
                  <button key={label} onClick={action} className="flex flex-col items-center gap-1 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-foreground">{label}</span>
                </button>
                ))}
              </div>
            </div>
          )}

          {isRecording && (
            <div className="px-3 py-3 bg-red-50 border-t border-red-200 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
              <button onClick={() => setIsRecording(false)} className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-600 font-medium">{formatDuration(recordingDuration)}</span>
                <div className="flex-1 flex items-center gap-0.5">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-1 bg-red-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 4}px`, animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
              </div>
              <button onClick={handleSend} className="p-2 bg-red-500 rounded-full">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Input Bar - Fixed height */}
          {!isRecording && (
            <div className="px-2 py-2 flex items-center gap-1 shrink-0 bg-card border-t border-border h-16">
              <button onClick={() => setShowQuickActions(!showQuickActions)} className="p-2 shrink-0">
                <Plus className={cn("w-6 h-6 transition-transform", showQuickActions ? "rotate-45 text-muted-foreground" : "text-blue-600")} />
              </button>
              <button className="p-2 shrink-0"><Camera className="w-6 h-6 text-blue-600" /></button>
              <button className="p-2 shrink-0"><ImageIcon2 className="w-6 h-6 text-blue-600" /></button>
              <button className="p-2 shrink-0" onMouseDown={() => setIsRecording(true)}><Mic className="w-6 h-6 text-blue-600" /></button>
              <div className="flex-1 bg-muted rounded-full px-3 py-2 flex items-center min-w-0">
                <input ref={inputRef} type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} className="bg-transparent flex-1 outline-none text-foreground text-sm min-w-0 placeholder:text-muted-foreground" />
              </div>
              <button onClick={handleSend} className="p-2 shrink-0">
                {message || editingMessage ? <Send className="w-6 h-6 text-blue-600 fill-blue-600" /> : <ThumbsUp className="w-6 h-6 text-blue-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showWalletBalance && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Wallet Balance</h3>
                <button onClick={() => setShowWalletBalance(false)}><X className="w-6 h-6 text-muted-foreground" /></button>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="w-8 h-8 text-white" />
                  <span className="text-white/80 text-sm">Available Balance</span>
                </div>
                <p className="text-4xl font-bold text-white">${walletBalance.toFixed(2)}</p>
                <p className="text-white/70 text-xs mt-2">Secure wallet for marketplace transactions</p>
              </div>
              <button onClick={() => setShowWalletBalance(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">Close</button>
            </div>
          </div>
        )}

        {showPinModal && currentOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
            <div className="bg-card rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {currentOrder.status === "payment_pending" ? "Confirm Payment" : "Complete Delivery"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {currentOrder.status === "payment_pending" 
                    ? `Enter your 4-digit PIN to pay $${currentOrder.total}`
                    : `Enter PIN to release $${currentOrder.total} to seller`
                  }
                </p>
              </div>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <input key={index} ref={(el) => { pinInputRefs.current[index] = el }} type="password" maxLength={1} value={pin[index]} onChange={(e) => handlePinInput(index, e.target.value)} onKeyDown={(e) => handlePinKeyDown(index, e)} className="w-14 h-14 text-center text-2xl font-bold bg-muted border-2 border-border rounded-xl outline-none focus:border-blue-500 transition-colors" />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setPin(["", "", "", ""]); setShowPinModal(false); }} className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                <button onClick={() => pin.every(digit => digit !== "") ? processPayment() : alert("Please enter your 4-digit PIN")} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  {currentOrder.status === "payment_pending" ? "Confirm" : "Release Funds"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showReceipt && currentOrder?.receipt && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Transaction Receipt</h3>
                <button onClick={() => setShowReceipt(false)}><X className="w-6 h-6 text-muted-foreground" /></button>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Receipt className="w-8 h-8 text-white" />
                  <span className="text-white/80 text-sm">Payment Confirmed</span>
                </div>
                <p className="text-3xl font-bold text-white">${currentOrder.receipt.total}</p>
                <p className="text-white/70 text-sm mt-1">{currentOrder.receipt.date} • {currentOrder.receipt.time}</p>
              </div>
              <div className="space-y-3 mb-6">
                {Object.entries({ "Receipt ID": currentOrder.receipt.id, "Product": currentOrder.receipt.product, "Item Price": `$${currentOrder.receipt.amount}`, "Delivery Fee": `$${currentOrder.receipt.deliveryFee}`, "Seller": currentOrder.receipt.seller }).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                ))}
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-foreground">${currentOrder.receipt.total}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setViewingImage(null)}><X className="w-6 h-6 text-white" /></button>
              <div className="flex gap-2">
                <button className="p-2 bg-white/10 rounded-full"><Share2 className="w-5 h-5 text-white" /></button>
                <button className="p-2 bg-white/10 rounded-full"><Download className="w-5 h-5 text-white" /></button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img src={viewingImage || "/placeholder.svg"} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== TEST CHAT BUTTON ====================

function TestChatButton({ onStartTest }: { onStartTest: () => void }) {
  return (
    <button
      onClick={onStartTest}
      className="fixed bottom-20 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      aria-label="Test chat"
      type="button"
    >
      <MessageCircle size={24} />
    </button>
  );
}

// ==================== MAIN MESSAGES LIST COMPONENT ====================

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('filter') || 'all') as 'all' | 'unread' | 'groups' | 'archived';
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  // State for selected conversation - we'll use URL params instead
  const { conversationId } = useParams();

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
    isArchived: conv.is_archived,
    otherUser: conv.other_user
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

  // Handle conversation click - navigate to chat page
  const handleConversationClick = (conv: any) => {
    setSwipedItem(null);
    if (!conv.id.startsWith('blocked-')) {
      navigate(`/messages/${conv.id}`);
    }
  };

  // Handle test chat start
  const handleStartTestChat = () => {
    navigate(`/messages/test-chat-123`);
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

  // Show the messages list
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
                  onClick={() => handleConversationClick(conv)}
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

        {/* Test chat button */}
        <TestChatButton onStartTest={handleStartTestChat} />
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

// ==================== SEPARATE CHAT PAGE COMPONENT ====================

export function ChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user } = useAuth();
  
  // Find the conversation data
  const { conversations, loading } = useConversations(user?.id || '', 'all');
  
  const conversation = conversations.find(c => c.id === conversationId);
  
  const handleBack = () => {
    navigate('/messages');
  };
  
  if (!conversationId) {
    navigate('/messages');
    return null;
  }
  
  if (loading) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  if (conversationId.startsWith('test-')) {
    // Test chat
    return (
      <ChatInterface
        conversationId={conversationId}
        otherUser={{
          id: 'test-user-456',
          full_name: 'John Seller',
          email: 'john@example.com',
          avatar_url: null
        }}
        onBack={handleBack}
      />
    );
  }
  
  if (!conversation) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex flex-col items-center justify-center p-4">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-500 mb-4">Conversation not found</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ChatInterface
      conversationId={conversation.id}
      otherUser={conversation.other_user}
      onBack={handleBack}
    />
  );
}