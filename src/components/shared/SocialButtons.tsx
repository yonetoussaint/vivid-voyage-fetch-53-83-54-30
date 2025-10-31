import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import ReactionButton from './ReactionButton';

interface SocialButtonsProps {
  onReactionChange: (reactionId: string | null) => void;
  onComment: () => void;
  onShare: () => void;
  buttonClassName?: string;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onReactionChange,
  onComment,
  onShare,
  buttonClassName = "w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-1 relative gap-3">
     <div className="flex-1">
  <ReactionButton
    onReactionChange={onReactionChange}
    buttonClassName={`w-full py-2 rounded-full h-8 ${buttonClassName.includes('bg-gray-100') ? '' : 'bg-gray-100 hover:bg-gray-200'}`}
    size="md"
  />
</div>

      <div className="flex-1">
        <button
          onClick={onComment}
          className="flex items-center justify-center gap-2 group transition-colors w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
        >
          <MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs text-gray-600 group-hover:text-gray-800">
            Comment
          </span>
        </button>
      </div>

      <div className="flex-1">
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 group transition-colors w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
        >
          <Send className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs text-gray-600 group-hover:text-gray-800">
            Share
          </span>
        </button>
      </div>
    </div>
  );
};