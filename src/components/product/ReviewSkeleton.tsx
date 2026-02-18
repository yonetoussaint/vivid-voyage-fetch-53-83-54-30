import React from 'react';

const ReviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white py-4 animate-pulse">
      {/* Header */}
      <div className="flex gap-2 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2 mb-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* Media */}
      <div className="flex gap-2 mb-3">
        <div className="w-32 h-32 bg-gray-200 rounded" />
        <div className="w-32 h-32 bg-gray-200 rounded" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="h-5 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ReviewSkeleton;