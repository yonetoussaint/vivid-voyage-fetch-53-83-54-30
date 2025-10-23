// routes/AdminSellerRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import AdminPanel from "../pages/AdminPanel";
import AdminDashboard from "../pages/AdminDashboard";
import SellerDashboard from '../pages/SellerDashboard';
import SellerPage from '../pages/SellerPage';
import PickupStationDashboard from '../pages/PickupStationDashboard';

export function AdminSellerRoutes() {
  return (
    <>
      <Route path="admin" element={
        <CachedRoute>
          <AdminPanel />
        </CachedRoute>
      } />
      <Route path="admin-dashboard/*" element={
        <CachedRoute>
          <AdminDashboard />
        </CachedRoute>
      } />
      <Route path="/seller/:sellerId/*" element={
        <CachedRoute>
          <SellerPage />
        </CachedRoute>
      } />
      <Route path="seller-dashboard/*" element={
        <CachedRoute>
          <SellerDashboard />
        </CachedRoute>
      } />
      <Route path="/admin-dashboard/*" element={
        <CachedRoute>
          <AdminDashboard />
        </CachedRoute>
      } />
      <Route path="/pickup-station/*" element={
        <CachedRoute>
          <PickupStationDashboard />
        </CachedRoute>
      } />
    </>
  );
}