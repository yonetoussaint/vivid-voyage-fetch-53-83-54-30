// components/product/tabs/ProductVariants.tsx
import React from 'react';

interface ProductVariantsProps {
  product: any;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ product }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Variants</h2>
      {/* Add variants content here */}
    </div>
  );
};

export default ProductVariants;