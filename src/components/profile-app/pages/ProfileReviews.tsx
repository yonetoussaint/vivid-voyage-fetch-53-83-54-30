import React, { useState } from 'react';
import { 
  Star, Search, Filter, MoreHorizontal, ThumbsUp, 
  ThumbsDown, Flag, Edit, Trash2, Package, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ProfileReviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [editingReview, setEditingReview] = useState<string | null>(null);

  const reviews = [
    {
      id: '1',
      productName: 'Wireless Earbuds Pro',
      productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop',
      seller: 'TechStore Pro',
      rating: 5,
      title: 'Excellent sound quality!',
      review: 'These earbuds exceeded my expectations. The sound quality is crystal clear, battery life is amazing, and they fit perfectly. Highly recommend for anyone looking for premium wireless earbuds.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      notHelpful: 1,
      sellerResponse: null
    },
    {
      id: '2',
      productName: 'Smart Watch Series 5',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      seller: 'Electronics Central',
      rating: 4,
      title: 'Great features, battery could be better',
      review: 'Love all the health tracking features and the display is beautiful. Only downside is the battery life - needs charging every day with heavy use. Overall very satisfied with the purchase.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      notHelpful: 2,
      sellerResponse: {
        message: 'Thank you for your review! We appreciate your feedback about battery life and will consider it for future improvements.',
        date: '2024-01-12'
      }
    },
    {
      id: '3',
      productName: 'Air Purifier',
      productImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
      seller: 'Home & Garden',
      rating: 5,
      title: 'Game changer for allergies',
      review: 'This air purifier has been a lifesaver during allergy season. Very quiet operation and I can definitely notice cleaner air. Easy to set up and maintain.',
      date: '2024-01-05',
      verified: true,
      helpful: 15,
      notHelpful: 0,
      sellerResponse: null
    },
    {
      id: '4',
      productName: 'Programming Guide',
      productImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop',
      seller: 'Book World',
      rating: 4,
      title: 'Comprehensive and well-written',
      review: 'Excellent resource for learning programming concepts. The examples are clear and well-explained. Would have liked more advanced topics covered.',
      date: '2023-12-28',
      verified: true,
      helpful: 6,
      notHelpful: 1,
      sellerResponse: null
    },
    {
      id: '5',
      productName: 'Bluetooth Speaker',
      productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
      seller: 'AudioTech Store',
      rating: 3,
      title: 'Decent but not exceptional',
      review: 'Sound quality is okay for the price. Build quality feels a bit cheap and the bass could be stronger. Works well for casual listening.',
      date: '2023-12-20',
      verified: true,
      helpful: 4,
      notHelpful: 3,
      sellerResponse: null
    }
  ];

  const [editReview, setEditReview] = useState({
    rating: 5,
    title: '',
    review: ''
  });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const reviewStats = {
    total: reviews.length,
    average: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    breakdown: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setEditReview({
        rating: review.rating,
        title: review.title,
        review: review.review
      });
      setEditingReview(reviewId);
    }
  };

  const handleSaveEdit = () => {
    // Save edit logic here
    console.log('Saving edit:', editReview);
    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId: string) => {
    // Delete review logic here
    console.log('Deleting review:', reviewId);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">My Reviews</h1>
              <p className="text-xs text-muted-foreground">
                {reviewStats.total} reviews • {reviewStats.average} average rating
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="bg-muted/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{rating}</span>
                </div>
                <div className="text-sm font-bold">{reviewStats.breakdown[rating]}</div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="px-4 space-y-3">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              {editingReview === review.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.productImage} 
                      alt={review.productName}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-sm">{review.productName}</h3>
                      <p className="text-xs text-muted-foreground">from {review.seller}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Rating</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 cursor-pointer ${
                            star <= editReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                          onClick={() => setEditReview(prev => ({ ...prev, rating: star }))}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Title</label>
                    <Input
                      value={editReview.title}
                      onChange={(e) => setEditReview(prev => ({ ...prev, title: e.target.value }))}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Review</label>
                    <Textarea
                      value={editReview.review}
                      onChange={(e) => setEditReview(prev => ({ ...prev, review: e.target.value }))}
                      className="text-sm mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingReview(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.productImage} 
                        alt={review.productName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-sm">{review.productName}</h3>
                        <p className="text-xs text-muted-foreground">from {review.seller}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-gray-200 text-gray-200'
                              }`} 
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs ml-2">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditReview(review.id)}>
                          <Edit className="w-3 h-3 mr-2" />
                          Edit Review
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="w-3 h-3 mr-2" />
                          Report Issue
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Review Content */}
                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">{review.review}</p>
                  </div>
                  
                  {/* Seller Response */}
                  {review.sellerResponse && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs bg-blue-200 text-blue-800">
                            {review.seller.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{review.seller}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.sellerResponse.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-blue-800">{review.sellerResponse.message}</p>
                    </div>
                  )}
                  
                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {review.helpful} helpful
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" />
                        {review.notHelpful} not helpful
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || ratingFilter !== 'all' 
                  ? 'No reviews match your search criteria' 
                  : "You haven't written any reviews yet"}
              </p>
              <Button>
                Browse Products to Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileReviews;