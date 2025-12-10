import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, createdAt, isCurrentUser }) => {
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const bubbleClasses = isCurrentUser
    ? 'bg-black text-white rounded-tr-xl rounded-tl-xl rounded-bl-xl'
    : 'bg-gray-100 text-gray-900 rounded-tl-xl rounded-tr-xl rounded-br-xl';

  const timeClasses = isCurrentUser
    ? 'text-gray-300'
    : 'text-gray-500';

  return (
    <div
      className={`max-w-[75%] px-4 py-3 shadow-md ${bubbleClasses}`}
    >
      <p className="text-sm whitespace-pre-wrap break-words">
        {content}
      </p>
      <p
        className={`text-xs mt-1 text-right ${timeClasses}`}
      >
        {formatMessageTime(createdAt)}
      </p>
    </div>
  );
};

export default MessageBubble;
