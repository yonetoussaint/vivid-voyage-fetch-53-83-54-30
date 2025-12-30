import React, { useState, useRef } from "react";
import { Send, MessageSquare, X } from "lucide-react";

interface MessageTypingBarProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const MessageTypingBar: React.FC<MessageTypingBarProps> = ({
  onSubmit,
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
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ borderRadius: '0' }}
            >
              <MessageSquare size={20} className="text-blue-600" />
              <span className="text-blue-700 font-medium">Type a message</span>
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
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ minHeight: "100px", borderRadius: '0' }}
                  rows={3}
                  aria-label="Message text"
                  maxLength={maxLength}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!messageText.trim()}
                  className={`absolute right-3 bottom-3 p-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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