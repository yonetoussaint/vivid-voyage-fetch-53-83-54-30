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
    change: product?.sales_change // You might need to calculate this
  };

  // Prepare data for BookGenreFlashDeals
  const relatedProducts = product?.related_products || [];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">Product Overview</h2>
      
      {/* 1. GalleryThumbnails */}
      <div className="mb-6">
        <GalleryThumbnails
          images={galleryImages}
          currentIndex={0}
          onThumbnailClick={(index) => console.log('Thumbnail clicked:', index)}
          videoIndices={videoIndices}
          galleryItems={allGalleryItems}
          variantNames={product?.variants?.map((v: any) => v.name) || []}
        />
      </div>

      {/* 2. IPhoneXRListing */}
      <div className="mb-6">
        <IPhoneXRListing 
          product={listingProduct}
          onReadMore={() => console.log('Read more clicked')}
        />
      </div>

      {/* 3. BookGenreFlashDeals - Show related products */}
      <div className="mt-8">
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

      {/* Original description */}
      <div className="mt-6">
        <p className="text-gray-700 leading-relaxed">
          {product?.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
};

export default ProductOverview;