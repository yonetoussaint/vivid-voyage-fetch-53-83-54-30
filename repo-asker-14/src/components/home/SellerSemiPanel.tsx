import React, { useRef, useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Star, Users, Package, X } from 'lucide-react';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { useQuery } from "@tanstack/react-query";
import { fetchSellerById } from "@/integrations/supabase/sellers";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { supabase } from "@/integrations/supabase/client";
import VerificationBadge from "@/components/shared/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Custom hook for panel scroll progress (reused from ProductSemiPanel)
const usePanelScrollProgress = (scrollContainerRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const onScroll = () => {
      const currentScrollTop = container.scrollTop;
      setScrollY(currentScrollTop);
    };

    container.scrollTop = 0;
    setScrollY(0);
    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, isOpen]);

  const maxScroll = 120;
  const progress = Math.min(scrollY / maxScroll, 1);

  return { scrollY, progress };
};

interface SellerSemiPanelProps {
  sellerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SellerSemiPanel: React.FC<SellerSemiPanelProps> = ({
  sellerId,
  isOpen,
  onClose,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [panelHeaderHeight, setPanelHeaderHeight] = useState(60);
  const { setHasActiveOverlay } = useScreenOverlay();

  // Get scroll progress for the panel
  const { progress: scrollProgress } = usePanelScrollProgress(scrollContainerRef, isOpen);

  // Fetch seller data
  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => fetchSellerById(sellerId!),
    enabled: !!sellerId,
  });

  // Fetch seller's products
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const sellerProducts = allProducts.filter(product => product.seller_id === sellerId);

  // Utility functions
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Measure panel header height
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setPanelHeaderHeight(height);
    }
  }, [isOpen]);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  if (!isOpen) return null;


  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleContactClick = () => {
    console.log('Contact seller clicked');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      {/* Semi Panel */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                {seller && (
                  <img
                    src={getSellerLogoUrl(seller.image_url)}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg">{seller?.name || 'Loading...'}</h2>
                  {seller?.verified && <VerificationBadge />}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{seller?.rating?.toFixed(1) || '0.0'}</span>
                  <span>•</span>
                  <span>{formatNumber(seller?.followers_count || 0)} followers</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        {seller ? (
          <div className="flex-1 overflow-hidden min-h-0 relative">
            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto"
              style={{ paddingTop: panelHeaderHeight }}
            >
              <div className="p-4 space-y-6">
                
                {/* Seller Stats */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{formatNumber(seller.total_sales || 0)}</div>
                        <div className="text-xs text-gray-500">Sales</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{sellerProducts.length}</div>
                        <div className="text-xs text-gray-500">Products</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{seller.trust_score?.toFixed(1) || '0.0'}</div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Description */}
                {seller.description && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-sm text-gray-600">{seller.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {seller.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{seller.email}</span>
                        </div>
                      )}
                      {seller.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{seller.phone}</span>
                        </div>
                      )}
                      {seller.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{seller.address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Products */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Recent Products</h3>
                      <Badge variant="secondary">{sellerProducts.length} items</Badge>
                    </div>
                    
                    {sellerProducts.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {sellerProducts.slice(0, 4).map((product) => {
                          const productImages = Array.isArray(product.product_images) ? product.product_images : [];
                          const firstImage = productImages.length > 0 ? productImages[0] : null;
                          
                          return (
                            <div key={product.id} className="group cursor-pointer">
                              <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden mb-2">
                                {firstImage?.src ? (
                                  <img
                                    src={firstImage.src}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="text-xs font-medium truncate">{product.name}</div>
                              <div className="text-xs text-gray-500">${product.price}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No products yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pb-6">
                  <Button
                    onClick={handleFollowClick}
                    variant={isFollowing ? "outline" : "default"}
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    onClick={handleContactClick}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              {sellerLoading ? "Loading seller..." : "Seller not found"}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerSemiPanel;