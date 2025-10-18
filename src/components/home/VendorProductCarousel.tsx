import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, MoreHorizontal, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from './SectionHeader';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import VendorPostComments from './VendorPostComments';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import ReactionButton from '@/components/shared/ReactionButton';

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
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const [sortBy, setSortBy] = useState<'relevant' | 'newest'>('relevant');
  const carouselRef = useRef(null);

  const handleReactionChange = (reactionId: string | null) => {
    const hadReaction = hasReacted;
    setHasReacted(reactionId !== null);
    
    if (!hadReaction && reactionId) {
      setCurrentLikeCount(prev => prev + 1);
    } else if (hadReaction && !reactionId) {
      setCurrentLikeCount(prev => prev - 1);
    }
  };

  const handleComment = () => setShowCommentsPanel(true);
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
      <div className="px-3 py-1.5 flex items-center justify-between">
        <StackedReactionIcons count={currentLikeCount} size="md" className="gap-1 text-xs text-gray-500" />
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* Enhanced Social Buttons - Moved to Bottom */}
      <div className="flex items-center justify-between px-2 py-1 relative gap-3">
        <div className="flex-1">
          <ReactionButton
            onReactionChange={handleReactionChange}
            buttonClassName="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full h-8"
            size="md"
          />
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
        headerContent={
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-gray-900 text-[15px]">
              Comments ({commentCount})
            </h3>
            <button 
              onClick={() => setSortBy(sortBy === 'relevant' ? 'newest' : 'relevant')}
              className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900"
            >
              {sortBy === 'relevant' ? 'Most relevant' : 'Newest first'}
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        }
        className="p-0"
        preventBodyScroll={true}
      >
        <VendorPostComments 
          postId={postId} 
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
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
    // Skip fetching if custom posts are provided
    if (customPosts && customPosts.length > 0) {
      setPosts(customPosts);
      setLoading(false);
      return;
    }

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
                product_images!product_images_product_id_fkey (
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

    fetchData();
  }, [sellerId, customPosts]);

  const handleFollowClick = () => {
    console.log('Follow button clicked for vendor');
  };

  // Show loading state with proper skeleton structure
  if (loading) {
    // Determine product count from sellerId or use default
    const skeletonProductCount: number = sellerId ? 5 : 1;
    
    // Show only 1 skeleton post by default
    return (
      <>
        {[1].map((index) => (
          <div key={`skeleton-${index}`} className="w-full bg-white mb-4">
            {/* Section Header Skeleton */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Post Description Skeleton */}
            <div className="px-3 py-2">
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Products Display Skeleton - Varies by count */}
            <div className="relative w-full px-3 py-2">
              {skeletonProductCount === 1 && (
                <div className="w-full rounded-lg overflow-hidden">
                  <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                </div>
              )}

              {skeletonProductCount === 2 && (
                <div className="flex justify-between gap-2">
                  <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                </div>
              )}

              {skeletonProductCount === 3 && (
                <div className="flex gap-2">
                  <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                </div>
              )}

              {skeletonProductCount === 4 && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                </div>
              )}

              {skeletonProductCount >= 5 && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="relative">
                    <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                      <div className="w-12 h-8 bg-white/30 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Stats Skeleton */}
            <div className="px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex items-center -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="h-3 w-8 ml-1 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Social Buttons Skeleton */}
            <div className="flex items-center justify-between px-2 py-1 gap-3">
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </>
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