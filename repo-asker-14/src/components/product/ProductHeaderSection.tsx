import React, { useState } from 'react';
import { Heart, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import ProductHeader from './ProductHeader';

interface ProductHeaderSectionProps {
  ref: React.RefObject<HTMLDivElement>;
  activeSection: string;
  onTabChange: (section: string) => void;
  focusMode: boolean;
  showHeaderInFocus: boolean;
  onProductDetailsClick: () => void;
  currentImageIndex: number;
  totalImages: number;
  onShareClick: () => void;
}

const ProductHeaderSection: React.FC<ProductHeaderSectionProps> = ({
  ref,
  activeSection,
  onTabChange,
  focusMode,
  showHeaderInFocus,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick
}) => {
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
        // These props are commented out as they were not present in the original ProductHeaderSection interface
        // forceScrolledState={forceScrolledState}
        // actionButtons={actionButtons}
        // inPanel={inPanel}
        // customScrollProgress={customScrollProgress}
        // showCloseIcon={showCloseIcon}
        // onCloseClick={onCloseClick}
        // stickyMode={stickyMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        inPanel={false}
      />
    </div>
  );
};

export default ProductHeaderSection;