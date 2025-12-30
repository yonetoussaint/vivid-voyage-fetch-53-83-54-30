import React, { useState, useRef } from "react";
import { Send, ImageIcon, Mic, X } from "lucide-react";

interface MessageTypingBarProps {
  onSubmit: (message: string) => void;
  onImageUpload?: () => void;
  onVoiceRecord?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const MessageTypingBar: React.FC<MessageTypingBarProps> = ({
  onSubmit,
  onImageUpload,
  onVoiceRecord,
  placeholder = "Type your message...",
  maxLength = 500,
  className = "",
}) => {
  const [messageText, setMessageText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (messageText.trim()) {
      onSubmit(messageText.trim());
      setMessageText("");
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setMessageText(e.target.value);
    }
  };

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (newExpandedState && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-transparent z-40 ${className}`}>
      <div className="container mx-auto max-w-6xl px-2 md:px-4">
        {/* Minimized State */}
        {!isExpanded ? (
          <div className="py-3">
            <button
              onClick={toggleExpand}
              className="w-full px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
              style={{ borderRadius: '0' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-normal">Write a message</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageUpload?.();
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '0' }}
                    aria-label="Upload image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVoiceRecord?.();
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '0' }}
                    aria-label="Record voice message"
                  >
                    <Mic size={18} />
                  </button>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Expanded State */
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">New Message</h3>
              <button
                onClick={toggleExpand}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ borderRadius: '0' }}
                aria-label="Close message form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={handleTextChange}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 pr-32 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ minHeight: "100px", borderRadius: '0' }}
                  rows={3}
                  aria-label="Message text"
                  maxLength={maxLength}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onImageUpload}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '0' }}
                    aria-label="Upload image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onVoiceRecord}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '0' }}
                    aria-label="Record voice message"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!messageText.trim()}
                    className={`p-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      messageText.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed focus:ring-gray-300"
                    }`}
                    style={{ borderRadius: '0' }}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 flex justify-end">
              <span
                className={
                  messageText.length >= maxLength ? "text-red-500 font-medium" : ""
                }
              >
                {messageText.length}/{maxLength}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTypingBar;