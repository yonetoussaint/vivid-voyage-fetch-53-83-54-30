// components/product/tabs/ProductOverview.tsx
import React from 'react';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

interface ProductOverviewProps {
  product: any;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
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

  // Prepare data for BookGenreFlashDeals
  const relatedProducts = product?.related_products || [];

  return (
    <div className="w-full space-y-2">
      {/* 1. GalleryThumbnails */}
      <GalleryThumbnails
        images={galleryImages}
        currentIndex={0}
        onThumbnailClick={(index) => console.log('Thumbnail clicked:', index)}
        videoIndices={videoIndices}
        galleryItems={allGalleryItems}
        variantNames={product?.variants?.map((v: any) => v.name) || []}
      />

      {/* 2. IPhoneXRListing */}
      <IPhoneXRListing 
        product={listingProduct}
        onReadMore={() => console.log('Read more clicked')}
      />

      {/* 3. BookGenreFlashDeals - Show related products */}
      <BookGenreFlashDeals
        title="Related Products"
        subtitle="Customers also viewed"
        products={relatedProducts}
        showSectionHeader={true}
        showSummary={false}
        showFilters={false}
        summaryMode="products"
      />
    </div>
  );
};

export default ProductOverview;