// ProductDescriptionSection.tsx
import React from "react";
import SectionHeader from "@/components/home/SectionHeader"; // Adjust import path as needed
import { useProduct } from "@/hooks/useProduct";
import { FileText } from "lucide-react"; // Icon for description section

interface FullDescriptionProps {
  productId?: string;
  title?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  compact?: boolean;
  className?: string;
}

export default function FullDescription({
  productId,
  title = "Product Description",
  titleTransform = "uppercase",
  titleSize = "xs",
  showViewAll = false,
  viewAllLink = "#description",
  viewAllText = "View Details",
  compact = false,
  className = ""
}: FullDescriptionProps) {
  const { data: product, isLoading: loading, error } = useProduct(productId);

  console.log('🔍 FullDescription Debug:', {
    productId,
    hasProduct: !!product,
    hasDescription: !!product?.description,
    hasShortDescription: !!product?.short_description,
    loading,
    error
  });

  // Show loading state
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={FileText}
        />
        <div className="space-y-2 mt-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={FileText}
        />
        <p className="text-red-500 text-sm mt-2">Failed to load product description</p>
      </div>
    );
  }

  // Check if we have product but no productId was provided
  if (!productId) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={FileText}
        />
        <p className="text-yellow-600 text-sm mt-2">No product ID provided</p>
      </div>
    );
  }

  // Don't render anything if no product
  if (!product) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={FileText}
        />
        <p className="text-gray-500 text-sm mt-2">Product not found</p>
      </div>
    );
  }

  // Get description content - prioritize description over short_description for full view
  const descriptionContent = product.description || product.short_description || 'No description available for this product.';

  return (
    <section className={className}>
      <SectionHeader
        title={title}
        subtitle="Learn more about this product"
        icon={FileText}
        viewAllLink={showViewAll ? viewAllLink : undefined}
        viewAllText={viewAllText}
        titleTransform={titleTransform}
        titleSize={titleSize}
        compact={compact}
      />
      
      <div className={`${compact ? 'mt-1' : 'mt-3'}`}>
        <p className="text-gray-600 leading-relaxed text-sm">
          {descriptionContent}
        </p>
      </div>
    </section>
  );
}