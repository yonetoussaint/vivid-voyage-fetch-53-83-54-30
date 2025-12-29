import React from 'react';

const CustomerReviewsSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Seller Summary Header Skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Rating stars skeleton */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
            {/* Average rating skeleton */}
            <div className="w-12 h-6 bg-gray-200 rounded"></div>
          </div>
          {/* Total reviews skeleton */}
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>

        {/* Rating distribution skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-24 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Reviews List Skeleton */}
      <div className="py-4 space-y-6">
        {[...Array(3)].map((_, reviewIndex) => (
          <div key={reviewIndex} className="border-b border-gray-200 pb-6 px-4">
            {/* Review Header Skeleton */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* User avatar skeleton */}
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  {/* User name skeleton */}
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    {/* Rating stars skeleton */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    {/* Date skeleton */}
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Verified purchase badge skeleton */}
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>

            {/* Review Comment Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>

            {/* Media Gallery Skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
              {[...Array(2)].map((_, mediaIndex) => (
                <div key={mediaIndex} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>

            {/* Engagement Section Skeleton */}
            <div className="flex items-center gap-6">
              {[...Array(3)].map((_, engagementIndex) => (
                <div key={engagementIndex} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-6 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Replies Section Skeleton */}
            <div className="mt-4 ml-6 space-y-4">
              {[...Array(2)].map((_, replyIndex) => (
                <div key={replyIndex} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-start gap-2">
                    {/* Reply user avatar skeleton */}
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      {/* Reply user info skeleton */}
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        <div className="w-12 h-3 bg-gray-200 rounded"></div>
                      </div>
                      {/* Reply comment skeleton */}
                      <div className="space-y-1">
                        <div className="w-full h-3 bg-gray-200 rounded"></div>
                        <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                      </div>
                      {/* Reply engagement skeleton */}
                      <div className="flex items-center gap-4">
                        {[...Array(3)].map((_, actionIndex) => (
                          <div key={actionIndex} className="flex items-center gap-1">
                            <div className="w-4 h-3 bg-gray-200 rounded"></div>
                            <div className="w-6 h-3 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button Skeleton */}
      <div className="p-4">
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default CustomerReviewsSkeleton;