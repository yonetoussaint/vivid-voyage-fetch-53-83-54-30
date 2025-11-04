// components/product/tabs/ProductOverview.tsx
import React from 'react';

interface ProductOverviewProps {
  product: any;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Overview</h2>
      <p className="text-gray-700">{product?.description}</p>
      {/* Add more overview content here */}
    </div>
  );
};

export default ProductOverview;