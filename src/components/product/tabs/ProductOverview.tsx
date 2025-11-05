import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

interface ProductOverviewProps {
  product: any;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  // Fetch ALL products for the related products section
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-overview'],
    queryFn: fetchAllProducts,
  });

  console.log('📦 All products fetched:', allProducts.length);
  console.log('📦 Current product:', product?.id);

  // Prepare data for GalleryThumbnails
  const galleryImages = product?.images?.length > 0 
    ? product.images 
    : product?.product_images?.map((img: any) => img.src) || ["https://placehold.co/300x300?text=No+Image"];

  const videoIndices = product?.product_videos?.length > 0 ? [galleryImages.length] : [];

  // Combine images and videos for gallery
  const allGalleryItems = [
    ...(galleryImages.map((src: string) => ({ type: 'image' as const, src }))),
    ...(product?.product_videos?.map((video: any) => ({ 
      type: 'video' as const, 
      src: video.url,
      videoData: video 
    })) || [])
  ];

  // Prepare data for IPhoneXRListing
  const listingProduct = {
    name: product?.name,
    short_description: product?.short_description,
    description: product?.description,
    rating: product?.rating,
    reviewCount: product?.review_count,
    inventory: product?.inventory,
    sold_count: product?.sold_count,
    change: product?.sales_change
  };

  // Prepare related products - use all products excluding current one
  const relatedProducts = React.useMemo(() => {
    if (isLoadingProducts) {
      return [];
    }

    const filteredProducts = allProducts
      .filter(p => p.id !== product?.id)
      .slice(0, 8) // Limit to 8 products
      .map(p => ({
        id: p.id,
        name: p.name || 'Unnamed Product',
        price: Number(p.price) || 0,
        discount_price: p.discount_price ? Number(p.discount_price) : undefined,
        product_images: p.product_images || [{ src: "https://placehold.co/300x300?text=No+Image" }],
        inventory: p.inventory || 0,
        category: p.category || 'Uncategorized',
        flash_start_time: p.flash_start_time,
        seller_id: p.seller_id,
      }));

    console.log('🔄 Related products prepared:', filteredProducts.length);
    return filteredProducts;
  }, [allProducts, product?.id, isLoadingProducts]);

  return (
    <div className="w-full mt-2 space-y-2">
      {/* 1. GalleryThumbnails - Synced with product data */}
      <GalleryThumbnails
        images={galleryImages}
        currentIndex={0}
        onThumbnailClick={(index) => console.log('Thumbnail clicked:', index)}
        videoIndices={videoIndices}
        galleryItems={allGalleryItems}
        variantNames={product?.variant_names?.map((v: any) => v.name) || product?.variants?.map((v: any) => v.name) || []}
      />

      {/* 2. IPhoneXRListing */}
      <IPhoneXRListing 
        product={listingProduct}
        onReadMore={() => console.log('Read more clicked')}
      />

      {/* 3. BookGenreFlashDeals - Show related products */}
      {!isLoadingProducts && relatedProducts.length > 0 && (
        <BookGenreFlashDeals
          title="Related Products"
          subtitle="Customers also viewed"
          products={relatedProducts}
          showSectionHeader={true}
          showSummary={false}
          showFilters={false}
          summaryMode="products"
        />
      )}
    </div>
  );
};

export default ProductOverview;