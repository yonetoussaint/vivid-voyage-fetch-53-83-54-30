// routes/AuthRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import SimpleAuthPage from "../pages/SimpleAuthPage";
import AuthPage from "../pages/AuthPage";
import ForYou from "../pages/ForYou";

export function AuthRoutes() {
  return (
    <>
      <Route path="auth" element={
        <CachedRoute shouldCache={false}>
          <SimpleAuthPage />
        </CachedRoute>
      } />
      <Route path="signin" element={
        <CachedRoute shouldCache={false}>
          <AuthPage />
        </CachedRoute>
      } />
      <Route path="signup" element={
        <CachedRoute shouldCache={false}>
          <SimpleAuthPage />
        </CachedRoute>
      } />
      <Route path="auth/callback" element={
        <CachedRoute>
          <ForYou />
        </CachedRoute>
      } />
    </>
  );
}