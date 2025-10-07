import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Plus, 
  Store,
  Users, 
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { fetchAllSellers } from "@/integrations/supabase/sellers";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import SectionHeader from './SectionHeader';
import VerificationBadge from "@/components/shared/VerificationBadge";
import ProductSemiPanel from './ProductSemiPanel';
import SellerSemiPanel from './SellerSemiPanel';


// Utility functions
const formatFollowers = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const getSellerLogoUrl = (imagePath) => {
  if (!imagePath) return "";
  const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
  return data.publicUrl;
};

const getProductImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
  return data.publicUrl;
};

// Custom Seller Avatar SVG Component
const DefaultSellerAvatar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shop/Store building outline */}
    <path 
      d="M3 21H21V9L18 6.5L15 4L12 6.5L9 4L6 6.5L3 9V21Z" 
      fill="#E5E7EB" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Store front */}
    <path 
      d="M6 21V12H10V21" 
      fill="#F3F4F6" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 21V12H18V21" 
      fill="#F3F4F6" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Awning/roof detail */}
    <path 
      d="M2 9H22" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* Windows */}
    <circle cx="8" cy="16.5" r="1" fill="#9CA3AF"/>
    <circle cx="16" cy="16.5" r="1" fill="#9CA3AF"/>
  </svg>
);

// Alternative User/Profile SVG Component
const DefaultProfileAvatar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle background */}
    <circle cx="12" cy="12" r="12" fill="#E5E7EB"/>
    {/* Person silhouette */}
    <circle cx="12" cy="8" r="3" fill="#9CA3AF"/>
    <path 
      d="M6.168 18.849C6.718 16.761 9.143 15.25 12 15.25s5.282 1.511 5.832 3.599" 
      fill="#9CA3AF"
    />
  </svg>
);



