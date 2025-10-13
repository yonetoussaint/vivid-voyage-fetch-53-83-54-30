import React from "react";
import { useLocation } from "react-router-dom";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProductsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get('title') || 'Products';
  const productType = searchParams.get('type');

  return (
    <PageContainer padding="none" className="min-h-screen bg-gray-50">
      <BookGenreFlashDeals
        title={title}
        productType={productType || undefined}
        showSectionHeader={false}
        showSummary={false}
        showFilters={true}
      />
    </PageContainer>
  );
}
