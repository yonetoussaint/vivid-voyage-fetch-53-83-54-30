// routes/MiscRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import SearchPage from "../pages/SearchPage";
import NetflixPage from "../pages/NetflixPage";
import ComponentTestPage from "../pages/ComponentTestPage";
import NotFound from "../pages/NotFound";

export function MiscRoutes() {
  return (
    <>
      <Route path="search" element={
        <CachedRoute cacheKey="search-page">
          <SearchPage />
        </CachedRoute>
      } />
      <Route path="netflix" element={
        <CachedRoute>
          <NetflixPage />
        </CachedRoute>
      } />
      <Route path="component-test" element={
        <CachedRoute>
          <ComponentTestPage />
        </CachedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </>
  );
}