import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, MoreHorizontal, Store, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from './SectionHeader';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import VendorPostComments from './VendorPostComments';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import ReactionButton from '@/components/shared/ReactionButton';
import { useAuth } from '@/contexts/auth/AuthContext';
import PostMenuPanel from './PostMenuPanel';

// Type definitions
interface DisplayProduct {
  id: string;
  image: string;
  discount: string | null;
  currentPrice: string;
  originalPrice: string | null;
}

interface VendorData {
  sellerId: string;
  profilePic: string;
  vendorName: string;
  verified: boolean;
  followers: string;
  publishedAt: string;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  vendorData: VendorData;
  title: string;
  postDescription: string;
  displayProducts: DisplayProduct[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

interface PostCardProps {
  title: string;
  postDescription: string;
  displayProducts: DisplayProduct[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  onProductClick?: (productId: string) => void;
  postId: string;
}

interface VendorProductCarouselProps {
  title: string;
  products: any[];
  onProductClick?: (productId: string) => void;
  posts?: Post[];
  sellerId?: string;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'Please try refreshing the page'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PostCard: React.FC<PostCardProps> = ({
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
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const renderProductImage = (product: DisplayProduct, index: number) => {
    const safeImage = product.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";

    return (
      <div
        key={product.id || index}
        className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
      >
        <div className="relative aspect-square">
          <img
            src={safeImage}
            alt="Product"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
            }}
          />
          {product.discount && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
              {product.discount} OFF
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="w-full flex-shrink-0 overflow-hidden">
        {/* Post Description */}
        <div className="px-3 py-2 text-gray-800 text-sm">
          <p className="whitespace-pre-line line-clamp-3">{postDescription}</p>
        </div>

        {/* Products Display */}
        <div className="relative w-full px-3 py-2">
          {displayProducts.length === 1 && (
            <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
              {renderProductImage(displayProducts[0], 0)}
            </div>
          )}

          {displayProducts.length === 2 && (
            <div className="flex justify-between gap-2">
              {displayProducts.map((product, index) => renderProductImage(product, index))}
            </div>
          )}

          {displayProducts.length === 3 && (
  <div className="grid grid-cols-3 gap-2">
    {displayProducts.map((product, index) => renderProductImage(product, index))}
  </div>
)}

          {displayProducts.length === 4 && (
            <div className="grid grid-cols-2 gap-2">
              {displayProducts.map((product, index) => renderProductImage(product, index))}
            </div>
          )}

          {displayProducts.length >= 5 && (
            <div className="grid grid-cols-2 gap-2">
              {displayProducts.slice(0, 3).map((product, index) => renderProductImage(product, index))}

              {displayProducts[3] && (
                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow relative">
                  <div className="relative aspect-square">
                    <img
                      src={displayProducts[3].image}
                      alt="Product"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
                      }}
                    />
                    {displayProducts[3].discount && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                        {displayProducts[3].discount} OFF
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{displayProducts.length - 4}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Facebook style engagement stats */}
        <div className="px-3 py-1.5 flex items-center justify-between">
          <StackedReactionIcons 
            count={currentLikeCount} 
            size="md" 
            className="gap-1 text-xs text-gray-500" 
          />
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{commentCount} comments</span>
            <span>{shareCount} shares</span>
          </div>
        </div>

        {/* Enhanced Social Buttons */}
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
              <Send className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
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
    </ErrorBoundary>
  );
};

const VendorProductCarousel: React.FC<VendorProductCarouselProps> = ({
  title,
  products,
  onProductClick,
  posts: customPosts,
  sellerId
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticUpdates, setOptimisticUpdates] = useState<{[key: string]: boolean}>({});
  const { user, checkIfFollowing, toggleFollowSeller, followedSellers } = useAuth();
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Handle three dots click
  const handleThreeDotsClick = (post: Post) => {
    console.log('✅ Three dots clicked for post:', post.id);
    setSelectedPost(post);
    setShowPostMenu(true);
  };

  // Handle menu close
  const handleCloseMenu = () => {
    console.log('✅ Closing post menu');
    setShowPostMenu(false);
    setSelectedPost(null);
  };

  // Menu action handlers
  const handleSavePost = () => {
    console.log('💾 Saving post:', selectedPost?.id);
    // Add your save post logic here
  };

  const handleHidePost = () => {
    console.log('👁️ Hiding post:', selectedPost?.id);
    // Add your hide post logic here
  };

  const handleReportPost = () => {
    console.log('🚩 Reporting post:', selectedPost?.id);
    // Add your report post logic here
  };

  const handleTurnOnNotifications = () => {
    console.log('🔔 Turning on notifications for post:', selectedPost?.id);
    // Add your notification logic here
  };

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/post/${selectedPost?.id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      console.log('📋 Link copied to clipboard:', postUrl);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleSnoozeUser = () => {
    console.log('⏰ Snoozing user:', selectedPost?.vendorData.vendorName);
    // Add your snooze logic here
  };

  const handleHideAllFromUser = () => {
    console.log('🙈 Hiding all from user:', selectedPost?.vendorData.vendorName);
    // Add your hide all logic here
  };

  const handleBlockUser = () => {
    console.log('🚫 Blocking user:', selectedPost?.vendorData.vendorName);
    // Add your block logic here
  };

  // Helper function to get seller logo URL from Supabase storage
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

    try {
      const { data } = supabase.storage
        .from('seller-logos')
        .getPublicUrl(imagePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting seller logo URL:', error);
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    }
  };

  // Helper function to get product image URL from Supabase storage
  const getProductImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";

    try {
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(imagePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting product image URL:', error);
      return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
    }
  };

  // SIMPLIFIED: Check if user is following a seller using cache only
  const isFollowingSeller = (sellerId: string): boolean => {
    return followedSellers.includes(sellerId);
  };

  // Handle follow button click with optimistic updates
  const handleFollowClick = async (sellerId: string, sellerName: string, currentFollowStatus: boolean) => {
    console.log('Follow button clicked:', { sellerId, sellerName, currentFollowStatus });

    const optimisticKey = `${sellerId}-${Date.now()}`;
    setOptimisticUpdates(prev => ({ ...prev, [optimisticKey]: true }));

    const previousPosts = [...posts];

    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.vendorData.sellerId === sellerId) {
          const currentFollowers = post.vendorData.followers.includes('K') 
            ? parseFloat(post.vendorData.followers) * 1000
            : parseInt(post.vendorData.followers) || 0;

          const newFollowers = currentFollowStatus ? currentFollowers - 1 : currentFollowers + 1;
          const formattedFollowers = newFollowers >= 1000 
            ? `${(newFollowers / 1000).toFixed(1)}K` 
            : newFollowers.toString();

          return {
            ...post,
            vendorData: {
              ...post.vendorData,
              isFollowing: !currentFollowStatus,
              followers: formattedFollowers
            }
          };
        }
        return post;
      })
    );

    try {
      const result = await toggleFollowSeller(sellerId, sellerName, currentFollowStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
      setPosts(previousPosts);
      alert('Error updating follow status. Please try again.');
    } finally {
      setOptimisticUpdates(prev => {
        const newState = { ...prev };
        delete newState[optimisticKey];
        return newState;
      });
    }
  };

  // Fetch seller posts and products data from database
  useEffect(() => {
    if (customPosts && customPosts.length > 0) {
      setPosts(customPosts);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

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

        if (postsError) {
          console.error('Error fetching seller posts:', postsError);
          setPosts([]);
          setLoading(false);
          return;
        }

        if (!sellerPosts || sellerPosts.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsData = await Promise.all(
          sellerPosts.map(async (post) => {
            if (!post.product_ids || post.product_ids.length === 0) {
              return null;
            }

            const { data: postProducts, error: productsError } = await supabase
              .from('products')
              .select('id, name, price, discount_price')
              .in('id', post.product_ids)
              .eq('status', 'active')
              .limit(5);

            if (productsError || !postProducts) {
              console.error('Error fetching products:', productsError);
              return null;
            }

            const { data: productImages, error: imagesError } = await supabase
              .from('product_images')
              .select('product_id, src, alt')
              .in('product_id', postProducts.map(p => p.id));

            if (imagesError) {
              console.error('Error fetching product images:', imagesError);
            }

            // Use cached follow status instead of API call
            const isFollowing = isFollowingSeller(post.sellers.id);

            const displayProducts = postProducts.map(product => {
              const productImage = productImages?.find(img => img.product_id === product.id);

              let imageUrl;
              if (productImage?.src) {
                if (productImage.src.startsWith('http')) {
                  imageUrl = productImage.src;
                } else {
                  imageUrl = getProductImageUrl(productImage.src);
                }
              } else {
                imageUrl = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
              }

              return {
                id: product.id,
                image: imageUrl,
                discount: product.discount_price ? 
                  `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : 
                  null,
                currentPrice: `$${product.discount_price || product.price}`,
                originalPrice: product.discount_price ? `$${product.price}` : null
              };
            });

            const seller = post.sellers;

            return {
              id: post.id,
              vendorData: {
                sellerId: seller.id,
                profilePic: getSellerLogoUrl(seller?.image_url),
                vendorName: seller?.name || 'Unknown Seller',
                verified: seller?.verified || false,
                followers: seller?.followers_count >= 1000 ? 
                  `${(seller.followers_count / 1000).toFixed(1)}K` : 
                  seller?.followers_count?.toString() || '0',
                publishedAt: post.created_at,
            
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

        const validPosts = postsData.filter((post): post is Post => post !== null);
        setPosts(validPosts);
      } catch (error) {
        console.error('Error fetching seller posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId, customPosts, followedSellers]); // Use followedSellers as dependency

  // Show loading state
  if (loading) {
    const skeletonProductCount = sellerId ? 5 : 1;

    return (
      <ErrorBoundary>
        {[1].map((index) => (
          <div key={`skeleton-${index}`} className="w-full bg-white mb-4">
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

            <div className="px-3 py-2">
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>

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

            <div className="flex items-center justify-between px-2 py-1 gap-3">
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </ErrorBoundary>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      {posts.map((post) => (
        <div key={post.id} className="w-full bg-white mb-4">
          <SectionHeader
            title={post.title}
            showVendorHeader={true}
            vendorData={post.vendorData}
            onFollowClick={() => handleFollowClick(
              post.vendorData.sellerId, 
              post.vendorData.vendorName, 
              post.vendorData.isFollowing || false
            )}
            showThreeDots={true}
            onThreeDotsClick={() => handleThreeDotsClick(post)}
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

      {/* Post Menu Panel */}
      <PostMenuPanel
        isOpen={showPostMenu}
        onClose={handleCloseMenu}
        onSavePost={handleSavePost}
        onHidePost={handleHidePost}
        onReportPost={handleReportPost}
        onTurnOnNotifications={handleTurnOnNotifications}
        onCopyLink={handleCopyLink}
        onSnoozeUser={handleSnoozeUser}
        onHideAllFromUser={handleHideAllFromUser}
        onBlockUser={handleBlockUser}
        userName={selectedPost?.vendorData.vendorName}
        postId={selectedPost?.id}
      />

      {/* Debug button - remove in production */}
      <button 
        onClick={() => setShowPostMenu(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50"
        style={{ display: 'none' }} // Hidden by default, change to 'block' for testing
      >
        Test Menu
      </button>
    </ErrorBoundary>
  );
};

export default VendorProductCarousel;