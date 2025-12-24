import React from "react";
import { Sparkles } from "lucide-react";

// Import the custom hook
import { useContentGrid, FilterState, ContentItem } from "@/hooks/useContentGrid";

// Import card components
import { ProductCard } from "./ProductCard";
import { ReelCard } from "./ReelCard";

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

// ContentCard Factory
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  switch (item.type) {
    case 'product':
      return <ProductCard product={item} renderTag={renderTag} />;
    case 'reel':
      return <ReelCard reel={item} />;
    default:
      return null;
  }
};

// Helper function to intersperse reels among products with 70% products, 30% reels ratio
const intersperseProductsAndReels = (items: ContentItem[]): ContentItem[] => {
  if (items.length === 0) return [];

  // Separate products and reels
  const products = items.filter(item => item.type === 'product');
  const reels = items.filter(item => item.type === 'reel');

  // If no products or reels, return whatever we have
  if (products.length === 0) return reels;
  if (reels.length === 0) return products;

  const result: ContentItem[] = [];
  let productIndex = 0;
  let reelIndex = 0;

  // We want 70% products, 30% reels
  // For every 10 items: 7 products, 3 reels
  const productsPerBatch = 7;
  const reelsPerBatch = 3;

  while (productIndex < products.length || reelIndex < reels.length) {
    // Add products batch
    for (let i = 0; i < productsPerBatch && productIndex < products.length; i++) {
      result.push(products[productIndex++]);
    }

    // Add reels batch
    for (let i = 0; i < reelsPerBatch && reelIndex < reels.length; i++) {
      result.push(reels[reelIndex++]);
    }

    // If we run out of reels but still have products, add remaining products
    if (reelIndex >= reels.length && productIndex < products.length) {
      result.push(...products.slice(productIndex));
      break;
    }

    // If we run out of products but still have reels, add remaining reels
    if (productIndex >= products.length && reelIndex < reels.length) {
      result.push(...reels.slice(reelIndex));
      break;
    }
  }

  return result;
};

// Evenly distributed interspersion - FIXED VERSION
const evenlyIntersperse = (items: ContentItem[]): ContentItem[] => {
  if (items.length === 0) {
    console.log("evenlyIntersperse: No items to intersperse");
    return [];
  }

  // Separate products and reels
  const products = items.filter(item => item.type === 'product');
  const reels = items.filter(item => item.type === 'reel');

  console.log(`evenlyIntersperse: ${products.length} products, ${reels.length} reels`);

  // Debug: Show reel thumbnails
  reels.forEach((reel, idx) => {
    const r = reel as any;
    console.log(`Reel ${idx}: id=${r.id}, thumb=${r.thumbnail_url ? 'YES' : 'NO'}, video=${r.video_url ? 'YES' : 'NO'}`);
  });

  // If no products or reels, return whatever we have
  if (products.length === 0) {
    console.log("evenlyIntersperse: No products, returning reels only");
    return reels;
  }
  if (reels.length === 0) {
    console.log("evenlyIntersperse: No reels, returning products only");
    return products;
  }

  const result: ContentItem[] = [];
  let productIndex = 0;
  let reelIndex = 0;

  // Calculate ratio: 70% products, 30% reels
  // For every 7 products, insert 3 reels
  const productsPerGroup = 7;
  const reelsPerGroup = 3;

  // Calculate how many full groups we can make
  const fullProductGroups = Math.floor(products.length / productsPerGroup);
  const fullReelGroups = Math.floor(reels.length / reelsPerGroup);
  const groups = Math.min(fullProductGroups, fullReelGroups);

  console.log(`evenlyIntersperse: Creating ${groups} groups of ${productsPerGroup} products + ${reelsPerGroup} reels`);

  // Create the interspersed pattern
  for (let group = 0; group < groups; group++) {
    // Add products for this group
    for (let i = 0; i < productsPerGroup && productIndex < products.length; i++) {
      result.push(products[productIndex++]);
    }

    // Add reels for this group
    for (let i = 0; i < reelsPerGroup && reelIndex < reels.length; i++) {
      result.push(reels[reelIndex++]);
    }
  }

  // Add any remaining products
  while (productIndex < products.length) {
    result.push(products[productIndex++]);
  }

  // Add any remaining reels
  while (reelIndex < reels.length) {
    result.push(reels[reelIndex++]);
  }

  console.log(`evenlyIntersperse: Final result - ${result.length} items (${result.filter(i => i.type === 'product').length} products, ${result.filter(i => i.type === 'reel').length} reels)`);
  
  return result;
};

