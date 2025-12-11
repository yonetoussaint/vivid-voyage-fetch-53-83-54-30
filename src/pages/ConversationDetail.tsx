"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Phone,
  Camera,
  ImageIcon,
  Mic,
  ThumbsUp,
  Plus,
  Smile,
  Send,
  MapPin,
  DollarSign,
  Package,
  Star,
  Shield,
  CheckCircle,
  X,
  CreditCard,
  Truck,
  Calendar,
  PhoneCall,
  MicOff,
  Volume2,
  Reply,
  Zap,
  Lock,
  ArrowDown,
  Search,
  MoreVertical,
  ArrowLeft,
  Video,
  Pin,
  PinOff,
  Copy,
  Forward,
  Trash2,
  Edit3,
  Clock,
  Check,
  CheckCheck,
  AlertTriangle,
  Eye,
  ImageIcon as ImageIcon2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Heart,
  Share2,
  Flag,
  Bell,
  BellOff,
  BadgeCheck,
  ShieldCheck,
  Download,
  LayoutGrid,
  List,
  Receipt,
  PhoneOff,
} from "lucide-react"

type Message = {
  id: number
  sender: "buyer" | "seller"
  text: string
  time: string
  timestamp: Date
  hasImages?: boolean
  images?: string[]
  type?: "text" | "offer" | "location" | "voice" | "system"
  status?: "sent" | "delivered" | "read"
  reactions?: { emoji: string; count: number; users: string[] }[]
  replyTo?: number
  isPinned?: boolean
  isEdited?: boolean
  voiceDuration?: number
  isStarred?: boolean
  isDeleted?: boolean
  translatedText?: string
  linkPreview?: { title: string; description: string; image: string; url: string }
}

