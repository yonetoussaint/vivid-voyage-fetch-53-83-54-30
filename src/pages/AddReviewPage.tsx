// pages/AddReviewPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Camera, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useProduct } from "@/hooks/useProduct";

const AddReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { submitReview } = useProductReviews({ productId });
  const { data: product } = useProduct(productId!);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        rating,
        title,
        comment,
        images: selectedImages // You'll need to handle image upload to your backend
      });
      
      // Navigate back to product page after successful submission
      navigate(`/product/${productId}`, { 
        state: { reviewSubmitted: true } 
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Write a Review</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Product Info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          {product?.product_images?.[0] && (
            <img
              src={product.product_images[0].src}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h2 className="font-medium text-gray-900">{product?.name}</h2>
            <p className="text-sm text-gray-500">Share your experience with this product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-900">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className="w-10 h-10 md:w-12 md:h-12"
                    fill={(hoverRating || rating) >= star ? '#FBBF24' : 'none'}
                    stroke={(hoverRating || rating) >= star ? '#FBBF24' : '#D1D5DB'}
                    strokeWidth="1.5"
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 ? 'Tap to rate' : `${rating} star${rating > 1 ? 's' : ''} selected`}
            </p>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-base font-medium text-gray-900">
              Review Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 text-right">{title.length}/100</p>
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-base font-medium text-gray-900">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? What was your experience like?"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
              maxLength={2000}
              required
            />
            <p className="text-xs text-gray-500 text-right">{comment.length}/2000</p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-900">
              Add Photos (Optional)
            </label>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {selectedImages.length < 5 && (
              <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <Camera className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Add up to 5 photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-xs text-gray-500">
              {selectedImages.length}/5 photos uploaded
            </p>
          </div>

          {/* Review Guidelines */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Review Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Focus on the product's features and quality</li>
              <li>Share your honest experience</li>
              <li>Be respectful and constructive</li>
              <li>Avoid sharing personal information</li>
              <li>Don't include promotional content</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-200">
            <div className="max-w-2xl mx-auto">
              <Button
                type="submit"
                className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                By submitting, you agree to our Review Guidelines
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewPage;