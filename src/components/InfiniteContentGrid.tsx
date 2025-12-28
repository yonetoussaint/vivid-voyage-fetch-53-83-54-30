import React, { useRef, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// Import the custom hook
import { useContentGrid, FilterState, ContentItem } from "@/hooks/useContentGrid";

// Import only ProductCard (remove ReelCard import)
import { ProductCard } from "./ProductCard";

// Helper function to render tag elements
const renderTag = (tag: string) => {
  if (tag === "Sale" || tag === "sale") {
    return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>;
  }
  if (tag === "SuperDeals" || tag === "flash_deal") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">SuperDeals</span>;
  }
  if (tag === "Brand+" || tag === "premium") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Brand+</span>;
  }
  return null;
};

// ContentCard Factory - Simplified without height measurement
interface ContentCardProps {
  item: ContentItem;
}

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(({ item }, ref) => {
  if (item.type === 'product') {
    return (
      <div ref={ref}>
        <ProductCard 
          product={item} 
          renderTag={renderTag}
          aspectRatio="auto"
        />
      </div>
    );
  }
  return null;
});

ContentCard.displayName = 'ContentCard';

// True Pinterest-style Masonry Grid with stable distribution
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  const productsOnly = items.filter(item => item.type === 'product');
  const prevItemsRef = useRef<ContentItem[]>([]);
  const columnsRef = useRef<[ContentItem[], ContentItem[]]>([[], []]);

  // Only recalculate when new items are added (not on every render)
  const columns = React.useMemo(() => {
    const prevItems = prevItemsRef.current;
    const newItems = productsOnly;

    // If items haven't changed, return cached columns
    if (prevItems.length === newItems.length && 
        prevItems.every((item, idx) => item.id === newItems[idx]?.id)) {
      return columnsRef.current;
    }

    // Only process NEW items that weren't in previous render
    const newlyAddedItems = newItems.slice(prevItems.length);
    
    if (newlyAddedItems.length === 0 && prevItems.length > 0) {
      return columnsRef.current;
    }

    // Start with existing columns
    const col1 = [...columnsRef.current[0]];
    const col2 = [...columnsRef.current[1]];
    
    // Calculate current column heights (estimated)
    let col1Height = col1.reduce((sum, item) => sum + (
      300 + 
      (item.description?.length || 0) * 0.3 +
      (item.tags?.length || 0) * 8
    ), 0);
    
    let col2Height = col2.reduce((sum, item) => sum + (
      300 + 
      (item.description?.length || 0) * 0.3 +
      (item.tags?.length || 0) * 8
    ), 0);

    // Distribute ONLY new items
    newlyAddedItems.forEach((item) => {
      const estimatedHeight = 
        300 + 
        (item.description?.length || 0) * 0.3 +
        (item.tags?.length || 0) * 8;
      
      // Add to the shorter column
      if (col1Height <= col2Height) {
        col1.push(item);
        col1Height += estimatedHeight;
      } else {
        col2.push(item);
        col2Height += estimatedHeight;
      }
    });

    // Cache the new columns
    columnsRef.current = [col1, col2];
    prevItemsRef.current = newItems;
    
    return columnsRef.current;
  }, [productsOnly]);

  return (
    <div className="px-2">
      {/* True masonry: two independent columns, balanced by height */}
      <div className="flex gap-2 items-start">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col gap-2">
          {columns[0].map((item) => (
            <ContentCard 
              key={`${item.type}-${item.id}`}
              item={item}
            />
          ))}
        </div>
        
        {/* Column 2 */}
        <div className="flex-1 flex flex-col gap-2">
          {columns[1].map((item) => (
            <ContentCard 
              key={`${item.type}-${item.id}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main InfiniteContentGrid Component
interface InfiniteContentGridProps {
  category?: string;
  filters?: FilterState;
}

const InfiniteContentGrid: React.FC<InfiniteContentGridProps> = ({ 
  category, 
  filters 
}) => {
  const {
    visibleContent,
    loading,
    initialLoading,
    hasMore,
    loaderRef,
    hasActiveFilters
  } = useContentGrid(category, filters);

  // Filter out reels from visible content
  const productsOnly = React.useMemo(() => {
    return visibleContent.filter(item => item.type === 'product');
  }, [visibleContent]);

  // Show loading state while fetching initial data
  if (initialLoading && productsOnly.length === 0) {
    return (
      <div className="px-2">
        <div className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: `${250 + Math.random() * 150}px` }}></div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: `${250 + Math.random() * 150}px` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!initialLoading && productsOnly.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {hasActiveFilters() ? (
          <>
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No products found</p>
            <p className="text-xs text-gray-500 mb-4">Try adjusting your filters</p>
          </>
        ) : (
          <div>
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No products available</p>
            <p className="text-xs text-gray-500 mb-4">Check back soon for new products!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Masonry Grid - Shows only products with dynamic rebalancing */}
      <MasonryGrid items={productsOnly} />

      {/* Load more trigger */}
      <div 
        ref={loaderRef}
        className="flex justify-center items-center py-6"
      >
        {loading ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading more products...</p>
          </div>
        ) : hasMore ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2 opacity-50"></div>
            <p className="text-xs text-gray-400">Scroll to load more products</p>
          </div>
        ) : productsOnly.length > 0 ? (
          <div className="text-center py-4">
            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No more products to load</p>
            <p className="text-[10px] text-gray-400 mt-1">You've reached the end</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfiniteContentGrid;
export { type FilterState };