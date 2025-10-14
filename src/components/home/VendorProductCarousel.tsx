import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from './SectionHeader';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import VendorPostComments from './VendorPostComments';

const PostCard = ({
  title,
  postDescription,
  displayProducts,
  likeCount,
  commentCount,
  shareCount,
  onProductClick,
  postId
}) => {
  const [liked, setLiked] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const carouselRef = useRef(null);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const reactionsRef = useRef(null);

  const reactions = [
    { 
      id: 'like', 
      icon: <ThumbsUp className="h-5 w-5 text-white fill-white" />, 
      bg: 'bg-blue-500', 
      label: 'Like' 
    },
    { 
      id: 'love', 
      icon: <i className="fa-solid fa-heart text-white text-base"></i>, 
      bg: 'bg-red-500', 
      label: 'Love' 
    },
    { 
      id: 'haha', 
      emoji: '😆', 
      label: 'Haha' 
    },
    { 
      id: 'wow', 
      emoji: '😮', 
      label: 'Wow' 
    },
    { 
      id: 'sad', 
      emoji: '😢', 
      label: 'Sad' 
    },
    { 
      id: 'angry', 
      emoji: '😠', 
      label: 'Angry' 
    }
  ];

  const handleLikePress = () => {
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowReactions(true);
    }, 300);
  };

  const handleLikeRelease = () => {
    clearTimeout(longPressTimer.current);

    if (!isLongPress.current) {
      // Quick click - toggle like
      if (liked || selectedReaction) {
        setLiked(false);
        setSelectedReaction(null);
        setCurrentLikeCount(prev => prev - 1);
      } else {
        setLiked(true);
        setSelectedReaction('like');
        setCurrentLikeCount(prev => prev + 1);
      }
    }

    isLongPress.current = false;
  };

  const handleReactionSelect = (reaction) => {
    const wasLiked = liked || selectedReaction;
    setSelectedReaction(reaction.id);
    setLiked(reaction.id === 'like');
    setShowReactions(false);

    if (!wasLiked) {
      setCurrentLikeCount(prev => prev + 1);
    }
  };

  const handleComment = () => setShowCommentsPanel(true);
  const handleShare = () => console.log('Share clicked');

  // Handle clicks outside reactions overlay to dismiss it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showReactions]);

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
      <div className="px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex items-center -space-x-1">
            <div className="bg-blue-500 rounded-full p-0.5 w-5 h-5 flex items-center justify-center border border-white z-30">
              <ThumbsUp className="h-3 w-3 text-white fill-white" />
            </div>
            <div className="bg-red-500 rounded-full p-0.5 w-5 h-5 flex items-center justify-center border border-white z-20">
              <i className="fa-solid fa-heart text-white text-[10px]"></i>
            </div>
            <span className="text-lg leading-none z-10">😆</span>
          </div>
          <span className="text-xs text-gray-500">{currentLikeCount}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* Enhanced Social Buttons - Moved to Bottom */}
      <div className="flex items-center justify-between px-2 py-1 relative gap-3">
        {/* Reactions Overlay */}
        {showReactions && (
          <div 
            ref={reactionsRef}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {reactions.map((reaction) => (
              <button
                key={reaction.id}
                onClick={() => handleReactionSelect(reaction)}
                className="hover:scale-125 transition-transform duration-200 flex flex-col items-center"
              >
                {reaction.icon ? (
                  <div className={`${reaction.bg} rounded-full w-8 h-8 flex items-center justify-center`}>
                    {reaction.icon}
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-3xl leading-none">{reaction.emoji}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1">
          <button
            onMouseDown={handleLikePress}
            onMouseUp={handleLikeRelease}
            onMouseLeave={() => {
              clearTimeout(longPressTimer.current);
              isLongPress.current = false;
            }}
            onTouchStart={handleLikePress}
            onTouchEnd={handleLikeRelease}
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
          >
            {selectedReaction && selectedReaction !== 'like' ? (
              <>
                {reactions.find(r => r.id === selectedReaction)?.emoji ? (
                  <span className="text-lg">{reactions.find(r => r.id === selectedReaction)?.emoji}</span>
                ) : (
                  selectedReaction === 'love' ? (
                    <i className="fa-solid fa-heart text-red-500 text-lg"></i>
                  ) : null
                )}
                <span className={`text-xs font-medium ${selectedReaction === 'love' ? 'text-red-500' : selectedReaction === 'wow' ? 'text-yellow-500' : selectedReaction === 'sad' ? 'text-yellow-600' : 'text-orange-500'}`}>
                  {reactions.find(r => r.id === selectedReaction)?.label}
                </span>
              </>
            ) : (
              <>
                <ThumbsUp className={`w-4 h-4 ${liked ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} />
                <span className={`text-xs ${liked ? 'font-medium text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  Like
                </span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleComment}
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
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
            className="flex items-center justify-center gap-2 group transition-colors w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
          >
            <i className="fa-solid fa-share w-4 h-4 text-gray-600 group-hover:text-gray-800 flex items-center justify-center"></i>
            <span className="text-xs text-gray-600 group-hover:text-gray-800">
              Share
            </span>
          </button>
        </div>
      </div>

      {/* Comments Panel */}
      <SlideUpPanel
        isOpen={showCommentsPanel}
        onClose={() => setShowCommentsPanel(false)}
        title="Comments"
        className="p-0"
        preventBodyScroll={true}
      >
        <VendorPostComments postId={postId} />
      </SlideUpPanel>
    </div>
  );
};

interface VendorProductCarouselProps {
  title: string;
  products: any[];
  onProductClick?: (productId: string) => void;
  posts?: any[]; // Allow passing custom posts
  sellerId?: string; // Optional seller ID to filter posts
}

const VendorProductCarousel: React.FC<VendorProductCarouselProps> = ({
  title,
  products,
  onProductClick,
  posts: customPosts, // Optional custom posts prop
  sellerId
}) => {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  // Fetch seller posts and products data from database
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch seller posts with seller information
        let postsQuery = supabase
          .from('seller_posts')
          .select(`
            id,
            seller_id,
            title,
            description,
            product_ids,
            like_count,
            comment_count,
            share_count,
            created_at,
            sellers (
              id,
              name,
              image_url,
              verified,
              followers_count
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (sellerId) {
          postsQuery = postsQuery.eq('seller_id', sellerId);
        }

        const { data: sellerPosts, error: postsError } = await postsQuery;

        if (postsError) throw postsError;

        if (!sellerPosts || sellerPosts.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // Fetch products for each post
        const postsData = await Promise.all(
          sellerPosts.map(async (post) => {
            // Fetch products referenced in the post
            const { data: postProducts, error: productsError } = await supabase
              .from('products')
              .select(`
                id,
                name,
                price,
                discount_price,
                product_images (
                  id,
                  src,
                  alt
                )
              `)
              .in('id', post.product_ids || [])
              .eq('status', 'active')
              .limit(5);

            if (productsError) {
              console.error('Error fetching products:', productsError);
              return null;
            }

            if (!postProducts || postProducts.length === 0) {
              return null;
            }

            // Calculate discount percentage and format products
            const displayProducts = postProducts.slice(0, 5).map(product => ({
              id: product.id,
              image: product.product_images?.[0]?.src ? 
                getProductImageUrl(product.product_images[0].src) : 
                getProductImageUrl(),
              discount: product.discount_price ? 
                `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : 
                null,
              currentPrice: `$${product.discount_price || product.price}`,
              originalPrice: product.discount_price ? `$${product.price}` : null
            }));

            const seller = post.sellers;
            
            return {
              id: post.id,
              vendorData: {
                profilePic: getSellerLogoUrl(seller?.image_url),
                vendorName: seller?.name || 'Unknown Seller',
                verified: seller?.verified || false,
                followers: seller?.followers_count >= 1000 ? 
                  `${(seller.followers_count / 1000).toFixed(1)}K` : 
                  seller?.followers_count?.toString() || '0',
                publishedAt: post.created_at
              },
              title: post.title,
              postDescription: post.description || 'Check out our amazing products!',
              displayProducts,
              likeCount: post.like_count || 0,
              commentCount: post.comment_count || 0,
              shareCount: post.share_count || 0
            };
          })
        );

        // Filter out null values
        const validPosts = postsData.filter(post => post !== null);
        setPosts(validPosts);
      } catch (error) {
        console.error('Error fetching seller posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    // Use custom posts if provided, otherwise fetch from database
    if (customPosts && customPosts.length > 0) {
      setPosts(customPosts);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [sellerId, customPosts]);

  const handleFollowClick = () => {
    console.log('Follow button clicked for vendor');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full bg-white mb-4">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show nothing if no posts
  if (!posts || posts.length === 0) {
    return null;
  }

  // Display all posts from the database
  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="w-full bg-white mb-4">
          {/* SectionHeader for the post with vendor data */}
          <SectionHeader
            title={post.title}
            showVendorHeader={true}
            vendorData={post.vendorData}
            onFollowClick={handleFollowClick}
          />

          <PostCard
            title={post.title}
            postDescription={post.postDescription}
            displayProducts={post.displayProducts}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            shareCount={post.shareCount}
            onProductClick={onProductClick}
            postId={post.id}
          />
        </div>
      ))}
    </>
  );
};

export default VendorProductCarousel;