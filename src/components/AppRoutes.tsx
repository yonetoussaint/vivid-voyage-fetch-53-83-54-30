// components/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { HomepageRoutes } from "../routes/HomepageRoutes";
import { ProductRoutes } from "../routes/ProductRoutes";
import { CategoryRoutes } from "../routes/CategoryRoutes";
import { ContentRoutes } from "../routes/ContentRoutes";
import { UserRoutes } from "../routes/UserRoutes";
import { AuthRoutes } from "../routes/AuthRoutes";
import { AdminSellerRoutes } from "../routes/AdminSellerRoutes";
import { ProductEditRoutes } from "../routes/ProductEditRoutes";
import { PaymentRoutes } from "../routes/PaymentRoutes";
import { MiscRoutes } from "../routes/MiscRoutes";
import AdminPage from "@/pages/AdminPage";
// Import the MallPage component
import MallPage from "@/pages/MallPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Call the route functions to get Route elements */}
        {HomepageRoutes()}
        {ProductRoutes()}
        {CategoryRoutes()}
        {ContentRoutes()}
        {UserRoutes()}
        {AuthRoutes()}
        {AdminSellerRoutes()}
        {ProductEditRoutes()}
        {PaymentRoutes()}
        {MiscRoutes()}

        {/* Add Mall Route directly */}
        <Route path="mall" element={<MallPage />} />

        {/* Add Admin Route */}
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}