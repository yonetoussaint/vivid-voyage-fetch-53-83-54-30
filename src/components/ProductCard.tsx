import React, { useState } from "react";
import { Star } from "lucide-react"; // Import the Star icon

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  sold_count?: number;
  rating?: number;
  product_images?: Array<{ src: string }>;
  flash_start_time?: string;
  category?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
  renderTag?: (tag: string) => React.ReactNode;
  aspectRatio?: 'square' | 'auto';
  showTags?: boolean;
  singleLineName?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  renderTag,
  aspectRatio = 'auto',
  showTags = true,
  singleLineName = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const soldCount = product.sold_count || Math.floor(Math.random() * 10000) + 100;
  const rating = product.rating || parseFloat((Math.random() * 1 + 4).toFixed(1));
  const imageUrl = product.product_images?.[0]?.src || `https://placehold.co/300x400?text=Product`;
  const displayImageUrl = imageError 
    ? `https://placehold.co/300x400?text=${encodeURIComponent(product.name)}` 
    : imageUrl;

  const generateTags = () => {
    const tags = [];
    if (product.discount_price) tags.push("Sale");
    if (product.flash_start_time) tags.push("SuperDeals");
    if (product.category?.toLowerCase().includes("premium")) tags.push("Brand+");
    if (product.tags && product.tags.length > 0) {
      tags.push(...product.tags.slice(0, 2));
    }
    return tags.length > 0 ? tags : ["Popular"];
  };

  const tags = generateTags();
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;

  return (
    <div className="bg-white overflow-hidden mb-2 flex flex-col h-full">
      {/* Image Container - Different styling based on aspectRatio */}
      <div 
        className={`
          w-full 
          bg-white 
          overflow-hidden 
          mb-0.5 
          relative 
          flex 
          items-center 
          justify-center
          ${aspectRatio === 'square' ? 'aspect-square' : 'max-h-80'}
        `}
      >
        <img 
          src={displayImageUrl} 
          alt={product.name} 
          className={`
            w-full 
            ${aspectRatio === 'square' ? 'h-full object-contain' : 'h-auto max-h-full object-contain'}
          `} 
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {(imageError || !product.product_images?.[0]?.src) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-xs text-center px-2">
              {product.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-0.5 flex-grow">
        <p className={`text-[11px] text-gray-700 mb-0.5 leading-tight ${singleLineName ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {showTags && renderTag && tags.map((tag) => renderTag(tag))}
          {product.name}
        </p>
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="text-[10px] text-gray-500">{soldCount.toLocaleString()} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            {/* Replaced ★ with Star icon with yellow color */}
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 mr-0.5" />
            <span className="text-[10px] text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">
          G{displayPrice.toLocaleString('en-US')}
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through ml-0.5">
              G{product.price.toLocaleString('en-US')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export { ProductCard };