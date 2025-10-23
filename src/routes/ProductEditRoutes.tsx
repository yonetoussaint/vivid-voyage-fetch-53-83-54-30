// routes/ProductEditRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import ProductEditNavigationPage from "../pages/ProductEditNavigationPage";
import ProductEditBasicPage from "../pages/ProductEditBasicPage";
import ProductEditCategoryPage from "../pages/ProductEditCategoryPage";
import ProductEditMediaPage from "../pages/ProductEditMediaPage";
import ProductEditShippingPage from "../pages/ProductEditShippingPage";
import ProductEditDealsPage from "../pages/ProductEditDealsPage";
import ProductEditSpecsPage from "../pages/ProductEditSpecsPage";
import ProductEditVariantsPage from "../pages/ProductEditVariantsPage";
import ProductEditNewVariantPage from "../pages/ProductEditNewVariantPage";
import ProductEditDetailsPage from "../pages/ProductEditDetailsPage";
import ProductEditDescriptionPage from "../pages/ProductEditDescriptionPage";

export function ProductEditRoutes() {
  return (
    <>
      <Route path="product/:productId/edit" element={
        <CachedRoute shouldCache={false}>
          <ProductEditNavigationPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/basic" element={
        <CachedRoute shouldCache={false}>
          <ProductEditBasicPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/category" element={
        <CachedRoute shouldCache={false}>
          <ProductEditCategoryPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/media" element={
        <CachedRoute shouldCache={false}>
          <ProductEditMediaPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/shipping" element={
        <CachedRoute shouldCache={false}>
          <ProductEditShippingPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/deals" element={
        <CachedRoute shouldCache={false}>
          <ProductEditDealsPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/specifications" element={
        <CachedRoute shouldCache={false}>
          <ProductEditSpecsPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/variants" element={
        <CachedRoute shouldCache={false}>
          <ProductEditVariantsPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/variants/new" element={
        <CachedRoute shouldCache={false}>
          <ProductEditNewVariantPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/details" element={
        <CachedRoute shouldCache={false}>
          <ProductEditDetailsPage />
        </CachedRoute>
      } />
      <Route path="product/:productId/edit/description" element={
        <CachedRoute shouldCache={false}>
          <ProductEditDescriptionPage />
        </CachedRoute>
      } />
    </>
  );
}