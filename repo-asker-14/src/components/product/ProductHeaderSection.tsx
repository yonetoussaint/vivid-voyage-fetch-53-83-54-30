import React, { useState, forwardRef } from 'react';
import { Heart, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import ProductHeader from './ProductHeader';

interface ProductHeaderSectionProps {
  activeSection: string;
  onTabChange: (section: string) => void;
  focusMode: boolean;
  showHeaderInFocus: boolean;
  onProductDetailsClick: () => void;
  currentImageIndex: number;
  totalImages: number;
  onShareClick: () => void;
}

const ProductHeaderSection = forwardRef<HTMLDivElement, ProductHeaderSectionProps>(({
  activeSection,
  onTabChange,
  focusMode,
  showHeaderInFocus,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick
}, ref) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startLoading } = useNavigationLoading();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder for product data, replace with actual product data fetching or props
  const product = { name: "Sample Product", description: "This is a sample product description." };

  const handleShare = async () => {
    try {
      if (navigator.share && product) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Could not share the product",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      startLoading();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    // Navigate to search page when clicking on search bar in product detail
    startLoading();
    navigate('/search');
  };

  return (
    <div ref={ref} className="relative z-50">
      <ProductHeader
        activeSection={activeSection}
        onTabChange={onTabChange}
        focusMode={focusMode}
        showHeaderInFocus={showHeaderInFocus}
        onProductDetailsClick={onProductDetailsClick}
        currentImageIndex={currentImageIndex}
        totalImages={totalImages}
        onShareClick={handleShare}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onSearchFocus={handleSearchFocus}
        inPanel={false}
      />
    </div>
  );
});

ProductHeaderSection.displayName = 'ProductHeaderSection';

export default ProductHeaderSection;