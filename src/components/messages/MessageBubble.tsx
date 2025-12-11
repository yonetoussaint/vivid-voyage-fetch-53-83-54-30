// src/components/messages/MessageBubble.tsx
import React from 'react';
import { CheckCircle, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Message = {
  id: string;
  content?: string | null;
  images?: string[] | null;
  sender_id: string;
  created_at: string | Date;
  status?: 'sent' | 'delivered' | 'read';
};

export default function MessageBubble({
  message,
  isCurrentUser,
}: {
  message: Message;
  isCurrentUser: boolean;
}) {
  const time = formatDistanceToNow(new Date(message.created_at), { addSuffix: false });

  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? 'justify-end' : ''} w-full`}>
      {/* Avatar for other user */}
      {!isCurrentUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">
          { /* You can pass initials as prop if needed */ }JS
        </div>
      )}

      <div className={`max-w-[78%]`}>
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm break-words ${
            isCurrentUser
              ? 'bg-blue-600 rounded-tr-sm text-white'
              : 'bg-white border border-gray-200 rounded-tl-sm text-gray-900'
          }`}
        >
          {/* Text content */}
          {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

          {/* Images grid */}
          {message.images && message.images.length > 0 && (
            <div
              className={`grid gap-2 mt-2 ${
                message.images.length === 1 ? 'grid-cols-1' : message.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'
              }`}
            >
              {message.images.map((src, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden bg-gray-100">
                  {/* If you use next/image replace with that */}
                  <img src={src} alt={`attachment-${idx}`} className="w-full h-40 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* meta row */}
        <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end pr-2' : 'ml-2'}`}>
          <span className="text-xs text-gray-400">{time}</span>
          {isCurrentUser && (
            <span className="flex items-center">
              <CheckCircle className={`w-3 h-3 ${message.status === 'read' ? 'text-green-500' : 'text-blue-400'}`} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}