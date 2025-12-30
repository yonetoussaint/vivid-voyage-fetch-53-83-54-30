import React, { useState } from "react";
import { Send, Image as ImageIcon, Mic } from "lucide-react";

interface MessageTypingBarProps {
  onSubmit: (message: string) => void;
  onImageUpload?: () => void;
  onVoiceRecord?: () => void;
  placeholder?: string;
}

const MessageTypingBar: React.FC<MessageTypingBarProps> = ({
  onSubmit,
  onImageUpload,
  onVoiceRecord,
  placeholder = "Type a message",
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-end">
      <div className="w-full bg-white border-t border-gray-200 p-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Image button */}
          <button 
            onClick={onImageUpload}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Image"
          >
            <ImageIcon className="w-5 h-5 text-blue-500" />
          </button>

          {/* Message input with send button */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 pr-10 text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-gray-300 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send"
            >
              <Send className="w-4 h-4 text-blue-500 fill-blue-500" />
            </button>
          </div>

          {/* Microphone button */}
          <button 
            onClick={onVoiceRecord}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Microphone"
          >
            <Mic className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageTypingBar;