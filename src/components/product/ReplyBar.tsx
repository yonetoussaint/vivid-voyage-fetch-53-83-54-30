import React from 'react';
import { Send } from 'lucide-react';
import VerificationBadge from '@/components/shared/VerificationBadge';

interface ReplyBarProps {
  replyingTo: {
    userName?: string;
    isSeller?: boolean;
    verifiedSeller?: boolean;
  } | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

const ReplyBar = ({
  replyingTo,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply
}: ReplyBarProps) => {
  if (!replyingTo) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg z-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Replying to</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                {replyingTo.userName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium">{replyingTo.userName || 'User'}</span>
              {replyingTo.isSeller && (
                <div className="flex items-center gap-1">
                  {replyingTo.verifiedSeller && <VerificationBadge size="sm" />}
                  <span className="text-xs text-gray-500">•</span>
                  <span className="font-bold text-sm text-orange-500">Seller</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Type your reply here..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && onSubmitReply()}
          />
          <button
            onClick={onSubmitReply}
            disabled={!replyText.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyBar;