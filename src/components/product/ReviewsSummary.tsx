import { memo } from 'react';

export const ReviewsSummary = memo(({
  productId,
  summaryStats,
  reviews,
  onFilterChange,
}) => {
  const { averageRating, totalReviews, ratingCounts } = summaryStats;

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Reviews</h3>
      
      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Rating Bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <button
              key={rating}
              onClick={() => onFilterChange?.([{ id: 'rating', value: rating, label: 'Rating', displayValue: `${rating} Stars` }])}
              className="flex items-center gap-2 w-full group"
            >
              <span className="text-sm text-gray-600 w-8">{rating} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 group-hover:bg-yellow-500 transition-colors"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ReviewsSummary.displayName = 'ReviewsSummary';
export default ReviewsSummary;