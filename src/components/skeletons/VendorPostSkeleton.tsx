
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorPostSkeletonProps {
  productCount?: number;
}

const VendorPostSkeleton: React.FC<VendorPostSkeletonProps> = ({ productCount = 1 }) => {
  return (
    <div className="w-full bg-white mb-4">
      {/* Section Header Skeleton */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Post Description Skeleton */}
      <div className="px-3 py-2">
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Products Display Skeleton - Varies by count */}
      <div className="relative w-full px-3 py-2">
        {/* Single Product - Full Width */}
        {productCount === 1 && (
          <div className="w-full rounded-lg overflow-hidden">
            <Skeleton className="w-full aspect-square" />
          </div>
        )}

        {/* Two Products - Justified */}
        {productCount === 2 && (
          <div className="flex justify-between gap-2">
            <Skeleton className="flex-1 aspect-square rounded-lg" />
            <Skeleton className="flex-1 aspect-square rounded-lg" />
          </div>
        )}

        {/* Three Products - Horizontal Line */}
        {productCount === 3 && (
          <div className="flex gap-2">
            <Skeleton className="flex-1 aspect-square rounded-lg" />
            <Skeleton className="flex-1 aspect-square rounded-lg" />
            <Skeleton className="flex-1 aspect-square rounded-lg" />
          </div>
        )}

        {/* Four Products - 2x2 Grid */}
        {productCount === 4 && (
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        )}

        {/* Five or More Products - 2x2 Grid with Counter */}
        {productCount >= 5 && (
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <div className="relative">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                <Skeleton className="w-12 h-8 bg-white/30" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Engagement Stats Skeleton */}
      <div className="px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex items-center -space-x-1">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
          <Skeleton className="h-3 w-8 ml-1" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Social Buttons Skeleton */}
      <div className="flex items-center justify-between px-2 py-1 gap-3">
        <Skeleton className="flex-1 h-8 rounded-full" />
        <Skeleton className="flex-1 h-8 rounded-full" />
        <Skeleton className="flex-1 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default VendorPostSkeleton;
