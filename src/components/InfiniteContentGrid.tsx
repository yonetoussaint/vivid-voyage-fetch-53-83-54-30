import React from "react";
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, Users, Heart, MessageCircle, Send, MoreHorizontal, Store, User, CheckCircle } from "lucide-react";

// Import the custom hook
import { useContentGrid, FilterState, ContentItem } from "./useContentGrid";

// Import card components (these can stay in separate files)
import { ProductCard } from "./ProductCard";
import { ReelCard } from "./ReelCard";
import { PostCard } from "./PostCard";
import { VendorCardWrapper } from "./VendorCard";

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
  if (tag === "POST" || tag === "post") {
    return <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-1.5 py-0.5 rounded text-[10px] mr-1 inline-block align-middle font-semibold">POST</span>;
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
    case 'post':
      return <PostCard post={item} />;
    case 'vendor':
      return <VendorCardWrapper vendor={item} />;
    default:
      return null;
  }
};

// Masonry Grid Component
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  const columns = React.useMemo(() => {
    const colCount = 2;
    const cols: ContentItem[][] = Array.from({ length: colCount }, () => []);

    items.forEach((item, index) => {
      const colIndex = index % colCount;
      cols[colIndex].push(item);
    });

    return cols;
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-px">
          {column.map((item) => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} />
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

  // Show loading state while fetching initial data
  if (initialLoading && visibleContent.length === 0) {
    return (
      <div className="px-2">
        <div className="grid grid-cols-2 gap-2">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: '300px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no content
  if (!initialLoading && visibleContent.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {hasActiveFilters() ? (
          <>
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No matching items found</p>
            <p className="text-xs text-gray-500 mb-4">Try adjusting your filters</p>
          </>
        ) : (
          "No content found. Check back soon!"
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Masonry Grid */}
      <MasonryGrid items={visibleContent} />

      {/* Load more trigger */}
      <div 
        ref={loaderRef}
        className="flex justify-center items-center py-6"
      >
        {hasMore ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading more content...</p>
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