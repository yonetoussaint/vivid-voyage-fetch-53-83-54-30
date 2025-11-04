// routes/ProductRoutes.tsx (Simplified Version)
import React from "react";
import { Route, Navigate } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import ProductDetail from "../pages/ProductDetail";
import SingleProductDetail from "../pages/SingleProductDetail";
import ProductDescriptionPage from "../pages/ProductDescriptionPage";
import ProductCommentsPage from "../pages/ProductCommentsPage";
import ProductQAPage from "../pages/ProductQAPage";
import AskQuestionPage from "../pages/AskQuestionPage";

export function ProductRoutes() {
  return (
    <>
      {/* Single catch-all route for all product tabs */}
      <Route path="product/:id/*" element={
        <CachedRoute>
          <ProductDetail />
        </CachedRoute>
      } />

      {/* Redirect base product route to overview */}
      <Route path="product/:id" element={
        <CachedRoute>
          <Navigate to="overview" replace />
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
    </>
  );
}