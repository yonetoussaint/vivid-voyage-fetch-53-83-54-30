"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/auth/AuthContext'
import { supabase } from "@/integrations/supabase/client"
import { 
  Phone, Camera, Image as ImageIcon, Mic, ThumbsUp, Plus, Send,
  DollarSign, Package, Star, X, MoreVertical, ArrowLeft,
  Copy, Forward, Trash2, Edit3, Clock, Check, CheckCheck,
  Play, Pause, Share2, Bell, BellOff, BadgeCheck, Download,
  Receipt, PhoneOff, Wallet, Lock, Truck, Shield,
  Video, VideoOff, MicOff, Loader2, AlertCircle, MessageSquare,
  ChevronLeft, Archive, Users
} from "lucide-react"

// Types matching the messages list
type User = {
  id: string
  username?: string
  full_name?: string
  profile_picture?: string
  avatar_url?: string
  rating?: number
  email?: string
  last_active?: string
  is_online?: boolean
  isVerified?: boolean
}

type Product = {
  id: string
  name: string
  price: number
  discount_price?: number
  description?: string
  images?: string[]
  seller_id?: string
  status: string
  created_at: string
  seller?: User
}

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
  sender?: User
  reply_to?: string
  reply_to_message?: Message
  images?: string[]
  status?: "sent" | "delivered" | "read"
  is_edited?: boolean
  voice_duration?: number
  is_deleted?: boolean
}

type Conversation = {
  id: string
  created_at: string
  updated_at: string
  last_message_at: string
  is_archived: boolean
  other_user?: User
  product?: Product
  unread_count?: number
  last_message?: Message
}

type Order = {
  id: string
  product_id: string
  seller_id: string
  buyer_id: string
  quantity: number
  unit_price: number
  total_amount: number
  status: string
  payment_status: string
  order_date: string
  created_at: string
  updated_at: string
  product?: Product
  seller?: User
  buyer?: User
}

