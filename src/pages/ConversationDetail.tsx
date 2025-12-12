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
  Send,
  DollarSign,
  Package,
  Star,
  X,
  MoreVertical,
  ArrowLeft,
  Copy,
  Forward,
  Trash2,
  Edit3,
  Clock,
  Check,
  CheckCheck,
  Eye,
  ImageIcon as ImageIcon2,
  Play,
  Pause,
  Heart,
  Share2,
  Flag,
  Bell,
  BellOff,
  BadgeCheck,
  Download,
  LayoutGrid,
  List,
  Receipt,
  PhoneOff,
  Wallet,
  Lock,
} from "lucide-react"

type Message = {
  id: number
  sender: "buyer" | "seller"
  text: string
  time: string
  timestamp: Date
  hasImages?: boolean
  images?: string[]
  status?: "sent" | "delivered" | "read"
  replyTo?: number
  isEdited?: boolean
  voiceDuration?: number
  isDeleted?: boolean
}

type Order = {
  id: string
  amount: number
  status: "pending" | "accepted" | "payment_pending" | "completed"
  timestamp: Date
  receipt?: ReceiptData
}

type ReceiptData = {
  id: string
  amount: number
  date: string
  time: string
  product: string
  seller: string
  buyer: string
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
    },
    {
      id: 7,
      sender: "buyer",
      text: "Would you consider $850?",
      time: "10:38 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.4),
      status: "read",
    },
    {
      id: 8,
      sender: "seller",
      text: "I can do $880 - that's my best price. Includes all original accessories and I'll throw in a premium case.",
      time: "10:39 AM",
      timestamp: new Date(Date.now() - 3600000 * 1.3),
      status: "read",
    },
    {
      id: 9,
      sender: "buyer",
      text: "Deal!",
      time: "10:40 AM",
      timestamp: new Date(Date.now() - 3600000),
      status: "delivered",
    },
  ])

  // UI state
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResultIndex, setSearchResultIndex] = useState(0)
  const [showMediaGallery, setShowMediaGallery] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showSellerProfile, setShowSellerProfile] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
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

  // Typing indicator
  const [isTyping, setIsTyping] = useState(true)
  const [sellerOnline, setSellerOnline] = useState(true)

  // Wallet & Payment state
  const [walletBalance, setWalletBalance] = useState(1250.50)
  const [pin, setPin] = useState(["", "", "", ""])
  
  // Order state
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  // Notifications
  const [notificationsMuted, setNotificationsMuted] = useState(false)

  // Image viewer
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [mediaGalleryView, setMediaGalleryView] = useState<"grid" | "list">("grid")

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Derived data
  const allMedia = messages.filter((m) => m.hasImages).flatMap((m) => m.images || [])
  const searchResults = searchQuery
    ? messages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : []
  const filteredMessages = searchQuery ? searchResults : messages

  // Quick actions
  const quickActions = [
    { icon: DollarSign, label: "Wallet", color: "text-blue-600", action: () => setShowWalletBalance(true) },
    { icon: ImageIcon, label: "Photos", color: "text-purple-600" },
    { icon: Receipt, label: "Receipt", color: "text-slate-600", action: () => currentOrder?.receipt && setShowReceipt(true) },
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

  // Order handlers
  const acceptOffer = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      amount: 880,
      status: "accepted",
      timestamp: new Date(),
    }
    setCurrentOrder(newOrder)
    
    // Add acceptance message
    const acceptanceMessage: Message = {
      id: messages.length + 1,
      sender: "buyer",
      text: "I accept your offer of $880. Let's proceed with payment.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
    }
    setMessages(prev => [...prev, acceptanceMessage])
    setTimeout(scrollToBottom, 100)
  }

  const initiatePayment = () => {
    if (!currentOrder) return
    
    setCurrentOrder(prev => prev ? { ...prev, status: "payment_pending" } : null)
    setShowPinModal(true)
  }

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
    
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      pinInputRefs.current[index + 1]?.focus()
    }

    // If all digits entered, process payment
    if (newPin.every(digit => digit !== "") && index === 3) {
      processPayment()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
  }

  const processPayment = () => {
    if (!currentOrder) return
    
    const amount = currentOrder.amount
    if (amount > walletBalance) {
      alert("Insufficient funds")
      setPin(["", "", "", ""])
      setShowPinModal(false)
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      setWalletBalance(prev => prev - amount)
      
      // Complete order
      const receipt: ReceiptData = {
        id: `RCPT-${Date.now()}`,
        amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        product: "iPhone 15 Pro Max",
        seller: "John Seller",
        buyer: "You",
      }
      
      setCurrentOrder(prev => prev ? { 
        ...prev, 
        status: "completed",
        receipt 
      } : null)
      
      setShowPinModal(false)
      
      // Add payment message
      const paymentMessage: Message = {
        id: messages.length + 1,
        sender: "buyer",
        text: `Payment of $${amount} completed via wallet. Order #${currentOrder.id}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date(),
        status: "sent",
      }
      setMessages(prev => [...prev, paymentMessage])
      setTimeout(scrollToBottom, 100)
    }, 1000)
  }

  const cancelOrder = () => {
    setCurrentOrder(null)
    
    // Add cancellation message
    const cancellationMessage: Message = {
      id: messages.length + 1,
      sender: "buyer",
      text: "I've decided to cancel the order.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      status: "sent",
    }
    setMessages(prev => [...prev, cancellationMessage])
    setTimeout(scrollToBottom, 100)
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
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
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
                <button 
                  onClick={() => handleCallStart("audio")}
                  className="px-3 py-2 flex items-center gap-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Phone className="w-4 h-4 text-foreground" />
                  <span className="text-sm text-foreground font-medium">Call</span>
                </button>
              ) : callState === "ringing" ? (
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
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
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

        {/* Chat Content */}
        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-3 scroll-smooth">
          <div className="text-center text-muted-foreground text-xs mb-3 uppercase tracking-wide">Today</div>

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
                      msg.isDeleted && "opacity-60 italic",
                    )}
                  >
                    {/* Voice message */}
                    {msg.voiceDuration ? (
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

                  {/* Message actions */}
                  <div
                    className={cn(
                      "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border border-border rounded-lg shadow-lg p-0.5",
                      isBuyer ? "left-0 -translate-x-full mr-1" : "right-0 translate-x-full ml-1",
                    )}
                  >
                    <button onClick={() => setReplyingTo(msg)} className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                </div>

                {isBuyer && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 text-[10px] font-bold text-white ml-1.5 mt-auto">
                    ME
                  </div>
                )}
              </div>
            )
          })}

          {/* Seller's Offer Card */}
          {!currentOrder && (
            <div className="flex justify-start mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
                JS
              </div>
              <div className="max-w-[80%]">
                <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span className="text-foreground text-sm font-semibold">Seller's Offer</span>
                    </div>
                    <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                      $880
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">Includes all original accessories and premium case</p>
                  <div className="flex gap-2">
                    <button
                      onClick={acceptOffer}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                      Counter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Status Cards */}
          {currentOrder && currentOrder.status === "accepted" && (
            <div className="flex justify-end mb-2">
              <div className="max-w-[80%]">
                <div className="bg-blue-500 text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-white" />
                      <span className="text-sm font-semibold">Order Accepted</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                      ${currentOrder.amount}
                    </span>
                  </div>
                  <p className="text-white/80 text-xs mb-3">Ready to proceed with secure payment</p>
                  <div className="flex gap-2">
                    <button
                      onClick={initiatePayment}
                      className="flex-1 bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-1"
                    >
                      <Lock className="w-4 h-4" />
                      Pay Now
                    </button>
                    <button
                      onClick={cancelOrder}
                      className="px-4 bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentOrder && currentOrder.status === "payment_pending" && (
            <div className="flex justify-end mb-2">
              <div className="max-w-[80%]">
                <div className="bg-amber-500 text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-white" />
                      <span className="text-sm font-semibold">Payment Pending</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                      ${currentOrder.amount}
                    </span>
                  </div>
                  <p className="text-white/80 text-xs mb-3">Awaiting PIN confirmation to complete payment</p>
                </div>
              </div>
            </div>
          )}

          {currentOrder && currentOrder.status === "completed" && currentOrder.receipt && (
            <div className="flex justify-end mb-2">
              <div className="max-w-[80%]">
                <div className="bg-emerald-500 text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-white" />
                      <span className="text-sm font-semibold">Order Completed</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                      ${currentOrder.amount}
                    </span>
                  </div>
                  <p className="text-white/80 text-xs mb-3">Payment successful. Receipt available.</p>
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="w-full bg-white text-emerald-600 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-1"
                  >
                    <Receipt className="w-4 h-4" />
                    View Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

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
            className="absolute bottom-32 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-10"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        )}

        {/* Reply/Edit Preview */}
        {(replyingTo || editingMessage) && (
          <div className="px-3 py-2 bg-muted border-t border-border flex items-center gap-2">
            {replyingTo ? <MoreVertical className="w-4 h-4 text-blue-500" /> : <Edit3 className="w-4 h-4 text-amber-500" />}
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

        {/* Product Card - Minimal version at bottom */}
        <div className="px-3 py-2 border-t border-border bg-card flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium text-sm truncate">iPhone 15 Pro Max</p>
            <div className="flex items-center gap-2">
              <p className="text-emerald-600 font-bold text-sm">$899</p>
              <span className="text-xs text-muted-foreground line-through">$1,099</span>
            </div>
          </div>
          <button 
            onClick={() => setShowWalletBalance(true)}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Wallet className="w-3 h-3" />
            ${walletBalance.toFixed(0)}
          </button>
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

        {/* MODALS */}

        {/* Wallet Balance Modal */}
        {showWalletBalance && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Wallet Balance</h3>
                <button onClick={() => setShowWalletBalance(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
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
              <button
                onClick={() => setShowWalletBalance(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* PIN Entry Modal */}
        {showPinModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl p-6 mx-4 max-w-sm animate-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-1">Confirm Payment</h2>
                <p className="text-muted-foreground text-sm">Enter your 4-digit PIN to pay ${currentOrder?.amount}</p>
              </div>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => { pinInputRefs.current[index] = el }}
                    type="password"
                    maxLength={1}
                    value={pin[index]}
                    onChange={(e) => handlePinInput(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold bg-muted border-2 border-border rounded-xl outline-none focus:border-blue-500 transition-colors"
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPin(["", "", "", ""])
                    setShowPinModal(false)
                  }}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && currentOrder?.receipt && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Transaction Receipt</h3>
                <button onClick={() => setShowReceipt(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Receipt className="w-8 h-8 text-white" />
                  <span className="text-white/80 text-sm">Payment Confirmed</span>
                </div>
                <p className="text-3xl font-bold text-white">${currentOrder.receipt.amount}</p>
                <p className="text-white/70 text-sm mt-1">{currentOrder.receipt.date} • {currentOrder.receipt.time}</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receipt ID</span>
                  <span className="text-sm font-medium text-foreground">{currentOrder.receipt.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product</span>
                  <span className="text-sm text-foreground">{currentOrder.receipt.product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Seller</span>
                  <span className="text-sm text-foreground">{currentOrder.receipt.seller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Buyer</span>
                  <span className="text-sm text-foreground">{currentOrder.receipt.buyer}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-foreground">${currentOrder.receipt.amount}</span>
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
                  { icon: BadgeCheck, label: "ID Verified", color: "text-emerald-600" },
                  { icon: Phone, label: "Phone Verified", color: "text-emerald-600" },
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
      </div>
    </div>
  )
}