// components/product/CustomerReviews.tsx
import React, { useMemo, useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import ErrorBoundary from './ErrorBoundary';
import { useMockReviews } from "@/hooks/useMockReviews";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem, { Review } from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';
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
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
  currentUserId?: string; // Add current user ID for ownership checks
}

const CustomerReviews = React.memo(({ productId, limit, currentUserId = 'user_1' }: CustomerReviewsProps) => {
  const {
    expandedReviews,
    expandedReplies,
    isLoading,
    error,
    replyingTo,
    replyText,
    itemBeingReplied,
    setReplyText,
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    finalReviews,
    summaryStats,
    handleLikeReview,     // Add to hook
    handleFollowUser,     // Add to hook
    handleUnfollowUser,   // Add to hook
    followedUsers,        // Add to hook
    handleEditReview,     // Add to hook
    handleDeleteReview,   // Add to hook
    handleReportReview,   // Add to hook
  } = useMockReviews({ productId, limit, currentUserId });

  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'likes'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterWithMedia, setFilterWithMedia] = useState(false);
  
  // Edit modal state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editComment, setEditComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Report modal state
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [reportDetails, setReportDetails] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Delete confirmation state
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...finalReviews];

    // Apply filters
    if (filterRating) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    if (filterVerified) {
      filtered = filtered.filter(review => review.verified_purchase);
    }
    if (filterWithMedia) {
      filtered = filtered.filter(review => review.media && review.media.length > 0);
    }

    // Apply sorting
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

  // Memoize the displayed reviews
  const displayedReviews = useMemo(() => 
    showAll ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 2), 
    [filteredAndSortedReviews, showAll]
  );

  // Memoize event handlers
  const memoizedHandleLikeReply = useCallback((replyId: string, reviewId: string) => {
    handleLikeReply(replyId, reviewId);
  }, [handleLikeReply]);

  const memoizedToggleReadMore = useCallback((reviewId: string) => {
    toggleReadMore(reviewId);
  }, [toggleReadMore]);

  const memoizedToggleShowMoreReplies = useCallback((reviewId: string) => {
    toggleShowMoreReplies(reviewId);
  }, [toggleShowMoreReplies]);

  const memoizedHandleCommentClick = useCallback((reviewId: string) => {
    handleCommentClick(reviewId);
  }, [handleCommentClick]);

  const memoizedHandleReplyToReply = useCallback((replyId: string, reviewId: string, userName: string) => {
    handleReplyToReply(replyId, reviewId, userName);
  }, [handleReplyToReply]);

  const memoizedHandleLikeReview = useCallback((reviewId: string) => {
    handleLikeReview(reviewId);
    toast({
      description: "Review liked",
      duration: 2000,
    });
  }, [handleLikeReview]);

  const memoizedHandleFollowUser = useCallback((userId: string, userName: string) => {
    handleFollowUser(userId);
    toast({
      description: `Following ${userName}`,
      duration: 2000,
    });
  }, [handleFollowUser]);

  const memoizedHandleUnfollowUser = useCallback((userId: string, userName: string) => {
    handleUnfollowUser(userId);
    toast({
      description: `Unfollowed ${userName}`,
      duration: 2000,
    });
  }, [handleUnfollowUser]);

  // Menu action handler
  const handleMenuAction = useCallback((reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => {
    const review = finalReviews.find(r => r.id === reviewId);
    if (!review) return;

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
        navigator.clipboard.writeText(`${window.location.origin}/product/${productId}/reviews/${reviewId}`);
        toast({
          title: "Link copied",
          description: "Review link copied to clipboard",
          duration: 3000,
        });
        break;
    }
  }, [finalReviews, handleShareClick, productId]);

  // Handle edit submit
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
    }
  }, [editingReview, editComment, handleEditReview]);

  // Handle delete confirm
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
    }
  }, [deletingReviewId, handleDeleteReview]);

  // Handle report submit
  const handleReportSubmit = useCallback(() => {
    if (reportingReviewId) {
      handleReportReview(reportingReviewId, reportReason, reportDetails);
      setIsReportModalOpen(false);
      setReportingReviewId(null);
      setReportReason('inappropriate');
      setReportDetails('');
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
        duration: 3000,
      });
    }
  }, [reportingReviewId, reportReason, reportDetails, handleReportReview]);

  const handleClearFilters = useCallback(() => {
    setFilterRating(null);
    setFilterVerified(false);
    setFilterWithMedia(false);
    setSortBy('recent');
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <div className="animate-pulse">
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="p-4 border-t">
            {[1, 2].map((i) => (
              <div key={i} className="mb-4 p-3 border rounded">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
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
      <div className="w-full bg-white">
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={fetchReviews}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        <ReviewsSummary stats={summaryStats} />

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
                  With photos/videos
                </Button>

                {(filterRating || filterVerified || filterWithMedia || sortBy !== 'recent') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-gray-500"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="py-2">
          <div className="space-y-2">
            {filteredAndSortedReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ color: '#666' }}>
                  No reviews match your filters.
                </p>
                <Button
                  variant="link"
                  onClick={handleClearFilters}
                  className="mt-1"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              displayedReviews.map((review: Review) => (
                <div key={review.id} className="px-2">
                  <ReviewItem
                    review={review}
                    expandedReviews={expandedReviews}
                    expandedReplies={expandedReplies}
                    onToggleReadMore={memoizedToggleReadMore}
                    onToggleShowMoreReplies={memoizedToggleShowMoreReplies}
                    onCommentClick={memoizedHandleCommentClick}
                    onShareClick={handleShareClick}
                    onLikeReview={memoizedHandleLikeReview}
                    onFollowUser={memoizedHandleFollowUser}
                    onUnfollowUser={memoizedHandleUnfollowUser}
                    isFollowing={followedUsers.has(review.user_name || '')}
                    onLikeReply={memoizedHandleLikeReply}
                    onReplyToReply={memoizedHandleReplyToReply}
                    onMenuAction={handleMenuAction}
                    currentUserId={currentUserId}
                    isOwner={review.user_id === currentUserId}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {filteredAndSortedReviews.length > 2 && (
          <div className="px-2 pb-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `View All ${filteredAndSortedReviews.length} Reviews`}
            </Button>
          </div>
        )}

        <ReplyBar
          replyingTo={replyingTo}
          replyingToName={itemBeingReplied?.userName}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSubmitReply={handleSubmitReply}
          onCancelReply={handleCancelReply}
        />

        {/* Edit Review Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
              <DialogDescription>
                Make changes to your review here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-comment">Review</Label>
                <Textarea
                  id="edit-comment"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Report Review Modal */}
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Report Review</DialogTitle>
              <DialogDescription>
                Help us understand the issue. Your report will be reviewed by our team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Reason for reporting</Label>
                <RadioGroup value={reportReason} onValueChange={setReportReason}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inappropriate" id="inappropriate" />
                    <Label htmlFor="inappropriate">Inappropriate content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spam" id="spam" />
                    <Label htmlFor="spam">Spam or misleading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="harassment" id="harassment" />
                    <Label htmlFor="harassment">Harassment or bullying</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fake" id="fake" />
                    <Label htmlFor="fake">Fake review</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-details">Additional details (optional)</Label>
                <Textarea
                  id="report-details"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide more context about this issue..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReportSubmit}>
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
});

CustomerReviews.displayName = 'CustomerReviews';

export default CustomerReviews;