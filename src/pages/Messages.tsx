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
  ChevronLeft, Archive, Users, Edit, Pin, VolumeX, Search,
  Heart, Smile, Frown, AlertTriangle
} from "lucide-react"

// Types
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
  phone?: string
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

// User Selection Dialog Component
function UserSelectionDialog({ open, onOpenChange, currentUserId, onUserSelect }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  onUserSelect: (user: User) => void
}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!open) return

    const loadUsers = async () => {
      setLoading(true)
      try {
        // Get all users except current user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId)
          .order('full_name', { ascending: true })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [open, currentUserId])

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserSelect = async (selectedUser: User) => {
    try {
      // Check if conversation already exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner(
            user_id
          )
        `)
        .contains('conversation_participants.user_id', [currentUserId, selectedUser.id])

      if (convError) throw convError

      if (existingConv && existingConv.length > 0) {
        // Use existing conversation
        onUserSelect(selectedUser)
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (createError) throw createError

        // Add both users as participants
        await supabase.from('conversation_participants').insert([
          { conversation_id: newConversation.id, user_id: currentUserId, joined_at: new Date().toISOString() },
          { conversation_id: newConversation.id, user_id: selectedUser.id, joined_at: new Date().toISOString() }
        ])

        onUserSelect(selectedUser)
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in-zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">New Message</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? 'No users found' : 'No users available'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.full_name || user.username || user.email?.split('@')[0] || 'Unknown User'}
                    </h3>
                    {user.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  {user.email && (
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
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

  const getMessageIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <Camera size={14} className="text-gray-500" />;
      case 'voice':
        return <Mic size={14} className="text-gray-500" />;
      default:
        return null;
    }
  }

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
  }

  return (
    <div className="w-full h-[100dvh] h-[calc(var(--vh,1vh)*100)] flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-2 bg-white border-b border-gray-200 h-16">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
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
              {Math.random() > 0.5 && (
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
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 scroll-smooth"
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
            <div className="text-center text-gray-400 text-xs mb-4 uppercase tracking-wide">
              Today
            </div>

            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === currentUser.id

              return (
                <div key={msg.id} className={cn("flex mb-3", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-white mr-2 mt-auto">
                      {getUserInitials(msg.sender)}
                    </div>
                  )}

                  <div className={cn("max-w-[75%] relative group", isCurrentUser ? "items-end" : "items-start")}>
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 shadow-sm relative",
                      isCurrentUser 
                        ? "bg-blue-500 text-white rounded-br-sm" 
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    )}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={cn("flex items-center gap-2 mt-1.5", isCurrentUser ? "justify-end" : "justify-start")}>
                        <span className={cn("text-[11px]", isCurrentUser ? "text-white/70" : "text-gray-500")}>
                          {formatTime(msg.created_at)}
                        </span>
                        {isCurrentUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                        )}
                      </div>
                    </div>

                    {/* Message actions */}
                    <div className={cn(
                      "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1",
                      isCurrentUser ? "left-0 -translate-x-full mr-2" : "right-0 translate-x-full ml-2"
                    )}>
                      <button onClick={() => setReplyingTo(msg)} className="p-1.5 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => setMessageActionsId(messageActionsId === msg.id ? null : msg.id)} className="p-1.5 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Message actions menu */}
                    {messageActionsId === msg.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMessageActionsId(null)} />
                        <div className={cn(
                          "absolute top-10 z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100",
                          isCurrentUser ? "right-0" : "left-10"
                        )}>
                          <button onClick={() => { copyMessage(msg.content); setMessageActionsId(null); }} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-gray-700">
                            <Copy className="w-4 h-4 text-gray-500" /> 
                            <span>Copy</span>
                          </button>
                          <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-gray-700">
                            <Forward className="w-4 h-4 text-gray-500" /> 
                            <span>Forward</span>
                          </button>
                          {isCurrentUser && (
                            <>
                              <div className="h-px bg-gray-200 my-1" />
                              <button onClick={() => { setEditingMessage(msg); setNewMessage(msg.content); setMessageActionsId(null); }} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-gray-700">
                                <Edit3 className="w-4 h-4 text-gray-500" /> 
                                <span>Edit</span>
                              </button>
                              <button onClick={() => { deleteMessage(msg.id); setMessageActionsId(null); }} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-red-600">
                                <Trash2 className="w-4 h-4" /> 
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {isCurrentUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ml-2 mt-auto">
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
      <div className="shrink-0 px-4 py-3 border-t border-gray-200 bg-white">
        {replyingTo && (
          <div className="px-3 py-2 bg-gray-100 rounded-lg mb-3 flex items-center gap-2">
            <MoreVertical className="w-4 h-4 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">
                Replying to {replyingTo.sender_id === currentUser.id ? "yourself" : getUserDisplayName(replyingTo.sender)}
              </p>
              <p className="text-sm text-gray-900 truncate">{replyingTo.content}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 rounded-full">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}

        {editingMessage && (
          <div className="px-3 py-2 bg-amber-50 rounded-lg mb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-700">Editing message</p>
              <p className="text-sm text-amber-900 truncate">{editingMessage.content}</p>
            </div>
            <button onClick={() => { setEditingMessage(null); setNewMessage(""); }} className="p-1 hover:bg-amber-100 rounded-full">
              <X className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        )}

        {isRecording ? (
          <div className="px-3 py-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors" onMouseDown={() => setIsRecording(true)}>
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center min-w-0">
              <input 
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="bg-transparent flex-1 outline-none text-gray-900 text-sm min-w-0 placeholder:text-gray-500"
              />
              <button onClick={() => setNewMessage(prev => prev + "👍")} className="p-1 hover:bg-gray-200 rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <button 
              onClick={handleSend} 
              disabled={!newMessage.trim() && !editingMessage}
              className={cn(
                "p-2.5 rounded-full transition-colors",
                newMessage.trim() || editingMessage
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {newMessage.trim() || editingMessage ? (
                <Send className="w-5 h-5 text-white" />
              ) : (
                <ThumbsUp className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Messages Component
export default function Messages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups' | 'archived'>('all')
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [swipedItem, setSwipedItem] = useState<string | null>(null)

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

        // Get conversations with details
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
        const processedConversations = (convData || []).map(conv => {
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

  // Real-time subscription
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
          loadConversations()
        }
      )
      .subscribe()

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

        const processedConversations = (convData || []).map(conv => {
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
        })

        setConversations(processedConversations)
      } catch (error) {
        console.error('Error refreshing conversations:', error)
      }
    }

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

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

  // Handle user selection from dialog
  const handleUserSelect = (selectedUser: User) => {
    // Find or create conversation with selected user
    const existingConv = conversations.find(conv => 
      conv.other_user?.id === selectedUser.id
    )

    if (existingConv) {
      setSelectedConversation(existingConv)
      setActiveChat(existingConv.id)
    } else {
      // Create a new conversation object
      const newConversation: Conversation = {
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        is_archived: false,
        other_user: selectedUser,
        unread_count: 0
      }
      setSelectedConversation(newConversation)
      setActiveChat(newConversation.id)
    }
  }

  // Handle conversation click
  const handleConversationClick = (conv: Conversation) => {
    setSelectedConversation(conv)
    setActiveChat(conv.id)
  }

  // Handle swipe actions
  const handleSwipe = (id: string, action: 'archive' | 'delete') => {
    console.log(`${action} conversation ${id}`)
    setSwipedItem(null)
    // TODO: Implement archive/delete functionality
  }

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
  if (activeChat && selectedConversation) {
    return (
      <ChatInterface 
        conversation={selectedConversation}
        currentUser={user}
        onBack={() => {
          setActiveChat(null)
          setSelectedConversation(null)
        }}
      />
    )
  }

  // Otherwise, show the conversations list
  return (
    <>
      <div className="bg-gray-50 h-[100dvh] h-[calc(var(--vh,1vh)*100)] text-gray-900 font-sans overflow-hidden">
        <div className="h-full max-w-2xl mx-auto flex flex-col">
          {/* Header */}
          <div className="shrink-0 px-4 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button 
                onClick={() => setShowUserSelection(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1">
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
              filteredConversations.map((conv) => {
                const isPinned = Math.random() > 0.7
                const isMuted = Math.random() > 0.8
                const hasStory = Math.random() > 0.5
                const isVerified = Math.random() > 0.7

                return (
                  <div
                    key={conv.id}
                    className={`relative overflow-hidden ${
                      isPinned ? 'bg-amber-50' : ''
                    }`}
                  >
                    {/* Swipe actions */}
                    {swipedItem === conv.id && (
                      <div className="absolute right-0 top-0 bottom-0 flex items-center">
                        <button
                          onClick={() => handleSwipe(conv.id, 'archive')}
                          className="px-6 h-full bg-amber-500 text-white flex items-center justify-center"
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
                      className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
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
                      {/* Avatar */}
                      <div className="relative flex-shrink-0 mr-3">
                        {hasStory && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 -m-0.5">
                            <div className="w-full h-full bg-white rounded-full p-0.5"></div>
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 relative z-10 flex items-center justify-center text-white font-bold">
                          {conv.other_user?.full_name?.charAt(0) || conv.other_user?.username?.charAt(0) || '?'}
                        </div>
                        {conv.other_user?.last_active && 
                          new Date().getTime() - new Date(conv.other_user.last_active).getTime() < 300000 && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <h3 className={cn(
                              "text-base truncate",
                              (conv.unread_count || 0) > 0 ? "font-bold text-gray-900" : "font-normal text-gray-900"
                            )}>
                              {conv.other_user?.full_name || conv.other_user?.username || 'Unknown User'}
                            </h3>
                            {isVerified && <BadgeCheck size={16} className="text-blue-500 fill-current flex-shrink-0" />}
                            {isPinned && <Pin size={14} className="text-gray-400 fill-gray-400 flex-shrink-0" />}
                            {isMuted && <VolumeX size={14} className="text-gray-400 flex-shrink-0" />}
                          </div>
                          <span className={cn(
                            "text-xs ml-2 flex-shrink-0",
                            (conv.unread_count || 0) > 0 ? "text-red-500 font-semibold" : "text-gray-400"
                          )}>
                            {formatDate(conv.last_message_at)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 min-w-0 flex-1">
                            <p className={cn(
                              "text-sm truncate",
                              (conv.unread_count || 0) > 0 ? "font-semibold text-gray-900" : "text-gray-500"
                            )}>
                              {conv.last_message?.content || 'Start a conversation'}
                            </p>
                          </div>

                          {(conv.unread_count || 0) > 0 && (
                            <div className="min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                              {conv.unread_count}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Floating action button */}
        <button
          className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          onClick={() => setShowUserSelection(true)}
          aria-label="New message"
        >
          <Edit className="h-6 w-6" />
        </button>
      </div>

      {/* User Selection Dialog */}
      <UserSelectionDialog
        open={showUserSelection}
        onOpenChange={setShowUserSelection}
        currentUserId={user.id}
        onUserSelect={handleUserSelect}
      />
    </>
  )
}