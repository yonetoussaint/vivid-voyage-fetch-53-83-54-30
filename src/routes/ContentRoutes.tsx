// routes/ContentRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import Videos from "../pages/Videos";
import Reels from "../pages/Reels";
import Trending from "../pages/Trending";

export function ContentRoutes() {
  return (
    <>
      <Route path="videos" element={
        <CachedRoute>
          <Videos />
        </CachedRoute>
      } />
      <Route path="reels" element={
        <CachedRoute>
          <Reels />
        </CachedRoute>
      } />
      <Route path="reels/:mode" element={
        <CachedRoute>
          <Reels />
        </CachedRoute>
      } />
      <Route path="trending" element={
        <CachedRoute>
          <Trending />
        </CachedRoute>
      } />
    </>
  );
}