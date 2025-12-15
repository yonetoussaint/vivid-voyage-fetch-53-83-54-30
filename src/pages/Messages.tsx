"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "../hooks/useAuth" // Assuming useAuth is a custom hook
import { supabase } from "../supabaseClient" // Assuming supabaseClient is the Supabase client
import type { ChatMessage, Order, RealtimeChannel } from "../types" // Assuming ChatMessage, Order, and RealtimeChannel are declared in types.ts

export function ChatInterface({
  conversationId,
  otherUser,
  onBack,
}: {
  conversationId: string
  otherUser: { id: string; full_name: string; email: string; avatar_url: string | null }
  onBack: () => void
}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
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
  const [walletBalance, setWalletBalance] = useState(1250.5)
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messagesChannelRef = useRef<RealtimeChannel | null>(null)
  const { user } = useAuth()

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error

      const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_id === user?.id ? "buyer" : "seller",
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date(msg.created_at),
        status: msg.is_read ? "read" : "delivered",
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
      }))

      setMessages(formattedMessages)
      console.log(`✅ Loaded ${formattedMessages.length} messages from database`)

      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupMessagesRealtimeSubscription = useCallback(() => {
    if (!conversationId || conversationId.startsWith("test-")) return

    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current)
      messagesChannelRef.current = null
    }

    console.log("Setting up messages real-time subscription for conversation:", conversationId)

    const channel = supabase
      .channel(`messages-${conversationId}-${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("New message received:", payload)
          const newMsg = payload.new as any

          const formattedMessage: ChatMessage = {
            id: newMsg.id,
            sender: newMsg.sender_id === user?.id ? "buyer" : "seller",
            text: newMsg.content,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: new Date(newMsg.created_at),
            status: newMsg.is_read ? "read" : "delivered",
            sender_id: newMsg.sender_id,
            content: newMsg.content,
            created_at: newMsg.created_at,
          }

          setMessages((prev) => [...prev, formattedMessage])
          setTimeout(scrollToBottom, 100)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("Message updated:", payload)
          const updatedMsg = payload.new as any

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMsg.id
                ? {
                    ...msg,
                    text: updatedMsg.content,
                    status: updatedMsg.is_read ? "read" : "delivered",
                    isEdited: true,
                  }
                : msg,
            ),
          )
        },
      )
      .subscribe((status) => {
        console.log("Messages subscription status:", status)
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to message updates")
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error subscribing to messages channel")
        }
      })

    messagesChannelRef.current = channel
  }, [conversationId, user?.id])

  useEffect(() => {
    if (conversationId && user?.id) {
      if (!conversationId.startsWith("test-")) {
        fetchMessages()
        setupMessagesRealtimeSubscription()
      } else {
        setMessages([
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
          },
        ])
      }
    }

    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current)
        messagesChannelRef.current = null
      }
    }
  }, [conversationId, user?.id, setupMessagesRealtimeSubscription])

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
        setMessages((prev) =>
          prev.map((m) => (m.id === editingMessage.id ? { ...m, text: message, isEdited: true } : m)),
        )
        setEditingMessage(null)
      } else {
        const tempId = `temp-${Date.now()}`
        const tempMessage = { ...newMessage, id: tempId }
        setMessages((prev) => [...prev, tempMessage])

        if (!conversationId.startsWith("test-")) {
          const { data, error } = await supabase
            .from("messages")
            .insert({
              conversation_id: conversationId,
              content: message,
              sender_id: user?.id,
              is_read: false,
            })
            .select()
            .single()

          if (error) throw error

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? {
                    ...m,
                    id: data.id,
                    created_at: data.created_at,
                  }
                : m,
            ),
          )

          console.log("✅ Message sent to database:", data.id)

          await supabase
            .from("conversations")
            .update({ last_message_at: new Date().toISOString() })
            .eq("id", conversationId)
        }
      }
      setMessage("")
      setReplyingTo(null)
      setIsRecording(false)
      setTimeout(scrollToBottom, 100)

      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === newMessage.id ? { ...m, status: "delivered" } : m)))
      }, 1000)
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === newMessage.id ? { ...m, status: "read" } : m)))
      }, 2500)
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => prev.filter((m) => !m.id.toString().startsWith("temp-")))
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }
}
