// components/product/CustomerReviews.tsx
import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ErrorBoundary from './ErrorBoundary';
import { useMockProductReviews } from "@/hooks/useMockProductReviews";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem, { Review } from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';
// Comment out unused imports
// import Lightbox from '@/components/shared/Lightbox';
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

// Comment out unused hooks and libs
// import { useLocalStorage } from "@/hooks/useLocalStorage";
// import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
// import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
// import { trackEvent } from "@/lib/analytics";
// import { generateReviewStructuredData } from "@/lib/seo";

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
  currentUserId?: string;
}

const CustomerReviews = React.memo(({ productId, currentUserId = 'user_1' }: CustomerReviewsProps) => {
  // Initialize hook with defaults
  const hookResult = useMockReviews({ productId, currentUserId });
  
  // Destructure with safe defaults
  const {
    expandedReviews = new Set(),
    expandedReplies = new Set(),
    isLoading = false,
    error = null,
    replyingTo = null,
    replyText = '',
    itemBeingReplied = null,
    setReplyText = () => {},
    handleLikeReply = () => {},
    toggleReadMore = () => {},
    toggleShowMoreReplies = () => {},
    handleCommentClick = () => {},
    handleReplyToReply = () => {},
    handleShareClick = () => {},
    handleSubmitReply = () => {},
    handleCancelReply = () => {},
    fetchReviews = () => {},
    finalReviews = [],
    summaryStats = {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    },
    handleLikeReview = () => {},
    handleFollowUser = () => {},
    handleUnfollowUser = () => {},
    followedUsers = new Set(),
    handleEditReview = () => {},
    handleDeleteReview = () => {},
    handleReportReview = () => {},
    handleEditReply = () => {},
    handleDeleteReply = () => {},
    handleReportReply = () => {},
    loadMoreReplies = () => {},
    replyPagination = {},
    page = 1,
    hasMore = true,
  } = hookResult;

  // Comment out localStorage
  // const [replyDraft, setReplyDraft] = useLocalStorage(`reply_draft_${productId}`, '');
  // const [reviewDraft, setReviewDraft] = useLocalStorage(`review_draft_${productId}`, '');
  
  // Replace with regular useState
  const [replyDraft, setReplyDraft] = useState('');
  const [reviewDraft, setReviewDraft] = useState('');

  // Comment out Lightbox state
  // const [lightboxOpen, setLightboxOpen] = useState(false);
  // const [lightboxImages, setLightboxImages] = useState<Array<{ url: string; alt?: string }>>([]);
  // const [lightboxIndex, setLightboxIndex] = useState(0);

  // Simple scroll handler instead of useIntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Simple scroll handler
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage(p => p + 1);
          fetchReviews(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    const element = loadMoreRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasMore, isLoading, fetchReviews, currentPage]);

  // Comment out keyboard shortcuts
  // useKeyboardShortcut('Escape', () => {...});

  // Simple Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsReportModalOpen(false);
        setIsEditReplyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Simple Cmd+Enter handler
  useEffect(() => {
    const handleCmdEnter = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (replyText) handleSubmitReply();
        if (editComment) handleEditSubmit();
        if (editingReply?.comment) handleEditReplySubmit();
      }
    };
    window.addEventListener('keydown', handleCmdEnter);
    return () => window.removeEventListener('keydown', handleCmdEnter);
  }, [replyText, editComment, editingReply, handleSubmitReply, handleEditSubmit, handleEditReplySubmit]);

  // Auto-save drafts (simplified)
  useEffect(() => {
    if (replyText) {
      const timer = setTimeout(() => {
        setReplyDraft(replyText);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [replyText]);

  // Load draft on mount
  useEffect(() => {
    if (replyDraft && !replyText) {
      setReplyText(replyDraft);
      toast({
        description: "Draft restored",
        duration: 3000,
      });
    }
  }, []);

  // Comment out media lightbox handler
  const handleMediaClick = useCallback((media: Array<{ url: string; alt?: string }>, index: number) => {
    // Open in new tab instead of lightbox
    window.open(media[index].url, '_blank');
    // Comment out tracking
    // trackEvent('review_lightbox_opened', { productId, mediaCount: media.length });
  }, [productId]);

  // Comment out SEO structured data
  // useEffect(() => {...}, [finalReviews, productId]);

  // Comment out analytics tracking
  const handleReviewView = useCallback((reviewId: string) => {
    // trackEvent('review_viewed', { reviewId, productId });
    // No-op
  }, [productId]);

  const handleReviewHelpful = useCallback((reviewId: string) => {
    // trackEvent('review_helpful_marked', { reviewId, productId });
    toast({
      description: "Marked as helpful",
      duration: 2000,
    });
  }, [productId]);

  // UI state
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'likes'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterWithMedia, setFilterWithMedia] = useState(false);

  // Modal states
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editComment, setEditComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [reportDetails, setReportDetails] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReply, setEditingReply] = useState<{ id: string; reviewId: string; comment: string } | null>(null);
  const [isEditReplyModalOpen, setIsEditReplyModalOpen] = useState(false);
  const [moderationQueue, setModerationQueue] = useState<Array<{ id: string; type: 'review' | 'reply'; reason: string }>>([]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...finalReviews];

    if (filterRating) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    if (filterVerified) {
      filtered = filtered.filter(review => review.verified_purchase);
    }
    if (filterWithMedia) {
      filtered = filtered.filter(review => review.media && review.media.length > 0);
    }

    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'likes':
        filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
    }

    return filtered;
  }, [finalReviews, sortBy, filterRating, filterVerified, filterWithMedia]);

  const displayedReviews = useMemo(() => 
    showAll ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 5), 
    [filteredAndSortedReviews, showAll]
  );

  // Memoized handlers
  const memoizedHandleLikeReply = useCallback((replyId: string, reviewId: string) => {
    handleLikeReply(replyId, reviewId);
  }, [handleLikeReply]);

  const memoizedHandleEditReply = useCallback((replyId: string, reviewId: string, comment: string) => {
    setEditingReply({ id: replyId, reviewId, comment });
    setIsEditReplyModalOpen(true);
  }, []);

  const handleEditReplySubmit = useCallback(() => {
    if (editingReply) {
      handleEditReply(editingReply.id, editingReply.reviewId, editingReply.comment);
      setIsEditReplyModalOpen(false);
      setEditingReply(null);
      toast({
        description: "Reply updated",
        duration: 3000,
      });
    }
  }, [editingReply, handleEditReply]);

  const memoizedHandleDeleteReply = useCallback((replyId: string, reviewId: string) => {
    handleDeleteReply(replyId, reviewId);
    toast({
      description: "Reply deleted",
      duration: 3000,
      variant: "destructive",
    });
  }, [handleDeleteReply]);

  const memoizedHandleReportReply = useCallback((replyId: string, reviewId: string, reason: string) => {
    handleReportReply(replyId, reviewId, reason);
    setModerationQueue(prev => [...prev, { id: replyId, type: 'reply', reason }]);
    toast({
      title: "Reply reported",
      description: "Thank you for helping keep our community safe",
      duration: 3000,
    });
  }, [handleReportReply]);

  const memoizedHandleLikeReview = useCallback((reviewId: string) => {
    handleLikeReview(reviewId);
    // trackEvent('review_liked', { reviewId, productId });
  }, [handleLikeReview, productId]);

  const memoizedHandleFollowUser = useCallback((userId: string, userName: string) => {
    handleFollowUser(userId);
    // trackEvent('user_followed', { userId, productId });
    toast({
      description: `Following ${userName}`,
      duration: 2000,
    });
  }, [handleFollowUser, productId]);

  const memoizedHandleUnfollowUser = useCallback((userId: string, userName: string) => {
    handleUnfollowUser(userId);
    // trackEvent('user_unfollowed', { userId, productId });
    toast({
      description: `Unfollowed ${userName}`,
      duration: 2000,
    });
  }, [handleUnfollowUser, productId]);

  const handleMenuAction = useCallback((reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => {
    const review = finalReviews.find(r => r.id === reviewId);
    if (!review) return;

    // trackEvent('review_menu_action', { reviewId, action, productId });

    switch(action) {
      case 'edit':
        setEditingReview(review);
        setEditComment(review.comment || '');
        setIsEditModalOpen(true);
        break;
      case 'delete':
        setDeletingReviewId(reviewId);
        setIsDeleteModalOpen(true);
        break;
      case 'report':
        setReportingReviewId(reviewId);
        setIsReportModalOpen(true);
        break;
      case 'share':
        handleShareClick(reviewId);
        const url = `${window.location.origin}/product/${productId}/reviews/${reviewId}`;
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Review link copied to clipboard",
          duration: 3000,
        });
        break;
    }
  }, [finalReviews, handleShareClick, productId]);

  const handleEditSubmit = useCallback(() => {
    if (editingReview) {
      handleEditReview(editingReview.id, editComment);
      setIsEditModalOpen(false);
      setEditingReview(null);
      setEditComment('');
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated",
        duration: 3000,
      });
      // trackEvent('review_updated', { reviewId: editingReview.id, productId });
    }
  }, [editingReview, editComment, handleEditReview, productId]);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingReviewId) {
      handleDeleteReview(deletingReviewId);
      setIsDeleteModalOpen(false);
      setDeletingReviewId(null);
      toast({
        title: "Review deleted",
        description: "Your review has been permanently deleted",
        duration: 3000,
        variant: "destructive",
      });
      // trackEvent('review_deleted', { reviewId: deletingReviewId, productId });
    }
  }, [deletingReviewId, handleDeleteReview, productId]);

  const handleReportSubmit = useCallback(() => {
    if (reportingReviewId) {
      handleReportReview(reportingReviewId, reportReason, reportDetails);
      setModerationQueue(prev => [...prev, { id: reportingReviewId, type: 'review', reason: reportReason }]);
      setIsReportModalOpen(false);
      setReportingReviewId(null);
      setReportReason('inappropriate');
      setReportDetails('');
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
        duration: 3000,
      });
      // trackEvent('review_reported', { reviewId: reportingReviewId, reason: reportReason, productId });
    }
  }, [reportingReviewId, reportReason, reportDetails, handleReportReview, productId]);

  const handleClearFilters = useCallback(() => {
    setFilterRating(null);
    setFilterVerified(false);
    setFilterWithMedia(false);
    setSortBy('recent');
    // trackEvent('reviews_filters_cleared', { productId });
  }, [productId]);

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className="w-full bg-white">
        <div className="animate-pulse p-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => fetchReviews(1)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        {/* Remove structured data script */}
        {/* <script type="application/ld+json">...</script> */}

        <ReviewsSummary stats={summaryStats} />

        {/* Moderation queue indicator (admin only) */}
        {currentUserId === 'admin' && moderationQueue.length > 0 && (
          <div className="px-2 py-3 bg-yellow-50 border-l-4 border-yellow-400 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{moderationQueue.length}</Badge>
                <span className="text-sm font-medium">Items pending moderation</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setModerationQueue([])}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        {finalReviews.length > 0 && (
          <div className="px-2 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setFilterRating(null)}>All</TabsTrigger>
                  <TabsTrigger value="5" onClick={() => setFilterRating(5)}>5★</TabsTrigger>
                  <TabsTrigger value="4" onClick={() => setFilterRating(4)}>4★</TabsTrigger>
                  <TabsTrigger value="3" onClick={() => setFilterRating(3)}>3★</TabsTrigger>
                  <TabsTrigger value="2" onClick={() => setFilterRating(2)}>2★</TabsTrigger>
                  <TabsTrigger value="1" onClick={() => setFilterRating(1)}>1★</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterVerified(!filterVerified)}
                  className={filterVerified ? 'bg-blue-50 border-blue-200' : ''}
                >
                  Verified
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterWithMedia(!filterWithMedia)}
                  className={filterWithMedia ? 'bg-blue-50 border-blue-200' : ''}
                >
                  With media
                </Button>

                {(filterRating || filterVerified || filterWithMedia || sortBy !== 'recent') && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews list */}
        <div className="py-2">
          <div className="space-y-2">
            {filteredAndSortedReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews match your filters.</p>
                <Button variant="link" onClick={handleClearFilters} className="mt-1">
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                {displayedReviews.map((review: Review) => (
                  <div key={review.id} className="px-2">
                    <ReviewItem
                      review={review}
                      expandedReviews={expandedReviews}
                      expandedReplies={expandedReplies}
                      onToggleReadMore={toggleReadMore}
                      onToggleShowMoreReplies={toggleShowMoreReplies}
                      onCommentClick={handleCommentClick}
                      onShareClick={handleShareClick}
                      onLikeReview={memoizedHandleLikeReview}
                      onFollowUser={memoizedHandleFollowUser}
                      onUnfollowUser={memoizedHandleUnfollowUser}
                      isFollowing={followedUsers?.has(review.user_name || '') ?? false}
                      onLikeReply={memoizedHandleLikeReply}
                      onEditReply={memoizedHandleEditReply}
                      onDeleteReply={memoizedHandleDeleteReply}
                      onReportReply={memoizedHandleReportReply}
                      onReplyToReply={handleReplyToReply}
                      onMenuAction={handleMenuAction}
                      onMediaClick={handleMediaClick}
                      onReviewView={handleReviewView}
                      onMarkHelpful={handleReviewHelpful}
                      currentUserId={currentUserId}
                      isOwner={review.user_id === currentUserId}
                      loadMoreReplies={(reviewId) => loadMoreReplies(reviewId)}
                      replyPagination={replyPagination?.[review.id] ?? { page: 1, hasMore: false }}
                    />
                  </div>
                ))}

                {/* Infinite scroll trigger */}
                {!showAll && hasMore && (
                  <div ref={loadMoreRef} className="py-4 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Show more/less button */}
        {filteredAndSortedReviews.length > 5 && (
          <div className="px-2 pb-2">
            <Button variant="outline" className="w-full" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : `View All ${filteredAndSortedReviews.length} Reviews`}
            </Button>
          </div>
        )}

        {/* Reply bar with draft indicator */}
        <ReplyBar
          replyingTo={replyingTo}
          replyingToName={itemBeingReplied?.userName}
          replyText={replyText}
          onReplyTextChange={(text) => {
            setReplyText(text);
            if (text) setReplyDraft(text);
          }}
          onSubmitReply={() => {
            handleSubmitReply();
            setReplyDraft('');
          }}
          onCancelReply={() => {
            handleCancelReply();
            setReplyDraft('');
          }}
          draftExists={!!replyDraft}
        />

        {/* Remove Lightbox Gallery */}
        {/* <Lightbox ... /> */}

        {/* Modals remain unchanged */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          {/* ... */}
        </Dialog>

        <Dialog open={isEditReplyModalOpen} onOpenChange={setIsEditReplyModalOpen}>
          {/* ... */}
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          {/* ... */}
        </Dialog>

        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          {/* ... */}
        </Dialog>
      </div>
    </ErrorBoundary>
  );
});

CustomerReviews.displayName = 'CustomerReviews';

export default CustomerReviews;