import React, { useEffect, useRef, useState } from "react";
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

// ContentCard Factory - Only handles products now
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  // Only render product cards
  if (item.type === 'product') {
    return <ProductCard product={item} renderTag={renderTag} />;
  }
  // Don't render anything for reels
  return null;
};

// Real Masonry Grid Component
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  // Filter to ONLY include products (no reels)
  const productsOnly = items.filter(item => item.type === 'product');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(2);

  // Calculate column count based on container width
  useEffect(() => {
    const updateColumnCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // On mobile: 2 columns
        // On larger screens: 3 columns (you can adjust this)
        const cols = width >= 768 ? 3 : 2;
        setColumnCount(cols);
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Organize items into true masonry columns
  const columns = React.useMemo(() => {
    const cols: ContentItem[][] = Array.from({ length: columnCount }, () => []);
    
    // Track the current height of each column
    const columnHeights = new Array(columnCount).fill(0);
    
    // For proper masonry, we need to know which column is shortest
    productsOnly.forEach((item) => {
      // Find the column with the minimum height
      let shortestColumnIndex = 0;
      let minHeight = columnHeights[0];
      
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i];
          shortestColumnIndex = i;
        }
      }
      
      // Add item to the shortest column
      cols[shortestColumnIndex].push(item);
      
      // Since we don't know the exact height in advance (images load async),
      // we can estimate or just increment a counter
      // For now, we'll use a simple counter approach
      columnHeights[shortestColumnIndex] += 1;
    });
    
    console.log(`MasonryGrid: ${columnCount} columns, ${productsOnly.length} products`);
    
    return cols;
  }, [productsOnly, columnCount]);

  return (
    <div ref={containerRef} className="px-2">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}>
        {columns.map((column, colIndex) => (
          <div key={`col-${colIndex}`} className="flex flex-col gap-2">
            {column.map((item) => (
              <ContentCard 
                key={`${item.type}-${item.id}`}
                item={item} 
              />
            ))}
          </div>
        ))}
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

  // Debug: Log what we're getting
  React.useEffect(() => {
    const reels = visibleContent.filter(item => item.type === 'reel');
    const products = visibleContent.filter(item => item.type === 'product');

    console.log(`InfiniteContentGrid - Products Only Mode:`);
    console.log(`  Total items from hook: ${visibleContent.length}`);
    console.log(`  Products: ${products.length}`);
    console.log(`  Reels (filtered out): ${reels.length}`);
    console.log(`  Showing only: ${productsOnly.length} products`);
  }, [visibleContent, productsOnly]);

  // Show loading state while fetching initial data
  if (initialLoading && productsOnly.length === 0) {
    console.log("Showing initial loading skeleton (products only)");
    return (
      <div className="px-2">
        <div className="grid grid-cols-2 gap-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: '300px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!initialLoading && productsOnly.length === 0) {
    console.log("Showing empty state (no products found)");
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

  console.log(`Rendering ${productsOnly.length} products, hasMore: ${hasMore}`);

  return (
    <div className="pb-20">
      {/* Real Masonry Grid - Shows only products */}
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