export default function BuyerSellerChat() {
  // Core state
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "seller",
      text: "Hey! Thanks for your interest in the iPhone 15 Pro Max. It's in excellent condition!",
      time: "10:32 AM",
      timestamp: new Date(Date.now() - 3600000 * 2),
      status: "read",
      reactions: [{ emoji: "👋", count: 1, users: ["You"] }],
    },
    {
      id: 2,
      sender: "seller",
      text: "Here are some photos of the device:",
      time: "10:33 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.9),
      hasImages: true,
      images: [
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
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
      isPinned: true,
    },
    {
      id: 5,
      sender: "buyer",
      text: "Perfect! Any scratches or damages?",
      time: "10:36 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.6),
      status: "read",
    },
    {
      id: 6,
      sender: "seller",
      text: "No scratches! Always used with case and screen protector. Battery health is 98%. Face ID and all features work perfectly.",
      time: "10:37 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.5),
      status: "read",
      isPinned: true,
    },
    {
      id: 7,
      sender: "buyer",
      text: "Would you consider $850?",
      time: "10:38 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.4),
      type: "offer",
      status: "read",
    },
    {
      id: 8,
      sender: "seller",
      text: "I can do $880 - that's my best price. Includes all original accessories and I'll throw in a premium case.",
      time: "10:39 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.3),
      type: "offer",
      status: "read",
    },
    {
      id: 9,
      sender: "buyer",
      text: "Deal! When can we meet?",
      time: "10:40 AM",
      timestamp: new Date(Date.now() - 3600000),
      status: "delivered",
      reactions: [{ emoji: "🤝", count: 2, users: ["You", "John Seller"] }],
    },
  ])

  // UI state
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showProductPanel, setShowProductPanel] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResultIndex, setSearchResultIndex] = useState(0)
  const [showMediaGallery, setShowMediaGallery] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showEmojiPickerForMessage, setShowEmojiPickerForMessage] = useState<number | null>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showSellerProfile, setShowSellerProfile] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false)
  const [showRatingPrompt, setShowRatingPrompt] = useState(false)
  const [pinnedMessagesExpanded, setPinnedMessagesExpanded] = useState(false)
  const [messageActionsId, setMessageActionsId] = useState<number | null>(null)

  // Reply state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null)

  // Call state
  const [activeCall, setActiveCall] = useState<null | "audio" | "video">(null)
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)

  // Typing indicator
  const [isTyping, setIsTyping] = useState(true)
  const [sellerOnline, setSellerOnline] = useState(true)

  // Payment
  const [selectedPayment, setSelectedPayment] = useState("cash")

  // Offer
  const [offerAmount, setOfferAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("")

  // Schedule
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  // Rating
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  // Notifications
  const [notificationsMuted, setNotificationsMuted] = useState(false)

  // Translation
  const [showTranslation, setShowTranslation] = useState(false)

  // Image viewer
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [mediaGalleryView, setMediaGalleryView] = useState<"grid" | "list">("grid")

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Derived data
  const pinnedMessages = messages.filter((m) => m.isPinned)
  const starredMessages = messages.filter((m) => m.isStarred)
  const allMedia = messages.filter((m) => m.hasImages).flatMap((m) => m.images || [])
  const searchResults = searchQuery
    ? messages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : []
  const filteredMessages = searchQuery ? searchResults : messages

  // Emojis for reactions
  const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "🤝"]
  const allEmojis = [
    "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮", "🥱", "😴", "🤤", "😪", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "💕", "🔥", "✨", "💫", "⭐", "🌟", "💥", "💢", "💦", "💨", "🎉", "🎊", "🎁",
  ]

  // Quick replies
  const quickReplies = [
    "Is this still available?",
    "What's your best price?",
    "Can we meet today?",
    "Can you send more photos?",
    "Is the price negotiable?",
    "Where are you located?",
  ]

  // Quick actions
  const quickActions = [
    { icon: DollarSign, label: "Offer", color: "text-emerald-600", action: () => setShowOfferModal(true) },
    { icon: MapPin, label: "Location", color: "text-blue-600", action: () => setShowLocationPicker(true) },
    { icon: Calendar, label: "Schedule", color: "text-orange-600", action: () => setShowScheduleModal(true) },
    { icon: ImageIcon, label: "Photos", color: "text-purple-600" },
    { icon: CreditCard, label: "Payment", color: "text-pink-600", action: () => setShowPaymentModal(true) },
    { icon: Truck, label: "Shipping", color: "text-cyan-600" },
    { icon: Shield, label: "Insurance", color: "text-amber-600", action: () => setShowInsuranceModal(true) },
    { icon: Receipt, label: "Receipt", color: "text-slate-600", action: () => setShowReceiptModal(true) },
  ]

  // Payment methods
  const paymentMethods = [
    { id: "cash", name: "Cash on Delivery", desc: "Pay when you receive the item", icon: DollarSign, color: "emerald" },
    { id: "escrow", name: "Secure Escrow", desc: "Payment held until confirmed", icon: Shield, color: "blue" },
    { id: "moncash", name: "Moncash", desc: "Mobile money transfer", initial: "M", color: "blue" },
    { id: "natcash", name: "Natcash", desc: "Mobile money transfer", initial: "N", color: "orange" },
    { id: "card", name: "Card Payment", desc: "Credit or debit card", icon: CreditCard, color: "purple" },
  ]

  // Safe locations
  const safeLocations = [
    { id: "1", name: "Police Station Lobby", address: "123 Safety Ave", rating: 5, verified: true },
    { id: "2", name: "Starbucks Downtown", address: "456 Main St", rating: 4.8, verified: true },
    { id: "3", name: "Mall Food Court", address: "789 Shopping Blvd", rating: 4.5, verified: true },
    { id: "4", name: "Public Library", address: "321 Book Lane", rating: 4.7, verified: true },
  ]

  // Effects
  useEffect(() => {
    if (callState === "active") {
      const interval = setInterval(() => setCallDuration((d) => d + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [callState])

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => setRecordingDuration((d) => d + 1), 1000)
      return () => {
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
      }
    }
    setRecordingDuration(0)
  }, [isRecording])

  useEffect(() => {
    // Simulate typing indicator
    const timeout = setTimeout(() => setIsTyping(false), 3000)
    return () => clearTimeout(timeout)
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

  const scrollToMessage = (messageId: number) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.add("bg-yellow-100")
      setTimeout(() => element.classList.remove("bg-yellow-100"), 2000)
    }
  }

  const handleSend = () => {
    if (!message.trim() && !isRecording) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "buyer",
      text: editingMessage ? message : message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
      replyTo: replyingTo?.id,
      isEdited: !!editingMessage,
      type: isRecording ? "voice" : "text",
      voiceDuration: isRecording ? recordingDuration : undefined,
    }

    if (editingMessage) {
      setMessages((prev) => prev.map((m) => (m.id === editingMessage.id ? { ...m, text: message, isEdited: true } : m)))
      setEditingMessage(null)
    } else {
      setMessages([...messages, newMessage])
    }

    setMessage("")
    setReplyingTo(null)
    setIsRecording(false)
    setTimeout(scrollToBottom, 100)

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newMessage.id ? { ...m, status: "delivered" } : m)))
    }, 1000)
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newMessage.id ? { ...m, status: "read" } : m)))
    }, 2500)
  }

  const addReaction = (messageId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const existingReaction = m.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.users.includes("You")) {
              return {
                ...m,
                reactions: m.reactions
                  ?.filter((r) => r.emoji !== emoji || r.count > 1)
                  .map((r) =>
                    r.emoji === emoji ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== "You") } : r,
                  ),
              }
            }
            return {
              ...m,
              reactions: m.reactions?.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "You"] } : r,
              ),
            }
          }
          return { ...m, reactions: [...(m.reactions || []), { emoji, count: 1, users: ["You"] }] }
        }
        return m
      }),
    )
    setShowEmojiPickerForMessage(null)
  }

  const togglePin = (messageId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)))
    setMessageActionsId(null)
  }

  const toggleStar = (messageId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)))
    setMessageActionsId(null)
  }

  const deleteMessage = (messageId: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true, text: "This message was deleted" } : m)),
    )
    setMessageActionsId(null)
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessageActionsId(null)
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
    inputRef.current?.focus()
  }

  const sendOffer = () => {
    if (!offerAmount) return
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "buyer",
      text: `I'd like to offer $${offerAmount}${offerMessage ? ` - ${offerMessage}` : ""}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
      type: "offer",
    }
    setMessages([...messages, newMessage])
    setOfferAmount("")
    setOfferMessage("")
    setShowOfferModal(false)
    setTimeout(scrollToBottom, 100)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return <Clock className="w-3 h-3 text-muted-foreground" />
    }
  }

  // Call handlers
  const handleCallStart = (type: "audio" | "video") => {
    setActiveCall(type)
    setCallState("ringing")
    // Simulate call connecting after 2 seconds
    setTimeout(() => {
      setCallState("active")
    }, 2000)
  }

  const handleCallEnd = () => {
    setCallState("idle")
    setActiveCall(null)
    setCallDuration(0)
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative transition-colors duration-300">
      <div className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
        {/* Header */}
        <div className="px-2 py-2 flex items-center gap-2 shrink-0 bg-card border-b border-border shadow-sm">
          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <button onClick={() => setShowSellerProfile(true)} className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              {sellerOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold text-sm truncate">John Seller</span>
                <div className="group relative">
                  <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500 cursor-help" />
                  <div className="absolute left-0 top-6 w-48 bg-popover border border-border rounded-lg p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-foreground">Verified Seller</span>
                    </div>
                    <p className="text-xs text-muted-foreground">ID verified, 127 successful sales, 4.9 rating</p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.5</span>
                <span className="mx-1">•</span>
                <span>Online</span>
              </p>
            </div>
          </button>

          <div className="flex items-center gap-0.5">
            <div className="relative group">
              {callState === "idle" ? (
                // Initial state - simple call button
                <button 
                  onClick={() => handleCallStart("audio")}
                  className="px-3 py-2 flex items-center gap-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Phone className="w-4 h-4 text-foreground" />
                  <span className="text-sm text-foreground font-medium">Call</span>
                </button>
              ) : callState === "ringing" ? (
                // Ringing state with hang up button
                <div className="flex items-center gap-1">
                  <div className="px-3 py-2 bg-blue-500/10 rounded-full">
                    <span className="text-sm text-blue-500 font-medium">Ringing...</span>
                  </div>
                  <button
                    onClick={handleCallEnd}
                    className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <PhoneOff className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                // Active call state with duration and end button
                <div className="flex items-center gap-1">
                  <div className="px-3 py-2 bg-green-500/10 rounded-full">
                    <span className="text-sm text-green-500 font-medium">{formatDuration(callDuration)}</span>
                  </div>
                  <button
                    onClick={handleCallEnd}
                    className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <PhoneOff className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-foreground" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setShowSearch(true)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Search in chat</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMediaGallery(true)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
                    >
                      <ImageIcon2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Shared media</span>
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {allMedia.length}
                      </span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setNotificationsMuted(!notificationsMuted)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
                    >
                      {notificationsMuted ? (
                        <BellOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Bell className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-foreground">
                        {notificationsMuted ? "Unmute" : "Mute"} notifications
                      </span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setShowReportModal(true)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors text-red-600"
                    >
                      <Flag className="w-4 h-4" />
                      <span className="text-sm">Report seller</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Card - Flat version */}
        <div className="bg-card/50 border-b border-border">
          <button
            onClick={() => setShowProductPanel(true)}
            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-muted/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 relative overflow-hidden">
              <Package className="w-6 h-6 text-muted-foreground" />
              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-foreground font-semibold text-sm truncate">iPhone 15 Pro Max - 256GB</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-emerald-600 font-bold text-base">$899</p>
                <span className="text-xs text-muted-foreground line-through">$1,099</span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                  18% off
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  127 views
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-3 h-3" />
                  23 saves
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </button>
        </div>

        {/* Chat Content */}
        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-3 scroll-smooth">
          <div className="text-center text-muted-foreground text-xs mb-3 uppercase tracking-wide">Today</div>

          {/* Encryption Notice */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">End-to-end encrypted</p>
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Media Gallery Inline */}
          {showMediaGallery && (
            <div className="bg-card border border-border rounded-xl p-3 mb-3 animate-in fade-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-foreground">Shared Media</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {allMedia.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMediaGalleryView("grid")}
                    className={cn("p-1.5 rounded", mediaGalleryView === "grid" ? "bg-muted" : "hover:bg-muted")}
                  >
                    <LayoutGrid className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() => setMediaGalleryView("list")}
                    className={cn("p-1.5 rounded", mediaGalleryView === "list" ? "bg-muted" : "hover:bg-muted")}
                  >
                    <List className="w-4 h-4 text-foreground" />
                  </button>
                  <button onClick={() => setShowMediaGallery(false)} className="ml-1">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className={cn(mediaGalleryView === "grid" ? "grid grid-cols-3 gap-1.5" : "space-y-2")}>
                {allMedia.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setViewingImage(img)}
                    className={cn(
                      "overflow-hidden rounded-lg bg-muted",
                      mediaGalleryView === "grid" ? "aspect-square" : "flex items-center gap-3 p-2",
                    )}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt=""
                      className={cn(
                        "object-cover",
                        mediaGalleryView === "grid" ? "w-full h-full" : "w-12 h-12 rounded",
                      )}
                    />
                    {mediaGalleryView === "list" && (
                      <div className="flex-1 text-left">
                        <p className="text-sm text-foreground">Image {i + 1}</p>
                        <p className="text-xs text-muted-foreground">From seller</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {filteredMessages.map((msg) => {
            const isBuyer = msg.sender === "buyer"
            const replyMessage = msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : null

            return (
              <div
                key={msg.id}
                id={`message-${msg.id}`}
                className={cn(
                  "flex mb-2 transition-colors duration-500 rounded-lg",
                  isBuyer ? "justify-end" : "justify-start",
                )}
              >
                {!isBuyer && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
                    JS
                  </div>
                )}

                <div className={cn("max-w-[80%] relative group", isBuyer ? "items-end" : "items-start")}>
                  {/* Reply preview */}
                  {replyMessage && (
                    <button
                      onClick={() => scrollToMessage(replyMessage.id)}
                      className={cn(
                        "w-full mb-1 px-2 py-1 rounded-lg text-xs text-left truncate border-l-2",
                        isBuyer ? "bg-blue-400/20 border-blue-300" : "bg-muted border-muted-foreground",
                      )}
                    >
                      <span className="text-muted-foreground">
                        {replyMessage.sender === "buyer" ? "You" : "John"}:{" "}
                      </span>
                      {replyMessage.text}
                    </button>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 shadow-sm relative",
                      isBuyer
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm",
                      msg.isPinned && "ring-2 ring-amber-400",
                      msg.isDeleted && "opacity-60 italic",
                    )}
                  >
                    {msg.isPinned && <Pin className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />}

                    {/* Voice message */}
                    {msg.type === "voice" ? (
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <button
                          onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isBuyer ? "bg-white/20" : "bg-muted",
                          )}
                        >
                          {playingVoiceId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className={cn("w-0.5 rounded-full", isBuyer ? "bg-white/60" : "bg-muted-foreground/60")}
                                style={{ height: `${Math.random() * 16 + 4}px` }}
                              />
                            ))}
                          </div>
                        </div>
                        <span className={cn("text-xs", isBuyer ? "text-white/70" : "text-muted-foreground")}>
                          {formatDuration(msg.voiceDuration || 0)}
                        </span>
                      </div>
                    ) : msg.type === "offer" ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isBuyer ? "bg-white/20" : "bg-emerald-100",
                          )}
                        >
                          <DollarSign className={cn("w-4 h-4", isBuyer ? "text-white" : "text-emerald-600")} />
                        </div>
                        <div>
                          <p className={cn("text-xs", isBuyer ? "text-white/70" : "text-muted-foreground")}>
                            Price offer
                          </p>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {highlightText(msg.text, searchQuery)}
                        </p>
                        {msg.isEdited && (
                          <span className={cn("text-[10px] ml-1", isBuyer ? "text-white/60" : "text-muted-foreground")}>
                            (edited)
                          </span>
                        )}
                      </>
                    )}

                    {/* Images */}
                    {msg.hasImages && msg.images && (
                      <div className={cn("mt-2 grid gap-1", msg.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                        {msg.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setViewingImage(img)}
                            className="rounded-lg overflow-hidden bg-muted"
                          >
                            <img src={img || "/placeholder.svg"} alt="" className="w-full h-24 object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Time and status */}
                    <div className={cn("flex items-center gap-1 mt-1", isBuyer ? "justify-end" : "justify-start")}>
                      <span className={cn("text-[10px]", isBuyer ? "text-white/60" : "text-muted-foreground")}>
                        {msg.time}
                      </span>
                      {isBuyer && getStatusIcon(msg.status)}
                    </div>
                  </div>

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className={cn("flex gap-0.5 mt-0.5", isBuyer ? "justify-end" : "justify-start")}>
                      {msg.reactions.map((reaction, i) => (
                        <button
                          key={i}
                          onClick={() => addReaction(msg.id, reaction.emoji)}
                          className={cn(
                            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs",
                            reaction.users.includes("You")
                              ? "bg-blue-100 border border-blue-300"
                              : "bg-muted border border-border",
                          )}
                        >
                          <span>{reaction.emoji}</span>
                          {reaction.count > 1 && <span className="text-muted-foreground">{reaction.count}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message actions */}
                  <div
                    className={cn(
                      "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border border-border rounded-lg shadow-lg p-0.5",
                      isBuyer ? "left-0 -translate-x-full mr-1" : "right-0 translate-x-full ml-1",
                    )}
                  >
                    <button onClick={() => setShowEmojiPickerForMessage(msg.id)} className="p-1 hover:bg-muted rounded">
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => setReplyingTo(msg)} className="p-1 hover:bg-muted rounded">
                      <Reply className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setMessageActionsId(messageActionsId === msg.id ? null : msg.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Extended actions dropdown */}
                  {messageActionsId === msg.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMessageActionsId(null)} />
                      <div
                        className={cn(
                          "absolute top-8 z-50 w-40 bg-popover border border-border rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100",
                          isBuyer ? "right-0" : "left-8",
                        )}
                      >
                        <button
                          onClick={() => togglePin(msg.id)}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm"
                        >
                          {msg.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          {msg.isPinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          onClick={() => toggleStar(msg.id)}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm"
                        >
                          <Star className={cn("w-4 h-4", msg.isStarred && "fill-yellow-500 text-yellow-500")} />
                          {msg.isStarred ? "Unstar" : "Star"}
                        </button>
                        <button
                          onClick={() => copyMessage(msg.text)}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm">
                          <Forward className="w-4 h-4" />
                          Forward
                        </button>
                        {isBuyer && (
                          <>
                            <div className="h-px bg-border my-1" />
                            <button
                              onClick={() => {
                                setEditingMessage(msg)
                                setMessage(msg.text)
                                setMessageActionsId(null)
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-muted text-sm text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Emoji picker for reactions */}
                  {showEmojiPickerForMessage === msg.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPickerForMessage(null)} />
                      <div
                        className={cn(
                          "absolute top-8 z-50 bg-popover border border-border rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100",
                          isBuyer ? "right-0" : "left-8",
                        )}
                      >
                        <div className="flex gap-1">
                          {reactionEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg text-lg transition-transform hover:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
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

          {/* Special Cards */}
          {/* Warranty Card */}
          <div className="bg-card border border-border rounded-xl p-3 mb-2 max-w-[85%] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-foreground text-sm font-medium">Warranty Information</span>
                <p className="text-xs text-muted-foreground">Apple Limited Warranty</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Valid until</span>
              <span className="text-sm font-medium text-foreground">June 15, 2025</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600">6 months remaining - Transferable</span>
            </div>
          </div>

          {/* Counter Offer Card */}
          <div className="bg-card border-2 border-amber-400 rounded-xl p-3 mb-2 max-w-[90%] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-foreground text-sm font-semibold">Counter Offer</span>
              </div>
              <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                Pending
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-foreground font-bold text-2xl">$880</p>
              <span className="text-muted-foreground text-sm line-through">$899</span>
              <span className="text-xs text-emerald-600">Save $19</span>
            </div>
            <p className="text-muted-foreground text-xs mb-3">Includes all original accessories and premium case</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCompletionCelebration(true)}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => setShowOfferModal(true)}
                className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Counter
              </button>
              <button className="bg-secondary text-secondary-foreground px-3 rounded-lg hover:bg-secondary/80 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meeting Proposal Card */}
          <div className="bg-card border border-border rounded-xl p-3 mb-2 max-w-[90%] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-foreground text-sm font-semibold">Meeting Proposal</span>
            </div>
            {[
              {
                icon: MapPin,
                title: "Starbucks Downtown",
                desc: "123 Main St - Verified safe location",
                color: "text-blue-600",
              },
              { icon: Calendar, title: "Tomorrow, Dec 11", desc: "3:00 PM - 4:00 PM", color: "text-orange-600" },
              {
                icon: Truck,
                title: "In-person exchange",
                desc: "Inspect item before payment",
                color: "text-purple-600",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-start gap-2 mb-2">
                <Icon className={cn("w-4 h-4 mt-0.5", color)} />
                <div>
                  <p className="text-foreground text-sm font-medium">{title}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
              <p className="text-blue-700 text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Always meet in safe, public places during daylight
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Confirm
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
                JS
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                <div className="flex gap-1">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to Bottom */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-36 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-10"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}

        {/* Reply/Edit Preview */}
        {(replyingTo || editingMessage) && (
          <div className="px-3 py-2 bg-muted border-t border-border flex items-center gap-2">
            {replyingTo ? <Reply className="w-4 h-4 text-blue-500" /> : <Edit3 className="w-4 h-4 text-amber-500" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {replyingTo ? `Replying to ${replyingTo.sender === "buyer" ? "yourself" : "John"}` : "Editing message"}
              </p>
              <p className="text-sm text-foreground truncate">{replyingTo?.text || editingMessage?.text}</p>
            </div>
            <button
              onClick={() => {
                setReplyingTo(null)
                setEditingMessage(null)
                setMessage("")
              }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Quick Replies */}
        <div className="px-3 py-1.5 border-t border-border bg-card overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs text-foreground whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="px-3 py-2 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-2 duration-200">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map(({ icon: Icon, label, color, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Icon className={cn("w-5 h-5", color)} />
                  <span className="text-xs text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Recording */}
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
                  <div
                    key={i}
                    className="w-1 bg-red-400 rounded-full animate-pulse"
                    style={{ height: `${Math.random() * 20 + 4}px`, animationDelay: `${i * 0.05}s` }}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleSend} className="p-2 bg-red-500 rounded-full">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        {!isRecording && (
          <div className="px-2 py-2 flex items-center gap-1 shrink-0 bg-card border-t border-border">
            <button onClick={() => setShowQuickActions(!showQuickActions)} className="p-2 shrink-0">
              <Plus
                className={cn(
                  "w-6 h-6 transition-transform",
                  showQuickActions ? "rotate-45 text-muted-foreground" : "text-blue-600",
                )}
              />
            </button>
            <button className="p-2 shrink-0">
              <Camera className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-2 shrink-0">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-2 shrink-0" onMouseDown={() => setIsRecording(true)}>
              <Mic className="w-6 h-6 text-blue-600" />
            </button>
            <div className="flex-1 bg-muted rounded-full px-3 py-2 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="bg-transparent flex-1 outline-none text-foreground text-sm min-w-0 placeholder:text-muted-foreground"
              />
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="shrink-0 ml-1">
                <Smile className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>
            <button onClick={handleSend} className="p-2 shrink-0">
              {message || editingMessage ? (
                <Send className="w-6 h-6 text-blue-600 fill-blue-600" />
              ) : (
                <ThumbsUp className="w-6 h-6 text-blue-600" />
              )}
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
            <div className="absolute bottom-16 left-2 right-2 bg-popover border border-border rounded-xl shadow-xl p-3 z-50 animate-in slide-in-from-bottom duration-200 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {allEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setMessage((prev) => prev + emoji)
                      setShowEmojiPicker(false)
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-lg text-xl transition-transform hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MODALS */}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-2">
                {paymentMethods.map(({ id, name, desc, icon: Icon, initial, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPayment(id)}
                    className={cn(
                      "w-full bg-card border-2 rounded-xl p-3 transition-all text-left",
                      selectedPayment === id
                        ? "border-emerald-600 ring-2 ring-emerald-600/20"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              `bg-${color}-100`,
                            )}
                          >
                            <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white",
                              color === "blue" ? "bg-blue-600" : "bg-orange-600",
                            )}
                          >
                            {initial}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                      {selectedPayment === id && <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium mt-4 hover:bg-emerald-700 transition-colors"
              >
                Continue with {paymentMethods.find((p) => p.id === selectedPayment)?.name}
              </button>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        {showOfferModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Make an Offer</h3>
                <button onClick={() => setShowOfferModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1 block">Your offer</label>
                <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-2xl font-bold text-foreground"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[800, 850, 875].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setOfferAmount(amt.toString())}
                      className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm text-foreground"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1 block">Message (optional)</label>
                <textarea
                  placeholder="Add a note to your offer..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full bg-muted rounded-xl px-4 py-3 outline-none text-foreground resize-none h-20"
                />
              </div>
              <button
                onClick={sendOffer}
                disabled={!offerAmount}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Offer
              </button>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Schedule Meeting</h3>
                <button onClick={() => setShowScheduleModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Select date</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Today", "Tomorrow", "Dec 13"].map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedDate === date ? "bg-blue-600 text-white" : "bg-muted text-foreground hover:bg-muted/80",
                      )}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Select time</label>
                <div className="grid grid-cols-4 gap-2">
                  {["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2 rounded-lg text-xs font-medium transition-colors",
                        selectedTime === time ? "bg-blue-600 text-white" : "bg-muted text-foreground hover:bg-muted/80",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Safe meeting locations
                </label>
                <div className="space-y-2">
                  {safeLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-all flex items-start gap-3",
                        selectedLocation === loc.id
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-muted border-2 border-transparent hover:border-muted-foreground",
                      )}
                    >
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{loc.name}</span>
                          {loc.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{loc.address}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {loc.rating}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowScheduleModal(false)}
                disabled={!selectedDate || !selectedTime || !selectedLocation}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Propose Meeting
              </button>
            </div>
          </div>
        )}

        {/* Product Details Panel */}
        {showProductPanel && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Product Details</h3>
                <button onClick={() => setShowProductPanel(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl h-48 flex items-center justify-center mb-4 relative overflow-hidden">
                <Package className="w-16 h-16 text-muted-foreground" />
                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  98% Battery
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">iPhone 15 Pro Max - 256GB</h2>
              <p className="text-muted-foreground text-sm mb-3">Natural Titanium • Unlocked • Like New</p>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-emerald-600 font-bold text-2xl">$899</p>
                <span className="text-base text-muted-foreground line-through">$1,099</span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  Save $200
                </span>
              </div>

              {/* Price Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Price Analysis</span>
                </div>
                <p className="text-xs text-blue-600">18% below market average. Great deal!</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-blue-200 rounded-full">
                    <div className="w-[82%] h-full bg-emerald-500 rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">Better than 82% of listings</span>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Condition Checklist
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Screen", status: "Perfect", ok: true },
                    { label: "Battery", status: "98%", ok: true },
                    { label: "Camera", status: "Working", ok: true },
                    { label: "Face ID", status: "Working", ok: true },
                    { label: "Speakers", status: "Working", ok: true },
                    { label: "Body", status: "No scratches", ok: true },
                  ].map(({ label, status, ok }) => (
                    <div key={label} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className={cn("text-xs font-medium", ok ? "text-emerald-600" : "text-red-600")}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller */}
              <div className="bg-muted rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">John Seller</span>
                      <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>4.9 (127 reviews)</span>
                      <span>•</span>
                      <span>Joined 2022</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { value: "156", label: "Sales" },
                    { value: "98%", label: "Response" },
                    { value: "<1h", label: "Reply time" },
                  ].map(({ value, label }) => (
                    <div key={label} className="bg-card rounded-lg p-2">
                      <p className="text-lg font-bold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowProductPanel(false)
                    setShowPaymentModal(true)
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    setShowProductPanel(false)
                    setShowOfferModal(true)
                  }}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seller Profile */}
        {showSellerProfile && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Seller Profile</h3>
                <button onClick={() => setShowSellerProfile(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-2xl">JS</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xl font-bold text-foreground">John Seller</span>
                  <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500" />
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">4.9</span>
                  <span className="text-sm">(127 reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { value: "156", label: "Sales" },
                  { value: "98%", label: "Response" },
                  { value: "<1h", label: "Reply" },
                  { value: "2y", label: "Member" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-muted rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                {[
                  { icon: ShieldCheck, label: "ID Verified", color: "text-emerald-600" },
                  { icon: Phone, label: "Phone Verified", color: "text-emerald-600" },
                  { icon: MapPin, label: "Downtown Area", color: "text-blue-600" },
                  { icon: Clock, label: "Usually responds within 1 hour", color: "text-muted-foreground" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                    <Icon className={cn("w-4 h-4", color)} />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Listings
                </button>
                <button
                  onClick={() => {
                    setShowSellerProfile(false)
                    setShowReportModal(true)
                  }}
                  className="px-4 bg-secondary text-secondary-foreground py-2.5 rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Report Issue</h3>
                <button onClick={() => setShowReportModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                {["Suspicious behavior", "Spam or scam", "Offensive content", "Fake listing", "Other"].map((reason) => (
                  <button
                    key={reason}
                    className="w-full p-3 bg-muted hover:bg-muted/80 rounded-xl text-left text-foreground transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {showCompletionCelebration && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl p-6 mx-4 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Deal Accepted!</h2>
              <p className="text-muted-foreground mb-4">You and John have agreed on $880</p>
              <div className="bg-muted rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Next step</p>
                <p className="text-foreground font-medium">Schedule your meeting to complete the transaction</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCompletionCelebration(false)
                    setShowScheduleModal(true)
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Schedule Meeting
                </button>
                <button
                  onClick={() => setShowCompletionCelebration(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {viewingImage && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setViewingImage(null)}>
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-2">
                <button className="p-2 bg-white/10 rounded-full">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={viewingImage || "/placeholder.svg"}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Rating Prompt */}
        {showRatingPrompt && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl p-6 mx-4 max-w-sm animate-in zoom-in-95 duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JS</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">Rate your experience</h2>
                <p className="text-muted-foreground text-sm">How was your transaction with John?</p>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience (optional)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-muted rounded-xl px-4 py-3 outline-none text-foreground resize-none h-24 mb-4"
              />
              <button
                onClick={() => setShowRatingPrompt(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Insurance Modal */}
        {showInsuranceModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Purchase Protection</h3>
                <button onClick={() => setShowInsuranceModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-foreground">Buyer Protection</p>
                    <p className="text-sm text-muted-foreground">Coverage for $880 purchase</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    "Full refund if item not as described",
                    "Protection against fraud",
                    "24/7 support team",
                    "Dispute resolution",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl mb-4">
                <span className="text-foreground font-medium">Protection fee</span>
                <span className="text-xl font-bold text-foreground">$12.99</span>
              </div>
              <button
                onClick={() => setShowInsuranceModal(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Protection
              </button>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Transaction Receipt</h3>
                <button onClick={() => setShowReceiptModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="bg-muted rounded-xl p-4 mb-4">
                <div className="border-b border-border pb-3 mb-3">
                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-foreground">#TXN-2024-12112345</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item</span>
                    <span className="text-foreground">iPhone 15 Pro Max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-foreground">$880.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protection</span>
                    <span className="text-foreground">$12.99</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">$892.99</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}