import React from "react";
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

// True 2-column Masonry Grid
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  // Filter to ONLY include products (no reels)
  const productsOnly = items.filter(item => item.type === 'product');

  // Split products into two columns by distributing them
  const columns = React.useMemo(() => {
    const col1: ContentItem[] = [];
    const col2: ContentItem[] = [];
    
    productsOnly.forEach((item, index) => {
      if (index % 2 === 0) {
        col1.push(item);
      } else {
        col2.push(item);
      }
    });
    
    return [col1, col2];
  }, [productsOnly]);

  console.log(`MasonryGrid: Showing ${productsOnly.length} products (reels filtered out)`);

  return (
    <div className="px-2">
      {/* True masonry: two independent columns */}
      <div className="flex gap-2">
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
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: '300px' }}></div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: '300px' }}></div>
            ))}
          </div>
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
      {/* Masonry Grid - Shows only products */}
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