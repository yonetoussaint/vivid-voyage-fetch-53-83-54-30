import React from "react";
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, Users, Heart, MessageCircle, Send, MoreHorizontal, Store, User, CheckCircle } from "lucide-react";

// Import the custom hook
import { useContentGrid, FilterState, ContentItem } from "@/hooks/useContentGrid";

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

// Helper function to intersperse non-product content among all products
const intersperseContent = (items: ContentItem[]): ContentItem[] => {
  if (items.length === 0) return [];
  
  // Separate products from other content types
  const products = items.filter(item => item.type === 'product');
  const reels = items.filter(item => item.type === 'reel');
  const posts = items.filter(item => item.type === 'post');
  const others = items.filter(item => item.type !== 'product' && item.type !== 'reel' && item.type !== 'post');
  
  // If no products, just return all items
  if (products.length === 0) {
    return [...reels, ...posts, ...others];
  }
  
  const result: ContentItem[] = [];
  let productIndex = 0;
  let reelIndex = 0;
  let postIndex = 0;
  let otherIndex = 0;
  
  // Calculate how often to insert non-product content
  // For every 8 products (80%), insert 1 reel (10%), 0.5 post (5%), and 0.5 other (5%)
  // Since we can't insert half items, we'll use a pattern of 16 products, 2 reels, 1 post, 1 other
  const patternSize = 20; // 16 products + 2 reels + 1 post + 1 other
  
  while (productIndex < products.length) {
    // Add products in batches of 16
    for (let i = 0; i < 16 && productIndex < products.length; i++) {
      result.push(products[productIndex++]);
    }
    
    // Add 2 reels if available
    for (let i = 0; i < 2 && reelIndex < reels.length; i++) {
      result.push(reels[reelIndex++]);
    }
    
    // Add 1 post if available
    if (postIndex < posts.length) {
      result.push(posts[postIndex++]);
    }
    
    // Add 1 other if available
    if (otherIndex < others.length) {
      result.push(others[otherIndex++]);
    }
  }
  
  // If we still have non-product content after all products are added,
  // append them at the end
  if (reelIndex < reels.length) {
    result.push(...reels.slice(reelIndex));
  }
  
  if (postIndex < posts.length) {
    result.push(...posts.slice(postIndex));
  }
  
  if (otherIndex < others.length) {
    result.push(...others.slice(otherIndex));
  }
  
  return result;
};

// Alternative: Simple interspersion for better UX
const simpleIntersperseContent = (items: ContentItem[]): ContentItem[] => {
  if (items.length === 0) return [];
  
  // Separate products from other content types
  const products = items.filter(item => item.type === 'product');
  const nonProducts = items.filter(item => item.type !== 'product');
  
  // If few non-products, just return products first
  if (nonProducts.length === 0) return products;
  
  const result: ContentItem[] = [];
  let productIndex = 0;
  let nonProductIndex = 0;
  
  // Insert 1 non-product item for every 8 products
  const productsPerNonProduct = 8;
  
  while (productIndex < products.length || nonProductIndex < nonProducts.length) {
    // Add products in chunks
    for (let i = 0; i < productsPerNonProduct && productIndex < products.length; i++) {
      result.push(products[productIndex++]);
    }
    
    // Add one non-product if available
    if (nonProductIndex < nonProducts.length) {
      result.push(nonProducts[nonProductIndex++]);
    } else if (productIndex < products.length) {
      // If no more non-products, just add remaining products
      result.push(products[productIndex++]);
    }
  }
  
  return result;
};

// Masonry Grid Component
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  // Apply the interspersion algorithm
  const interspersedItems = simpleIntersperseContent(items);
  
  const columns = React.useMemo(() => {
    const colCount = 2;
    const cols: ContentItem[][] = Array.from({ length: colCount }, () => []);

    interspersedItems.forEach((item, index) => {
      const colIndex = index % colCount;
      cols[colIndex].push(item);
    });

    return cols;
  }, [interspersedItems]);

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