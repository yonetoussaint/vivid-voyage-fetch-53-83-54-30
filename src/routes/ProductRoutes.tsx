// routes/ProductRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import ProductDetail from "../pages/ProductDetail";
import SingleProductDetail from "../pages/SingleProductDetail";
import ProductDescriptionPage from "../pages/ProductDescriptionPage";
import ProductCommentsPage from "../pages/ProductCommentsPage";
import ProductReviewsPage from "../pages/ProductReviewsPage";
import ProductQAPage from "../pages/ProductQAPage";
import AskQuestionPage from "../pages/AskQuestionPage";

export function ProductRoutes() {
  return (
    <>
      {/* Main product detail routes with tab support */}
      <Route path="product/:id" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/overview" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/variants" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/reviews" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/store-reviews" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/reviews-gallery" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
      <Route path="product/:id/qna" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />

      {/* Legacy routes - keep for backward compatibility */}
      <Route path="product/:id/description" element={
        <CachedRoute>
          <ProductDescriptionPage />
        </CachedRoute>
      } />
      <Route path="product/:id/comments" element={
        <CachedRoute>
          <ProductCommentsPage />
        </CachedRoute>
      } />
      <Route path="product/:id/qa" element={
        <CachedRoute>
          <ProductQAPage />
        </CachedRoute>
      } />
      <Route path="product/:id/ask-question" element={
        <CachedRoute>
          <AskQuestionPage />
        </CachedRoute>
      } />

      {/* Single product routes */}
      <Route path="single-product/:id" element={
        <CachedRoute>
          <SingleProductDetail />
        </CachedRoute>
      } />
      <Route path="single-product/:id/comments" element={
        <CachedRoute>
          <ProductCommentsPage />
        </CachedRoute>
      } />
      <Route path="single-product/:id/ask-question" element={
        <CachedRoute>
          <AskQuestionPage />
        </CachedRoute>
      } />

      {/* Redirects for old routes to new tab system */}
      <Route path="product/:id/" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
    </>
  );
}