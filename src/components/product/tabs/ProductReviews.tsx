// components/product/tabs/ProductReviews.tsx
import React from 'react';

interface ProductReviewsProps {
  product: any;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Reviews</h2>
      {/* Add reviews content here */}
    </div>
  );
};

export default ProductReviews;