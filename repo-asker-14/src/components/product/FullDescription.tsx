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
  const { product, loading, error } = useProduct(productId);

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

  // Don't render anything if no product or description
  if (!product || !product.description) {
    return null;
  }

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
          {product.description}
        </p>
      </div>
    </section>
  );
}