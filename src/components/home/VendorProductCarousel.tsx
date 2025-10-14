import React, { useState, useRef } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from './SectionHeader';

const PostCard = ({
  title,
  postDescription,
  displayProducts,
  likeCount,
  commentCount,
  shareCount,
  onProductClick
}) => {
  const [liked, setLiked] = useState(false);
  const carouselRef = useRef(null);

  const handleLike = () => setLiked(!liked);
  const handleComment = () => console.log('Comment clicked');
  const handleShare = () => console.log('Share clicked');

  const Button = ({ variant, size, className, children, ...props }) => (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full flex-shrink-0 overflow-hidden">
      {/* Post Description */}
      <div className="px-3 py-2 text-gray-800 text-sm">
        <p className="whitespace-pre-line line-clamp-3">{postDescription}</p>
      </div>

      {/* Products Display */}
      <div className="relative w-full px-3 py-2">
        {/* Single Product - Full Width */}
        {displayProducts.length === 1 && (
          <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <img
                src={displayProducts[0].image}
                alt="Product"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {displayProducts[0].discount && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                  {displayProducts[0].discount} OFF
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two Products - Justified */}
        {displayProducts.length === 2 && (
          <div className="flex justify-between gap-2">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-1 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                      {product.discount} OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Three Products - Horizontal Line */}
        {displayProducts.length === 3 && (
          <div className="flex gap-2">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-1 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-br-lg z-10">
                      {product.discount} OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Four Products - 2x2 Grid */}
        {displayProducts.length === 4 && (
          <div className="grid grid-cols-2 gap-2">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                      {product.discount} OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Five or More Products - 2x2 Grid with Counter */}
        {displayProducts.length >= 5 && (
          <div className="grid grid-cols-2 gap-2">
            {displayProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                      {product.discount} OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Last product with counter overlay */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow relative">
              <div className="relative aspect-square">
                <img
                  src={displayProducts[3].image}
                  alt="Product"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {displayProducts[3].discount && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                    {displayProducts[3].discount} OFF
                  </div>
                )}
                {/* Counter Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{displayProducts.length - 4}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Facebook style engagement stats */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex items-center -space-x-1">
            <span className="text-lg leading-none border-2 border-white rounded-full z-30">👍</span>
            <span className="text-lg leading-none border-2 border-white rounded-full z-20">❤️</span>
            <span className="text-lg leading-none border-2 border-white rounded-full z-10">😆</span>
          </div>
          <span className="text-xs text-gray-500">{likeCount}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* Enhanced Social Buttons - Moved to Bottom */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex-1">
          <button
            onClick={handleLike}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} />
            <span className={`text-xs ${liked ? 'font-medium text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`}>
              Like
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleComment}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">
              Comment
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <i className="fa-solid fa-share w-4 h-4 text-gray-600 group-hover:text-gray-800 flex items-center justify-center"></i>
            <span className="text-xs text-gray-600 group-hover:text-gray-800">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface VendorProductCarouselProps {
  title: string;
  products: any[];
  onProductClick?: (productId: string) => void;
  posts?: any[]; // Allow passing custom posts
}

const VendorProductCarousel: React.FC<VendorProductCarouselProps> = ({
  title,
  products,
  onProductClick,
  posts: customPosts // Optional custom posts prop
}) => {
  // Helper function to get seller logo URL from Supabase storage
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

    const { data } = supabase.storage
      .from('seller-logos')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  // Helper function to get product image URL from Supabase storage
  const getProductImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  const handleFollowClick = () => {
    console.log('Follow button clicked');
    // Add your follow logic here
  };

  // Use custom posts if provided, otherwise use default posts
  const posts = customPosts || [
    {
      id: 1,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Tech Store Pro",
        verified: true,
        followers: "12.5K",
        publishedAt: "2024-01-15T10:30:00Z"
      },
      title: "Latest Tech Deals",
      postDescription: "Check out our amazing deals on the latest gadgets! Perfect for tech enthusiasts and professionals. Limited time offers available now.",
      displayProducts: [
        {
          id: 1,
          image: getProductImageUrl("b6e05212-a0ba-4958-8b95-858f72d907a8/1753454025995-4-1000235215.webp"),
          discount: "20%",
          currentPrice: "$299",
          originalPrice: "$399"
        },
        {
          id: 2,
          image: getProductImageUrl("b6e05212-a0ba-4958-8b95-858f72d907a8/1753454025995-3-1000235214.webp"),
          discount: "15%",
          currentPrice: "$599",
          originalPrice: "$699"
        }
      ],
      likeCount: 245,
      commentCount: 32,
      shareCount: 18
    },
    {
      id: 2,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Fashion Forward",
        verified: true,
        followers: "8.3K",
        publishedAt: "2024-01-14T15:45:00Z"
      },
      title: "Summer Collection 2024",
      postDescription: "Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits for every occasion.",
      displayProducts: [
        {
          id: 4,
          image: getProductImageUrl("61aeccd8-b9e6-4ec3-be16-4d055de6ee37/1753453908730-0-1000235206.webp"),
          discount: "30%",
          currentPrice: "$79",
          originalPrice: "$115"
        }
      ],
      likeCount: 189,
      commentCount: 24,
      shareCount: 11
    },
    {
      id: 3,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Home & Garden",
        verified: false,
        followers: "5.1K",
        publishedAt: "2024-01-13T09:20:00Z"
      },
      title: "Transform Your Space",
      postDescription: "Beautiful home decor items to transform your living space. Quality furniture and accessories at unbeatable prices.",
      displayProducts: [
        {
          id: 6,
          image: getProductImageUrl("c4e5f01a-b006-40e1-a5d6-6606876ee92a/1747588517198-0-happy valentine day.png"),
          discount: "25%",
          currentPrice: "$149",
          originalPrice: "$199"
        }
      ],
      likeCount: 156,
      commentCount: 19,
      shareCount: 7
    }
  ];

  // Show only the first post instead of carousel
  const currentPost = posts[0];

  return (
    <div className="w-full bg-white mb-4">
      {/* SectionHeader for the post with vendor data */}
      <SectionHeader
        title={currentPost.title}
        showVendorHeader={true}
        vendorData={currentPost.vendorData}
        onFollowClick={handleFollowClick}
      />

      <PostCard
        title={currentPost.title}
        postDescription={currentPost.postDescription}
        displayProducts={currentPost.displayProducts}
        likeCount={currentPost.likeCount}
        commentCount={currentPost.commentCount}
        shareCount={currentPost.shareCount}
        onProductClick={onProductClick}
      />
    </div>
  );
};

export default VendorProductCarousel;