// React & Dependencies
import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// Icons
import { Store } from "lucide-react";

// Components
export { default as ProductDetailError } from "@/components/product/ProductDetailError";
export { default as ProductImageGallery } from "@/components/ProductImageGallery";
export { default as AliExpressHeader } from "@/components/home/AliExpressHeader";
export { default as InfiniteContentGrid } from "@/components/InfiniteContentGrid";
export { default as FlashDeals } from "@/components/home/FlashDeals";
export { default as Separator } from "@/components/shared/Separator";
export { default as StoreBanner } from "@/components/StoreBanner";
export { default as GalleryThumbnails } from "@/components/product/GalleryThumbnails";
export { default as ProductDetailInfo } from "@/components/product/ProductDetailInfo";
export { default as ProductDetailLoading } from "@/components/product/ProductDetailLoading";
export { default as CustomerReviews } from "@/components/product/CustomerReviewsEnhanced";
export { default as ReviewsGallery } from "@/components/product/ReviewsGallery";
export { default as ReviewTypingBar } from "@/components/product/ReviewTypingBar";

// Hooks
export { useProductDetail } from "@/hooks/product-detail.hooks";

// Re-export for convenience
export { Store };
export { useEffect, useParams, useLocation };