// Masonry Grid Component - FIXED VERSION
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  // Filter to only include products and reels
  const filteredItems = items.filter(item => item.type === 'product' || item.type === 'reel');

  console.log(`MasonryGrid received: ${items.length} total items, ${filteredItems.length} filtered items`);

  // Apply the interspersion algorithm
  const interspersedItems = evenlyIntersperse(filteredItems);

  const columns = React.useMemo(() => {
    const colCount = 2;
    const cols: ContentItem[][] = Array.from({ length: colCount }, () => []);

    interspersedItems.forEach((item, index) => {
      const colIndex = index % colCount;
      cols[colIndex].push(item);
    });

    // Debug column distribution
    console.log(`MasonryGrid columns: ${cols[0].length} items in col 0, ${cols[1].length} items in col 1`);
    
    return cols;
  }, [interspersedItems]);

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      {columns.map((column, colIndex) => (
        <div key={`col-${colIndex}`} className="flex flex-col gap-px">
          {column.map((item) => (
            <ContentCard 
              key={`${item.type}-${item.id}`}
              item={item} 
            />
          ))}
        </div>
      ))}
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

  // Debug: Log what we're getting from the hook
  React.useEffect(() => {
    const reels = visibleContent.filter(item => item.type === 'reel');
    console.log(`InfiniteContentGrid: ${visibleContent.length} items visible, ${reels.length} reels`);
    
    if (reels.length > 0) {
      reels.forEach((reel, idx) => {
        const r = reel as any;
        console.log(`Visible Reel ${idx}: id=${r.id}, thumb=${r.thumbnail_url ? 'YES' : 'NO'}, video=${r.video_url ? 'YES' : 'NO'}`);
      });
    }
  }, [visibleContent]);

  // Show loading state while fetching initial data
  if (initialLoading && visibleContent.length === 0) {
    console.log("InfiniteContentGrid: Showing initial loading skeleton");
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

  // Show empty state if no content
  if (!initialLoading && visibleContent.length === 0) {
    console.log("InfiniteContentGrid: Showing empty state");
    return (
      <div className="text-center py-8 text-gray-500">
        {hasActiveFilters() ? (
          <>
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No matching items found</p>
            <p className="text-xs text-gray-500 mb-4">Try adjusting your filters</p>
          </>
        ) : (
          <div>
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No content found</p>
            <p className="text-xs text-gray-500 mb-4">Check back soon for new products and reels!</p>
          </div>
        )}
      </div>
    );
  }

  console.log(`InfiniteContentGrid: Rendering ${visibleContent.length} items, hasMore: ${hasMore}, loading: ${loading}`);

  return (
    <div className="pb-20">
      {/* Masonry Grid */}
      <MasonryGrid items={visibleContent} />

      {/* Load more trigger */}
      <div 
        ref={loaderRef}
        className="flex justify-center items-center py-6"
      >
        {loading ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading more content...</p>
          </div>
        ) : hasMore ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2 opacity-50"></div>
            <p className="text-xs text-gray-400">Scroll to load more</p>
          </div>
        ) : visibleContent.length > 0 ? (
          <div className="text-center py-4">
            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No more content to load</p>
            <p className="text-[10px] text-gray-400 mt-1">You've reached the end</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfiniteContentGrid;
export { type FilterState };