import React, { useState, useRef } from "react";
import { Send, Star, MessageSquare, X } from "lucide-react";

interface ReviewTypingBarProps {
  productName: string;
  onSubmit: (review: string, rating: number) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const ReviewTypingBar: React.FC<ReviewTypingBarProps> = ({
  productName,
  onSubmit,
  placeholder = "Share your honest experience with this product. What did you like or dislike?",
  maxLength = 500,
  className = "",
}) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (reviewText.trim() && rating > 0) {
      onSubmit(reviewText, rating);
      setReviewText("");
      setRating(0);
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
      setReviewText(e.target.value);
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
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 ${className}`}>
      <div className="container mx-auto max-w-6xl px-2 md:px-4">
        {/* Minimized State */}
        {!isExpanded ? (
          <div className="py-3">
            <button
              onClick={toggleExpand}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <MessageSquare size={20} className="text-blue-600" />
              <span className="text-blue-700 font-medium">Write a review</span>
            </button>
          </div>
        ) : (
          /* Expanded State */
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-800">Write Your Review</h3>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                    >
                      <Star
                        size={18}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close review form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Reviewing:</div>
              <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg">
                {productName}
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={reviewText}
                  onChange={handleTextChange}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  style={{ minHeight: "100px" }}
                  aria-label="Review text"
                  maxLength={maxLength}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!reviewText.trim() || rating === 0}
                  className={`absolute right-3 bottom-3 p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    reviewText.trim() && rating > 0
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg focus:ring-blue-500"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed focus:ring-gray-300"
                  }`}
                  aria-label="Submit review"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>Your review helps other shoppers</span>
              <span
                className={
                  reviewText.length >= maxLength ? "text-red-500 font-medium" : ""
                }
              >
                {reviewText.length}/{maxLength}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTypingBar;