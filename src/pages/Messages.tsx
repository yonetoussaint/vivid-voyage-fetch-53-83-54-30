"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/auth/AuthContext'
import { supabase } from "@/integrations/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"
import {
  Phone, Camera, Image as ImageIcon, Mic, ThumbsUp, Plus, Send,
  DollarSign, Package, Star, X, MoreVertical, ArrowLeft, ChevronLeft,
  Copy, Forward, Trash2, Edit3, Clock, Check, CheckCheck,
  Play, Pause, Share2, Bell, BellOff, BadgeCheck, Download,
  Receipt, PhoneOff, Wallet, Lock, Truck, Shield,
  Video, VideoOff, MicOff, Loader2, AlertCircle, MessageSquare,
  Edit, Pin, VolumeX, Users, Archive
} from "lucide-react"
import { UserSelectionDialog } from '@/components/messages/UserSelectionDialog'

// Types
type User = {
  id: string
  full_name?: string
  username?: string
  profile_picture?: string
  avatar_url?: string
  rating?: number
  email?: string
  last_active?: string
}

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
  sender?: User
}

type Conversation = {
  id: string
  created_at: string
  updated_at: string
  last_message_at: string
  is_archived: boolean
  other_user?: User
  unread_count?: number
  last_message?: Message
}

type Order = {
  id: string
  amount: number
  deliveryFee: number
  total: number
  status: "offer" | "accepted" | "payment_pending" | "delivery_pending" | "completed" | "refunded"
  timestamp: Date
  receipt?: ReceiptData
}

type ReceiptData = {
  id: string
  amount: number
  deliveryFee: number
  total: number
  date: string
  time: string
  product: string
  seller: string
  buyer: string
}

// Step Card Configurations
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

// Helper Components
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
          JS
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
                  $880
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

// Simplified Call Control Band Component
const CallControlBand = ({ 
  callState, 
  callDuration, 
  isMuted, 
  isVideoOn,
  onToggleMute, 
  onToggleVideo, 
  onEndCall 
}) => {
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

// Chat Interface Component
const ChatInterface = ({ conversation, currentUser, onBack }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [sellerOnline, setSellerOnline] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [messageActionsId, setMessageActionsId] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCall, setActiveCall] = useState(null)
  const [callState, setCallState] = useState("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [walletBalance, setWalletBalance] = useState(1250.50)
  const [pin, setPin] = useState(["", "", "", ""])
  const [viewingImage, setViewingImage] = useState(null)
  const [currentOrder, setCurrentOrder] = useState({
    id: `ORD-${Date.now()}`,
    amount: 880,
    deliveryFee: 15,
    total: 895,
    status: "offer",
    timestamp: new Date(),
  })
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)

  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const pinInputRefs = useRef([])
  const recordingIntervalRef = useRef(null)

  const otherUser = conversation.other_user

  useEffect(() => {
    if (!conversation?.id || !currentUser) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError

        // Transform to match the chat interface format
        const transformedMessages = (messagesData || []).map(msg => ({
          id: msg.id,
          sender: msg.sender_id === currentUser.id ? "buyer" : "seller",
          text: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(msg.created_at),
          status: msg.is_read ? "read" : "delivered",
          is_read: msg.is_read
        }))

        setMessages(transformedMessages)
        
        // Mark messages as read
        const unreadMessages = messagesData?.filter(
          msg => msg.sender_id !== currentUser.id && !msg.is_read
        ) || []

        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map(msg => msg.id)
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', messageIds)
        }

      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
          }
        }, 100)
      }
    }

    loadMessages()
  }, [conversation?.id, currentUser])

  // Real-time message subscription
  useEffect(() => {
    if (!conversation?.id) return

    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          const { data: newMessage, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(
                id,
                full_name,
                username,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && newMessage) {
            const transformedMessage = {
              id: newMessage.id,
              sender: newMessage.sender_id === currentUser.id ? "buyer" : "seller",
              text: newMessage.content,
              time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              timestamp: new Date(newMessage.created_at),
              status: newMessage.is_read ? "read" : "delivered",
              is_read: newMessage.is_read
            }
            
            setMessages(prev => [...prev, transformedMessage])
            
            if (newMessage.sender_id !== currentUser.id) {
              await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMessage.id)
            }

            setTimeout(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
              }
            }, 100)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversation?.id, currentUser])

  const handleSend = async () => {
    if (!message.trim() && !isRecording) return
    if (!conversation?.id || !currentUser) return

    const { data: sentMessage, error: sendError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: currentUser.id,
        content: editingMessage ? message : message,
        is_read: false,
        reply_to: replyingTo?.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (sendError) {
      console.error('Error sending message:', sendError)
      return
    }

    // Update conversation last message time
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation.id)

    setMessage("")
    setReplyingTo(null)
    setEditingMessage(null)
    setIsRecording(false)
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent": return <Check className="w-3 h-3 text-muted-foreground" />
      case "delivered": return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case "read": return <CheckCheck className="w-3 h-3 text-blue-500" />
      default: return <Clock className="w-3 h-3 text-muted-foreground" />
    }
  }

  const visibleSteps = stepConfigs.filter(config => config.show(currentOrder))
  const hasProgressSteps = visibleSteps.filter(step => step.isBuyer).length > 0

  const getCurrentStep = () => {
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

  // Quick actions
  const quickActions = [
    { icon: DollarSign, label: "Wallet", action: () => setShowWalletBalance(true) },
    { icon: ImageIcon, label: "Photos", action: () => {} },
    { icon: Receipt, label: "Receipt", action: () => currentOrder?.receipt && setShowReceipt(true) },
  ]

  return (
    <div className="w-full h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex flex-col overflow-hidden relative transition-colors duration-300 bg-background">
      <div className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
        {/* Header - Fixed height */}
        <div className="px-2 py-2 flex items-center gap-2 shrink-0 bg-card border-b border-border shadow-sm h-14">
          <button onClick={onBack} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">
                  {otherUser?.full_name?.charAt(0) || otherUser?.username?.charAt(0) || '?'}
                </span>
              </div>
              {sellerOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold text-sm truncate">
                  {otherUser?.full_name || otherUser?.username || 'Unknown User'}
                </span>
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              </div>
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.5</span>
                <span className="mx-1">•</span>
                <span>{sellerOnline ? "Online" : "Offline"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Video call button */}
            <button 
              onClick={() => callState === "idle" && setActiveCall("video") && setCallState("ringing")}
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
              onClick={() => callState === "idle" && setActiveCall("audio") && setCallState("ringing")}
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

        {/* Chat Content - Scrollable area */}
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scroll-smooth"
        >
          <div className="text-center text-muted-foreground text-xs mb-3 uppercase tracking-wide">Today</div>

          {/* Messages */}
          {messages.map((msg) => {
            const isBuyer = msg.sender === "buyer"

            return (
              <div key={msg.id} className={cn("flex mb-2 transition-colors duration-500 rounded-lg", isBuyer ? "justify-end" : "justify-start")}>
                {!isBuyer && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
                    {otherUser?.full_name?.charAt(0) || otherUser?.username?.charAt(0) || '?'}
                  </div>
                )}

                <div className={cn("max-w-[80%] relative group", isBuyer ? "items-end" : "items-start")}>
                  <div className={cn("rounded-2xl px-3 py-2 shadow-sm relative", isBuyer ? "bg-blue-500 text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm")}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <div className={cn("flex items-center gap-1 mt-1", isBuyer ? "justify-end" : "justify-start")}>
                      <span className={cn("text-[10px]", isBuyer ? "text-white/60" : "text-muted-foreground")}>{msg.time}</span>
                      {isBuyer && getStatusIcon(msg.status)}
                    </div>
                  </div>
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
          <div className="space-y-2 mb-3">
            {/* Seller's Offer Card */}
            {visibleSteps.filter(step => step.id === "offer").map(config => (
              <OrderStepCard
                key={config.id}
                config={config}
                order={currentOrder}
                currentStep={getCurrentStep()}
                onAction={(action) => {
                  // Handle order actions
                  console.log('Order action:', action)
                }}
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
                            onAction={(action) => {
                              // Handle order actions
                              console.log('Order action:', action)
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="shrink-0">
          {isRecording ? (
            <div className="px-3 py-3 bg-red-50 border-t border-red-200 flex items-center gap-3">
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
          ) : (
            <div className="px-2 py-2 flex items-center gap-1 shrink-0 bg-card border-t border-border h-16">
              <button onClick={() => setShowQuickActions(!showQuickActions)} className="p-2 shrink-0">
                <Plus className={cn("w-6 h-6 transition-transform", showQuickActions ? "rotate-45 text-muted-foreground" : "text-blue-600")} />
              </button>
              <button className="p-2 shrink-0"><Camera className="w-6 h-6 text-blue-600" /></button>
              <button className="p-2 shrink-0"><ImageIcon className="w-6 h-6 text-blue-600" /></button>
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
      </div>
    </div>
  )
}

// Main Component
export default function Messages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [activeChat, setActiveChat] = useState(null)
  const [showUserSelection, setShowUserSelection] = useState(false)

  // Load conversations
  useEffect(() => {
    if (!user || !isAuthenticated) return

    const loadConversations = async () => {
      setLoading(true)
      try {
        // Get conversations where user is a participant
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)

        if (participantError) throw participantError

        const conversationIds = participantData?.map(p => p.conversation_id) || []

        if (conversationIds.length === 0) {
          setConversations([])
          return
        }

        // Get conversations with latest message and other user info
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select(`
            *,
            conversation_participants!inner(
              user_id,
              profiles!conversation_participants_user_id_fkey(
                id,
                full_name,
                username,
                avatar_url,
                email,
                last_active
              )
            ),
            messages!messages_conversation_id_fkey(
              id,
              content,
              sender_id,
              created_at,
              is_read
            )
          `)
          .in('id', conversationIds)
          .order('last_message_at', { ascending: false })

        if (convError) throw convError

        // Process conversations
        const processedConversations = convData.map(conv => {
          const participants = conv.conversation_participants || []
          const otherUser = participants.find(p => p.user_id !== user.id)?.profiles
          
          const messages = conv.messages || []
          const latestMessage = messages.length > 0 
            ? messages.reduce((latest, current) => 
                new Date(current.created_at) > new Date(latest.created_at) ? current : latest
              )
            : undefined

          return {
            id: conv.id,
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            last_message_at: conv.last_message_at,
            is_archived: conv.is_archived,
            other_user: otherUser,
            unread_count: messages.filter(m => !m.is_read && m.sender_id !== user.id).length,
            last_message: latestMessage
          }
        })

        setConversations(processedConversations)
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [user, isAuthenticated])

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

  // Format date
  const formatDateSafely = (dateInput, addSuffix = false) => {
    try {
      const validDate = new Date(dateInput)
      return formatDistanceToNow(validDate, { addSuffix })
    } catch (error) {
      return addSuffix ? 'just now' : 'recently'
    }
  }

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    switch (activeTab) {
      case 'unread':
        return (conv.unread_count || 0) > 0
      case 'archived':
        return conv.is_archived
      case 'groups':
        return false
      default:
        return !conv.is_archived
    }
  })

  if (authLoading) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex items-center justify-center p-4">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-500 mb-4">Please log in to view your messages</p>
        </div>
      </div>
    )
  }

  // If a chat is active, show the chat interface
  if (activeChat) {
    const activeConversation = conversations.find(c => c.id === activeChat)
    if (!activeConversation) {
      setActiveChat(null)
      return null
    }

    return (
      <ChatInterface 
        conversation={activeConversation}
        currentUser={user}
        onBack={() => setActiveChat(null)}
      />
    )
  }

  // Show conversations list
  return (
    <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] text-gray-900 font-sans overflow-hidden">
      <div className="h-full max-w-2xl mx-auto flex flex-col">
        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button 
                onClick={() => setShowUserSelection(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit3 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex mt-4 space-x-1">
              {['all', 'unread', 'groups', 'archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                    activeTab === tab
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'unread' && conversations.some(c => (c.unread_count || 0) > 0) && (
                    <span className="ml-1.5 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {conversations.filter(c => (c.unread_count || 0) > 0).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500">
                {activeTab === 'all' && 'No messages yet'}
                {activeTab === 'unread' && 'No unread messages'}
                {activeTab === 'groups' && 'No group conversations'}
                {activeTab === 'archived' && 'No archived conversations'}
              </p>
              <button
                onClick={() => setShowUserSelection(true)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Start New Conversation
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setActiveChat(conv.id)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0 mr-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold">
                    {conv.other_user?.full_name?.charAt(0) || conv.other_user?.username?.charAt(0) || '?'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className={cn(
                        "text-base truncate",
                        (conv.unread_count || 0) > 0 ? "font-bold text-gray-900" : "font-normal text-gray-900"
                      )}>
                        {conv.other_user?.full_name || conv.other_user?.username || 'Unknown User'}
                      </h3>
                    </div>
                    <span className={cn(
                      "text-xs ml-2 flex-shrink-0",
                      (conv.unread_count || 0) > 0 ? "text-red-500 font-semibold" : "text-gray-400"
                    )}>
                      {formatDateSafely(conv.last_message_at, true)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate",
                      (conv.unread_count || 0) > 0 ? "font-semibold text-gray-900" : "text-gray-500"
                    )}>
                      {conv.last_message?.content || 'Start a conversation'}
                    </p>
                    {(conv.unread_count || 0) > 0 && (
                      <div className="min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating action button */}
        <button
          className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          onClick={() => setShowUserSelection(true)}
          aria-label="New message"
        >
          <Edit size={24} />
        </button>
      </div>

      {/* User Selection Dialog */}
      <UserSelectionDialog
        open={showUserSelection}
        onOpenChange={setShowUserSelection}
        currentUserId={user.id}
      />
    </div>
  )
}