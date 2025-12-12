"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Phone, Camera, ImageIcon, Mic, ThumbsUp, Plus, Send,
  DollarSign, Package, Star, X, MoreVertical, ArrowLeft,
  Copy, Forward, Trash2, Edit3, Clock, Check, CheckCheck,
  ImageIcon as ImageIcon2, Play, Pause, Share2, Flag,
  Bell, BellOff, BadgeCheck, Download, LayoutGrid, List,
  Receipt, PhoneOff, Wallet, Lock, Truck, Shield,
} from "lucide-react"

// Types
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

// Main Component
export default function BuyerSellerChat() {
  // State management
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

  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showMediaGallery, setShowMediaGallery] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [messageActionsId, setMessageActionsId] = useState<number | null>(null)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCall, setActiveCall] = useState<null | "audio" | "video">(null)
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [sellerOnline, setSellerOnline] = useState(true)
  const [walletBalance, setWalletBalance] = useState(1250.50)
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: `ORD-${Date.now()}`,
    amount: 880,
    deliveryFee: 15,
    total: 895,
    status: "offer",
    timestamp: new Date(),
  })
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [mediaGalleryView, setMediaGalleryView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

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

  // Calculate current step for progress bar
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

  // Filter steps to show
  const visibleSteps = stepConfigs.filter(config => config.show(currentOrder))
  const hasProgressSteps = visibleSteps.filter(step => step.isBuyer).length > 0

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

  useEffect(() => {
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
      setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, text: message, isEdited: true } : m))
      setEditingMessage(null)
    } else {
      setMessages(prev => [...prev, newMessage])
    }

    setMessage("")
    setReplyingTo(null)
    setIsRecording(false)
    setTimeout(scrollToBottom, 100)

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "delivered" } : m))
    }, 1000)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m))
    }, 2500)
  }

  const deleteMessage = (messageId: number) => {
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
  }

  // Order action handlers
  const handleOrderAction = (action: string) => {
    switch (action) {
      case "acceptOffer":
        setCurrentOrder(prev => ({ 
          ...prev, 
          status: "accepted",
          timestamp: new Date()
        }))
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
        setCurrentOrder(prev => ({ ...prev, status: "payment_pending" }))
        setShowPinModal(true)
        break
        
      case "completeDelivery":
        setShowPinModal(true)
        break
        
      case "cancelOrder":
        setCurrentOrder(prev => ({ ...prev, status: "refunded" }))
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
          seller: "John Seller",
          buyer: "You",
        }
        
        setCurrentOrder(prev => ({ ...prev, status: "completed", receipt }))
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
        setCurrentOrder(prev => ({ ...prev, status: "delivery_pending" }))
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
    { icon: ImageIcon, label: "Photos", action: () => setShowMediaGallery(true) },
    { icon: Receipt, label: "Receipt", action: () => currentOrder?.receipt && setShowReceipt(true) },
  ]

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative transition-colors duration-300">
      <div className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
        {/* Header */}
        <div className="px-2 py-2 flex items-center gap-2 shrink-0 bg-card border-b border-border shadow-sm">
          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
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
                  <button onClick={handleCallEnd} className="p-2 hover:bg-red-500/10 rounded-full transition-colors">
                    <PhoneOff className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="px-3 py-2 bg-green-500/10 rounded-full">
                    <span className="text-sm text-green-500 font-medium">{formatDuration(callDuration)}</span>
                  </div>
                  <button onClick={handleCallEnd} className="p-2 hover:bg-red-500/10 rounded-full transition-colors">
                    <PhoneOff className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-foreground" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => setShowMenu(false)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Search in chat</span>
                    </button>
                    <button onClick={() => { setShowMediaGallery(true); setShowMenu(false); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors">
                      <ImageIcon2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Shared media</span>
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {allMedia.length}
                      </span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button onClick={() => { setNotificationsMuted(!notificationsMuted); setShowMenu(false); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors">
                      {notificationsMuted ? <BellOff className="w-4 h-4 text-muted-foreground" /> : <Bell className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm text-foreground">{notificationsMuted ? "Unmute" : "Mute"} notifications</span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button onClick={() => { setShowReportModal(true); setShowMenu(false); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors text-red-600">
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

          {/* Media Gallery */}
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
                  <button onClick={() => setMediaGalleryView("grid")} className={cn("p-1.5 rounded", mediaGalleryView === "grid" ? "bg-muted" : "hover:bg-muted")}>
                    <LayoutGrid className="w-4 h-4 text-foreground" />
                  </button>
                  <button onClick={() => setMediaGalleryView("list")} className={cn("p-1.5 rounded", mediaGalleryView === "list" ? "bg-muted" : "hover:bg-muted")}>
                    <List className="w-4 h-4 text-foreground" />
                  </button>
                  <button onClick={() => setShowMediaGallery(false)} className="ml-1">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className={cn(mediaGalleryView === "grid" ? "grid grid-cols-3 gap-1.5" : "space-y-2")}>
                {allMedia.map((img: string, i: number) => (
                  <button key={i} onClick={() => setViewingImage(img)} className={cn("overflow-hidden rounded-lg bg-muted", mediaGalleryView === "grid" ? "aspect-square" : "flex items-center gap-3 p-2")}>
                    <img src={img || "/placeholder.svg"} alt="" className={cn("object-cover", mediaGalleryView === "grid" ? "w-full h-full" : "w-12 h-12 rounded")} />
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
            const replyMessage = msg.replyTo ? messages.find((m: Message) => m.id === msg.replyTo) : null

            return (
              <div key={msg.id} id={`message-${msg.id}`} className={cn("flex mb-2 transition-colors duration-500 rounded-lg", isBuyer ? "justify-end" : "justify-start")}>
                {!isBuyer && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white mr-1.5 mt-auto">
                    JS
                  </div>
                )}

                <div className={cn("max-w-[80%] relative group", isBuyer ? "items-end" : "items-start")}>
                  {replyMessage && (
                    <button onClick={() => scrollToMessage(replyMessage.id)} className={cn("w-full mb-1 px-2 py-1 rounded-lg text-xs text-left truncate border-l-2", isBuyer ? "bg-blue-400/20 border-blue-300" : "bg-muted border-muted-foreground")}>
                      <span className="text-muted-foreground">{replyMessage.sender === "buyer" ? "You" : "John"}: </span>
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
                        <p className="text-sm whitespace-pre-wrap break-words">{highlightText(msg.text, searchQuery)}</p>
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
                JS
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
        </div>

        {/* UI Components */}
        {showScrollToBottom && (
          <button onClick={scrollToBottom} className="absolute bottom-32 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-10">
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
        
        {(replyingTo || editingMessage) && (
          <div className="px-3 py-2 bg-muted border-t border-border flex items-center gap-2">
            {replyingTo ? <MoreVertical className="w-4 h-4 text-blue-500" /> : <Edit3 className="w-4 h-4 text-amber-500" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {replyingTo ? `Replying to ${replyingTo.sender === "buyer" ? "yourself" : "John"}` : "Editing message"}
              </p>
              <p className="text-sm text-foreground truncate">{replyingTo?.text || editingMessage?.text}</p>
            </div>
            <button onClick={() => { setReplyingTo(null); setEditingMessage(null); setMessage(""); }}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

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
          <button onClick={() => setShowWalletBalance(true)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Wallet className="w-3 h-3" />${walletBalance.toFixed(0)}
          </button>
        </div>

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

        {/* Input Bar */}
        {!isRecording && (
          <div className="px-2 py-2 flex items-center gap-1 shrink-0 bg-card border-t border-border">
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

        {/* Modals */}
        {showWalletBalance && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
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

        {showPinModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl p-6 mx-4 max-w-sm animate-in zoom-in-95 duration-300">
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
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
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

        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full rounded-t-3xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Report Issue</h3>
                <button onClick={() => setShowReportModal(false)}><X className="w-6 h-6 text-muted-foreground" /></button>
              </div>
              <div className="space-y-2 mb-4">
                {["Suspicious behavior", "Spam or scam", "Offensive content", "Fake listing", "Other"].map((reason) => (
                  <button key={reason} className="w-full p-3 bg-muted hover:bg-muted/80 rounded-xl text-left text-foreground transition-colors">{reason}</button>
                ))}
              </div>
              <button onClick={() => setShowReportModal(false)} className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">Submit Report</button>
            </div>
          </div>
        )}

        {viewingImage && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-200">
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