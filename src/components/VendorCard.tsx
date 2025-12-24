import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Store, User, CheckCircle } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  type: 'vendor';
  rating: number;
  followers: number;
  verified: boolean;
  rank: number;
  discount?: string;
  image?: string;
  products: Array<{
    id: string;
    image?: string;
  }>;
  isPickupStation?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  onProductClick: (id: string) => void;
  onSellerClick: (id: string) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onProductClick, onSellerClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const displayProducts = vendor.products.slice(0, 3);

  const handleProductClick = (productId: string) => {
    onProductClick(productId);
  };

  const handleSellerClick = () => {
    if (!vendor?.id) return;
    onSellerClick(vendor.id);
  };

  const DefaultSellerAvatar = ({ className }: { className?: string }) => (
    <User className={className} />
  );

  const VerificationBadge = () => (
    <CheckCircle className="w-3 h-3 text-blue-500" />
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-all duration-300">
        <div className="px-2 pt-2 pb-1 relative">
          {vendor.discount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
              {vendor.discount}
            </div>
          )}

          <div className="grid grid-cols-3 gap-1">
            {displayProducts.map((product) => (
              <button
                key={product.id}
                className="group cursor-pointer relative"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-square rounded border border-gray-100 bg-gray-50 overflow-hidden hover:border-gray-200 transition-colors">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Store size={14} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {vendor.image && !imageError ? (
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <DefaultSellerAvatar className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-0.5">
                <h3 className="font-medium text-xs truncate mr-1">{vendor.name}</h3>
                {vendor.verified && <VerificationBadge />}
              </div>

              <div className="text-xs text-gray-500">
                {formatNumber(vendor.followers)} followers
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 pb-2">
          <button
            className={`w-full flex items-center justify-center text-xs font-medium py-1.5 px-2 rounded-full transition-colors ${
              isFollowing
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

// VendorCardWrapper component
const VendorCardWrapper: React.FC<{ vendor: Vendor }> = ({ vendor }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleSellerClick = () => {
    navigate(`/vendor/${vendor.id}`);
  };

  return (
    <div className="mb-2">
      <VendorCard
        vendor={vendor}
        onProductClick={handleProductClick}
        onSellerClick={handleSellerClick}
      />
    </div>
  );
};

export { VendorCard, VendorCardWrapper };