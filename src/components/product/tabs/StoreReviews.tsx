// components/product/tabs/StoreReviews.tsx
import React from 'react';

interface StoreReviewsProps {
  product: any;
}

const StoreReviews: React.FC<StoreReviewsProps> = ({ product }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Store Reviews</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <div className="flex text-yellow-400">
                {"★".repeat(5)}
              </div>
            </div>
          </div>
          <p className="text-gray-700">Great store! Fast shipping and excellent customer service.</p>
          <span className="text-sm text-gray-500">2 days ago</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <h3 className="font-semibold">Jane Smith</h3>
              <div className="flex text-yellow-400">
                {"★".repeat(4)}
              </div>
            </div>
          </div>
          <p className="text-gray-700">Good products and reliable seller. Would buy again.</p>
          <span className="text-sm text-gray-500">1 week ago</span>
        </div>
      </div>
    </div>
  );
};

export default StoreReviews;