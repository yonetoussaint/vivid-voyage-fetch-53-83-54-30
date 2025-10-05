
import React, { useState } from 'react';
import { Image, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import VendorProductCarousel from '@/components/home/VendorProductCarousel';

interface SellerPostsTabProps {
  onCreatePost?: () => void;
}

const SellerPostsTab: React.FC<SellerPostsTabProps> = ({ onCreatePost }) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  };

  const filterCategories = [
    {
      id: 'sort',
      label: 'Sort By',
      options: ['All', 'Most Recent', 'Most Liked', 'Most Commented']
    },
    {
      id: 'type',
      label: 'Post Type',
      options: ['All', 'Announcements', 'Updates', 'Promotions']
    }
  ];

  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  // Auto-select first option for each filter on mount
  React.useEffect(() => {
    const initialFilters: Record<string, string> = {};
    let hasChanges = false;
    
    filterCategories.forEach((filter) => {
      if (!selectedFilters[filter.id] && filter.options.length > 0) {
        initialFilters[filter.id] = filter.options[0];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setSelectedFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, []);

  const stats = [
    { value: 3, label: 'Total Posts', color: 'text-blue-600' },
    { value: 590, label: 'Total Likes', color: 'text-red-600' },
    { value: 75, label: 'Comments', color: 'text-green-600' }
  ];

  return (
    <div className="w-full bg-white">
      <SellerSummaryHeader
        title="Posts"
        subtitle="Share updates, announcements, and photos with followers"
        stats={stats}
        actionButton={{
          label: "Create Post",
          icon: Plus,
          onClick: onCreatePost
        }}
      />

      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

      <div className="py-4">
        {/* Vertical Posts Feed */}
        <div className="space-y-6 max-w-2xl mx-auto">
        <VendorPostCard
          vendorData={{
            profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            vendorName: "Tech Store Pro",
            verified: true,
            followers: "12.5K",
            publishedAt: "2024-01-15T10:30:00Z"
          }}
          title="Latest Tech Deals"
          postDescription="Check out our amazing deals on the latest gadgets! Perfect for tech enthusiasts and professionals. Limited time offers available now."
          displayProducts={[
            {
              id: 1,
              image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
              discount: "20%",
              currentPrice: "$299",
              originalPrice: "$399"
            },
            {
              id: 2,
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
              discount: "15%",
              currentPrice: "$599",
              originalPrice: "$699"
            },
            {
              id: 3,
              image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
              currentPrice: "$199",
              originalPrice: null
            }
          ]}
          likeCount={245}
          commentCount={32}
          shareCount={18}
        />

        <VendorPostCard
          vendorData={{
            profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            vendorName: "Fashion Forward",
            verified: true,
            followers: "8.3K",
            publishedAt: "2024-01-14T15:45:00Z"
          }}
          title="Summer Collection 2024"
          postDescription="Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits for every occasion."
          displayProducts={[
            {
              id: 4,
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
              discount: "30%",
              currentPrice: "$79",
              originalPrice: "$115"
            },
            {
              id: 5,
              image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop",
              currentPrice: "$129",
              originalPrice: null
            }
          ]}
          likeCount={189}
          commentCount={24}
          shareCount={11}
        />

        <VendorPostCard
          vendorData={{
            profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            vendorName: "Home & Garden",
            verified: false,
            followers: "5.1K",
            publishedAt: "2024-01-13T09:20:00Z"
          }}
          title="Transform Your Space"
          postDescription="Beautiful home decor items to transform your living space. Quality furniture and accessories at unbeatable prices."
          displayProducts={[
            {
              id: 6,
              image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
              discount: "25%",
              currentPrice: "$149",
              originalPrice: "$199"
            },
            {
              id: 7,
              image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop",
              currentPrice: "$89",
              originalPrice: null
            },
            {
              id: 8,
              image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
              discount: "10%",
              currentPrice: "$259",
              originalPrice: "$289"
            }
          ]}
          likeCount={156}
          commentCount={19}
          shareCount={7}
        />
        </div>
      </div>
    </div>
  );
};

// Vertical Post Card Component (Facebook-style)
const VendorPostCard = ({
  vendorData,
  title,
  postDescription,
  displayProducts,
  likeCount,
  commentCount,
  shareCount
}) => {
  const [liked, setLiked] = React.useState(false);

  const handleLike = () => setLiked(!liked);
  const handleComment = () => console.log('Comment clicked');
  const handleShare = () => console.log('Share clicked');

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Vendor Info Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="flex-shrink-0 mr-3 rounded-full overflow-hidden w-10 h-10">
          <img
            src={vendorData.profilePic}
            alt={vendorData.vendorName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-sm">
              {title || vendorData.vendorName}
            </h3>
            {vendorData.verified && (
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-gray-500 text-xs">
            {vendorData.followers} followers • {timeAgo(vendorData.publishedAt)}
          </p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Follow
        </button>
      </div>

      {/* Post Description */}
      <div className="px-4 py-3 text-gray-800 text-sm">
        <p className="whitespace-pre-line">{postDescription}</p>
      </div>

      {/* Products List - Vertical Full Width Layout */}
      <div className="px-4 pb-4">
        <div className="space-y-3">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="relative w-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Discount Tag */}
                  {product.discount && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                      {product.discount}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500 text-base">{product.currentPrice}</span>
                      {product.originalPrice && (
                        <span className="line-through text-gray-400 text-sm">{product.originalPrice}</span>
                      )}
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      View
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Available now • Free shipping
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 rounded-full p-1">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <span className="text-sm text-gray-500">{likeCount}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center px-2 py-2">
        <div className="flex-1">
          <button
            onClick={handleLike}
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 hover:bg-gray-100 rounded-md"
          >
            <svg className={`w-5 h-5 ${liked ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className={`text-sm ${liked ? 'font-medium text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`}>
              Like
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleComment}
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm text-gray-600 group-hover:text-gray-800">
              Comment
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm text-gray-600 group-hover:text-gray-800">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPostsTab;
