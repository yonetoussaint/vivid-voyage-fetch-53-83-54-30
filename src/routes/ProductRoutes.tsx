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
      <Route path="product/:id" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />
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
      <Route path="product/:id/reviews" element={
        <CachedRoute>
          <ProductReviewsPage />
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
    </>
  );
}