// Main Messages Component
export default function Messages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups' | 'archived'>('all')
  const [activeChat, setActiveChat] = useState<string | null>(null)
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

        // Process conversations to get other user info and latest message
        const processedConversations = convData.map(conv => {
          const participants = conv.conversation_participants || []
          const otherUser = participants.find(p => p.user_id !== user.id)?.profiles
          
          // Get latest message
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
            product: null, // You can add product association if needed
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

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('conversation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Refresh conversations when new messages arrive
          const loadConversations = async () => {
            try {
              const { data: participantData } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', user.id)

              const conversationIds = participantData?.map(p => p.conversation_id) || []

              if (conversationIds.length === 0) return

              const { data: convData } = await supabase
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

              const processedConversations = convData?.map(conv => {
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
                  product: null,
                  unread_count: messages.filter(m => !m.is_read && m.sender_id !== user.id).length,
                  last_message: latestMessage
                }
              }) || []

              setConversations(processedConversations)
            } catch (error) {
              console.error('Error refreshing conversations:', error)
            }
          }
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  // Filter conversations based on active tab
  const filteredConversations = conversations.filter(conv => {
    switch (activeTab) {
      case 'unread':
        return (conv.unread_count || 0) > 0
      case 'archived':
        return conv.is_archived
      case 'groups':
        return false // You can implement group detection logic here
      default:
        return !conv.is_archived
    }
  })

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
            <MessageSquare className="h-8 w-8 text-white" />
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

  // Otherwise, show the conversations list
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
      `}</style>

      <div className="h-full max-w-2xl mx-auto flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-4 py-3 bg-white border-b border-gray-200">
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
            {(['all', 'unread', 'groups', 'archived'] as const).map((tab) => (
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

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto bg-white">
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
                  {conv.other_user?.last_active && 
                    new Date().getTime() - new Date(conv.other_user.last_active).getTime() < 300000 && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
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
                      {Math.random() > 0.7 && (
                        <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs ml-2 flex-shrink-0",
                      (conv.unread_count || 0) > 0 ? "text-red-500 font-semibold" : "text-gray-400"
                    )}>
                      {formatDate(conv.last_message_at)}
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
          <Edit3 className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

// Chat Interface Component
function ChatInterface({ conversation, currentUser, onBack }: { 
  conversation: Conversation, 
  currentUser: any, 
  onBack: () => void 
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [sellerOnline, setSellerOnline] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [messageActionsId, setMessageActionsId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCall, setActiveCall] = useState<null | "audio" | "video">(null)
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [walletBalance, setWalletBalance] = useState(1250.50)
  const [pin, setPin] = useState(["", "", "", ""])
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const otherUser = conversation.other_user

  // Load messages
  useEffect(() => {
    if (!conversation.id || !currentUser) return

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

        setMessages(messagesData || [])
        
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
  }, [conversation.id, currentUser])

  // Real-time message subscription
  useEffect(() => {
    if (!conversation.id) return

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
          // Fetch the new message with sender data
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
            setMessages(prev => [...prev, newMessage])
            
            // Mark as read if it's from other user
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
  }, [conversation.id, currentUser])

  // Check if other user is online
  useEffect(() => {
    if (!otherUser?.last_active) return

    const checkOnlineStatus = () => {
      const lastActive = new Date(otherUser.last_active || '')
      const now = new Date()
      const diffInMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)
      setSellerOnline(diffInMinutes < 5) // Online if active in last 5 minutes
    }

    checkOnlineStatus()
    const interval = setInterval(checkOnlineStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [otherUser])

  // Call duration timer
  useEffect(() => {
    if (callState === "active") {
      const interval = setInterval(() => setCallDuration(d => d + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [callState])

  // Recording timer
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

  const handleSend = async () => {
    if (!newMessage.trim() && !isRecording) return
    if (!conversation.id || !currentUser) return

    const messageContent = editingMessage ? newMessage : newMessage

    const { data: sentMessage, error: sendError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: currentUser.id,
        content: messageContent,
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

    setNewMessage("")
    setReplyingTo(null)
    setEditingMessage(null)
    setIsRecording(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getUserInitials = (user: User | null | undefined) => {
    if (!user) return "??"
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase()
    }
    return "??"
  }

  const getUserDisplayName = (user: User | null | undefined) => {
    if (!user) return "Unknown User"
    return user.full_name || user.username || user.email?.split('@')[0] || "User"
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
  }

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      console.error('Error deleting message:', error)
      return
    }

    setMessages(prev => prev.filter(m => m.id !== messageId))
    setMessageActionsId(null)
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessageActionsId(null)
  }

  return (
    <div className="w-full h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 px-3 py-2 flex items-center gap-2 bg-white border-b border-gray-200 h-14">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold">
              {getUserInitials(otherUser)}
            </div>
            {sellerOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-900 font-semibold text-sm truncate">
                {getUserDisplayName(otherUser)}
              </span>
              {otherUser?.isVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <span>{sellerOnline ? "Online" : "Offline"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleCallStart("video")}
            disabled={callState !== "idle"}
            className={cn(
              "p-2 hover:bg-gray-100 rounded-full transition-colors",
              callState !== "idle" && "opacity-50 cursor-not-allowed"
            )}
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={() => handleCallStart("audio")}
            disabled={callState !== "idle"}
            className={cn(
              "p-2 hover:bg-gray-100 rounded-full transition-colors",
              callState !== "idle" && "opacity-50 cursor-not-allowed"
            )}
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Call Control Band */}
      {callState !== "idle" && (
        <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between shadow-md border-b border-blue-800">
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
          <button
            onClick={handleCallEnd}
            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scroll-smooth"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="text-center text-gray-400 text-xs mb-3 uppercase tracking-wide">
              Today
            </div>

            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === currentUser.id

              return (
                <div key={msg.id} className={cn("flex mb-2", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-white mr-1.5 mt-auto">
                      {getUserInitials(msg.sender)}
                    </div>
                  )}

                  <div className={cn("max-w-[80%] relative group", isCurrentUser ? "items-end" : "items-start")}>
                    <div className={cn(
                      "rounded-2xl px-3 py-2 shadow-sm relative",
                      isCurrentUser 
                        ? "bg-blue-500 text-white rounded-br-sm" 
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    )}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={cn("flex items-center gap-1 mt-1", isCurrentUser ? "justify-end" : "justify-start")}>
                        <span className={cn("text-[10px]", isCurrentUser ? "text-white/60" : "text-gray-500")}>
                          {formatTime(msg.created_at)}
                        </span>
                        {isCurrentUser && (
                          <CheckCheck className="w-3 h-3 text-white/60" />
                        )}
                      </div>
                    </div>

                    <div className={cn(
                      "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg p-0.5",
                      isCurrentUser ? "left-0 -translate-x-full mr-1" : "right-0 translate-x-full ml-1"
                    )}>
                      <button onClick={() => setReplyingTo(msg)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => setMessageActionsId(messageActionsId === msg.id ? null : msg.id)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {messageActionsId === msg.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMessageActionsId(null)} />
                        <div className={cn(
                          "absolute top-8 z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100",
                          isCurrentUser ? "right-0" : "left-8"
                        )}>
                          <button onClick={() => { copyMessage(msg.content); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 text-sm">
                            <Copy className="w-4 h-4" /> Copy
                          </button>
                          {isCurrentUser && (
                            <>
                              <div className="h-px bg-gray-200 my-1" />
                              <button onClick={() => { setEditingMessage(msg); setNewMessage(msg.content); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 text-sm">
                                <Edit3 className="w-4 h-4" /> Edit
                              </button>
                              <button onClick={() => { deleteMessage(msg.id); setMessageActionsId(null); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 text-sm text-red-600">
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {isCurrentUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ml-1.5 mt-auto">
                      {getUserInitials(currentUser)}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="shrink-0 px-3 py-2 border-t border-gray-200 bg-white">
        {replyingTo && (
          <div className="px-3 py-2 bg-gray-100 rounded-lg mb-2 flex items-center gap-2">
            <MoreVertical className="w-4 h-4 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">
                Replying to {replyingTo.sender_id === currentUser.id ? "yourself" : getUserDisplayName(replyingTo.sender)}
              </p>
              <p className="text-sm text-gray-900 truncate">{replyingTo.content}</p>
            </div>
            <button onClick={() => setReplyingTo(null)}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}

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
          <div className="flex items-center gap-1">
            <button onClick={() => setNewMessage(prev => prev + "👍")} className="p-2">
              <ThumbsUp className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2">
              <Camera className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2">
              <ImageIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2" onMouseDown={() => setIsRecording(true)}>
              <Mic className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 flex items-center min-w-0">
              <input 
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="bg-transparent flex-1 outline-none text-gray-900 text-sm min-w-0 placeholder:text-gray-500"
              />
            </div>
            <button onClick={handleSend} className="p-2">
              {newMessage || editingMessage ? (
                <Send className="w-6 h-6 text-blue-600" />
              ) : (
                <Plus className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Wallet Balance Modal */}
      {showWalletBalance && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Wallet Balance</h3>
              <button onClick={() => setShowWalletBalance(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-8 h-8 text-white" />
                <span className="text-white/80 text-sm">Available Balance</span>
              </div>
              <p className="text-4xl font-bold text-white">${walletBalance.toFixed(2)}</p>
              <p className="text-white/70 text-xs mt-2">Secure wallet for marketplace transactions</p>
            </div>
            <button onClick={() => setShowWalletBalance(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}