// routes/HomepageRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import ConditionalHomepage from "../components/layout/ConditionalHomepage";
import Index from "../pages/Index";

export function HomepageRoutes() {
  return (
    <>
      <Route index element={
        <CachedRoute>
          <ConditionalHomepage />
        </CachedRoute>
      } />
      <Route path="for-you" element={
        <CachedRoute>
          <ConditionalHomepage />
        </CachedRoute>
      } />
      <Route path="index" element={
        <CachedRoute>
          <Index />
        </CachedRoute>
      } />
    </>
  );
}