// Vendor Card Component
const VendorCard = ({ vendor, onProductClick, onSellerClick, showProducts = true, isPickupStation = false, mode = 'carousel', showBanner = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const displayProducts = vendor.products.slice(0, 4);

  const handleProductClick = (productId) => {
    onProductClick(productId);
  };

  const handleSellerClick = () => {
    if (!vendor?.id) return;
    onSellerClick(vendor.id);
  };

  return (
    <div className="w-full">
      <div className={`bg-white border border-gray-300 overflow-hidden hover:border-gray-400 transition-all duration-300 ${mode === 'grid' ? 'rounded-none' : 'rounded-2xl'}`}>

        {/* Banner for stations */}
        {showBanner && (
          <div className="px-2 pt-2 pb-1">
            <div className="w-full h-24 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=200&fit=crop"
                alt="Station banner"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Products Grid */}  
        {showProducts && !showBanner && (
          <div className="px-2 pt-2 pb-1 relative">  
            {vendor.discount && (  
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">  
                {vendor.discount}  
              </div>  
            )}

            <div className={`grid ${mode === 'grid' ? 'grid-cols-2' : 'grid-cols-4'} gap-1`}>  
              {displayProducts.map((product, index) => (  
                <button 
                  key={product.id} 
                  className="group cursor-pointer relative"
                  onClick={() => handleProductClick(product.id)}
                >  
                  <div className="aspect-square rounded-md border border-gray-100 bg-gray-50 overflow-hidden hover:border-gray-200 transition-colors">  
                    {product.image ? (
                      <img   
                        src={product.image}   
                        alt=""   
                        className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Store size={16} />
                      </div>
                    )}
                  </div>
                  {mode === 'grid' && index === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                      <span className="text-white font-bold text-sm">+15K</span>
                    </div>
                  )}
                </button>  
              ))}  
            </div>  
          </div>
        )}

        {/* Vendor Info */}
        <div className={`px-2 ${showProducts ? 'py-1' : 'py-2'}`}>
          <div className="flex items-center gap-2">

            {/* Vendor Avatar */}
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {vendor.image && !imageError ? (
                <img   
                  src={vendor.image}   
                  alt={vendor.name}   
                  className="w-full h-full object-cover rounded-full"  
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <DefaultSellerAvatar className="w-6 h-6" />
              )}
            </div>

            {/* Vendor Details */}
            <div className="flex-1 min-w-0">
              {/* Name and Verification */}
              <div className="flex items-center mb-0.5">  
                <h3 className="font-medium text-xs truncate mr-1">{vendor.name}</h3>  
                {vendor.verified && <VerificationBadge />}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">  
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-yellow-500">  
                    <Star size={10} className="fill-yellow-500" />  
                    <span className="font-medium ml-0.5 text-gray-600">{vendor.rating}</span>  
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="flex items-center">  
                    <Users size={10} className="mr-0.5" />  
                    {vendor.followers}  
                  </div>
                </div>
                {mode !== 'grid' && (
                  <span className="text-xs font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded-full">#{vendor.rank}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}  
        <div className="px-2 pb-2 grid grid-cols-2 gap-2">  
          <button 
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-medium py-1.5 px-2 rounded-full transition-colors"
            onClick={handleSellerClick}
          >  
            {isPickupStation ? 'Visit Station' : mode === 'grid' ? 'Visit' : 'Visit Store'}
          </button>  
          <button   
            className={`flex items-center justify-center text-xs font-medium py-1.5 px-2 rounded-full transition-colors ${  
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

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};

interface VendorCarouselProps {
  title?: string;
  showProducts?: boolean;
  viewAllLink?: string;
  isPickupStation?: boolean;
  mode?: 'carousel' | 'grid';
  showSectionHeader?: boolean;
  showBanner?: boolean;
}

// Main Carousel Component
const VendorCarousel: React.FC<VendorCarouselProps> = ({ 
  title = "TOP VENDORS",
  showProducts = true,
  viewAllLink = "/vendors",
  isPickupStation = false,
  mode = 'carousel',
  showSectionHeader = true,
  showBanner = false
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [isSellerPanelOpen, setIsSellerPanelOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedProductId(null);
  };

  const handleSellerClick = (sellerId: string) => {
    if (isPickupStation) {
      navigate('/pickup-station');
    } else {
      setSelectedSellerId(sellerId);
      setIsSellerPanelOpen(true);
    }
  };

  const handleCloseSellerPanel = () => {
    setIsSellerPanelOpen(false);
    setSelectedSellerId(null);
  };

  const { data: sellers = [], isLoading: sellersLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: fetchAllSellers,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isLoading = sellersLoading || productsLoading;

  // Sample sellers data to show more cards
  const sampleSellers = [
    { id: 'sample-1', name: 'Tech Haven', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop', verified: true, rating: 4.8, followers_count: 25000, category: 'electronics', total_sales: 0 },
    { id: 'sample-2', name: 'Fashion Forward', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop', verified: true, rating: 4.6, followers_count: 18500, category: 'fashion', total_sales: 0 },
    { id: 'sample-3', name: 'Home Essentials', image_url: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=150&h=150&fit=crop', verified: false, rating: 4.5, followers_count: 12300, category: 'home', total_sales: 0 },
    { id: 'sample-4', name: 'Sports Zone', image_url: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=150&h=150&fit=crop', verified: true, rating: 4.7, followers_count: 31200, category: 'sports', total_sales: 0 },
    { id: 'sample-5', name: 'Beauty Box', image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=150&h=150&fit=crop', verified: true, rating: 4.9, followers_count: 42000, category: 'beauty', total_sales: 0 },
    { id: 'sample-6', name: 'Book Nook', image_url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=150&h=150&fit=crop', verified: false, rating: 4.4, followers_count: 8900, category: 'books', total_sales: 0 },
    { id: 'sample-7', name: 'Pet Paradise', image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop', verified: true, rating: 4.8, followers_count: 19500, category: 'pets', total_sales: 0 },
    { id: 'sample-8', name: 'Kitchen King', image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=150&h=150&fit=crop', verified: false, rating: 4.3, followers_count: 14200, category: 'kitchen', total_sales: 0 },
    { id: 'sample-9', name: 'Garden Glory', image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=150&h=150&fit=crop', verified: true, rating: 4.6, followers_count: 22100, category: 'garden', total_sales: 0 },
    { id: 'sample-10', name: 'Auto Parts Pro', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop', verified: true, rating: 4.7, followers_count: 28300, category: 'automotive', total_sales: 0 },
  ];

  // Sample products for the sample sellers
  const sampleProducts = [
    { id: 'prod-1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
    { id: 'prod-2', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
    { id: 'prod-3', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop' },
    { id: 'prod-4', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  ];

  // Combine real sellers with sample sellers
  const allSellers = [...sellers, ...sampleSellers];

  // Transform data
  const vendors = allSellers
    .map((seller, index) => {
      // Check if this is a sample seller
      const isSampleSeller = seller.id.startsWith('sample-');
      
      const sellerProducts = isSampleSeller 
        ? sampleProducts 
        : products
            .filter(product => product.seller_id === seller.id)
            .slice(0, 4)
            .map(product => {
              const productImages = Array.isArray(product.product_images) ? product.product_images : [];
              const firstImage = productImages.length > 0 ? productImages[0] : null;

              return {
                id: product.id,
                image: firstImage?.src || "",
                price: `$${product.price}`,
                discount: product.discount_price ? `${Math.round((1 - product.discount_price / product.price) * 100)}%` : null
              };
            });

      // Handle different types of image URLs
      let imageUrl = "";
      if (seller.image_url) {
        // If it's already a full URL (like Unsplash), use it directly
        if (seller.image_url.startsWith('http')) {
          imageUrl = seller.image_url;
        } else {
          // If it's a filename, get it from Supabase storage
          imageUrl = getSellerLogoUrl(seller.image_url);
        }
      }

      return {
        id: seller.id,
        name: seller.name,
        image: imageUrl,
        verified: seller.verified,
        rating: seller.rating?.toFixed(1) || "0.0",
        sales: seller.total_sales,
        followers: formatFollowers(seller.followers_count),
        category: seller.category || "general",
        discount: seller.category === "flash-deals" ? "30%" : null,
        products: sellerProducts,
        rank: index + 1
      };
    })
    .filter(vendor => {
      // In grid mode, show sellers with at least 1 product; in carousel mode, require 4 products
      if (showProducts) {
        return mode === 'grid' ? vendor.products.length >= 1 : vendor.products.length >= 4;
      }
      return true;
    });

  const cardWidth = isMobile ? "66%" : "33.333%";

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Users className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">5K+ Vendors</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full relative">
        <SectionHeader
          title={title}
          icon={Store}
          viewAllLink={viewAllLink}
          viewAllText="View All"
        />
        <div className="flex overflow-x-auto pl-2 space-x-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-2/3 md:w-1/3 bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {showSectionHeader && (
        <SectionHeader
          title={title}
          icon={Store}
          viewAllLink={viewAllLink}
          viewAllText="View All"
        />
      )}

      {mode === 'grid' ? (
        <div className="grid grid-cols-2 gap-1 px-2">
          {vendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              onProductClick={handleProductClick} 
              onSellerClick={handleSellerClick} 
              showProducts={showProducts} 
              isPickupStation={isPickupStation}
              mode={mode}
              showBanner={showBanner}
            />
          ))}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pl-2 scrollbar-none w-full"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {vendors.map((vendor) => (
            <div 
              key={vendor.id}
              className="flex-shrink-0 mr-[3vw]"
              style={{ 
                width: cardWidth,
                scrollSnapAlign: 'start'
              }}
            >
              <VendorCard 
                vendor={vendor} 
                onProductClick={handleProductClick} 
                onSellerClick={handleSellerClick} 
                showProducts={showProducts} 
                isPickupStation={isPickupStation}
                mode={mode}
                showBanner={showBanner}
              />
            </div>
          ))}

          <div className="flex-shrink-0 w-2"></div>
        </div>
      )}

      {/* Product Semi Panel */}
      <ProductSemiPanel
        productId={selectedProductId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      {/* Seller Semi Panel */}
      <SellerSemiPanel
        sellerId={selectedSellerId}
        isOpen={isSellerPanelOpen}
        onClose={handleCloseSellerPanel}
      />
    </div>
  );
};

export default VendorCarousel;