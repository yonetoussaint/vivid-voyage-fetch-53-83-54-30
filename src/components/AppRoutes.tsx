import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { CategoryRoutes } from "../routes/CategoryRoutes";
import { ContentRoutes } from "../routes/ContentRoutes";
import { AuthRoutes } from "../routes/AuthRoutes";
import { MiscRoutes } from "../routes/MiscRoutes";
import MallPage from "@/pages/MallPage";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
import { ChatPage } from "@/pages/Messages";
import GasStationSystem from "@/pages/EasyPlus";
import ProfilePage from "@/pages/ProfilePage";
import Portfolio from "@/pages/Portfolio.tsx";
import ProductDetail from "@/pages/ProductDetail";
import ProductCommentsPage from "@/pages/ProductCommentsPage";
import Index from "@/pages/Index";
import ReviewsPage from "@/components/product/ReviewsPage"; // Add this import

export function AppRoutes() {
  return (
    <Routes>
      {/* Product Detail Routes - OUTSIDE MainLayout for unrestricted scrolling */}
      <Route
        path="product/:id/:tab"
        element={
          <ProductDetail />
        }
      />

      <Route path="product/:id" element={<Navigate to="overview" replace />} />

      <Route
        path="product/:id/comments"
        element={
          <ProductCommentsPage />
        }
      />

      {/* Reviews Page - OUTSIDE MainLayout for specific review */}
      <Route
        path="reviews/:reviewId"
        element={
          <ReviewsPage />
        }
      />

      {/* Optional: Keep a general reviews page if needed */}
      <Route
        path="reviews"
        element={
          <ReviewsPage />
        }
      />

      <Route
        path="easy"
        element={
          <GasStationSystem />
        }
      />

      {/* All other routes - INSIDE MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Index />
          }
        />
        <Route
          path="for-you"
          element={
            <Index />
          }
        />

        <Route
          path="wallet"
          element={
            <Wallet />
          }
        />

        <Route
          path="messages"
          element={
            <Messages />
          }
        />

        <Route
          path="messages/:conversationId"
          element={
            <ChatPage />
          }
        />

        <Route
          path="profile/*"
          element={
            <ProfilePage />
          }
        />

        {CategoryRoutes()}
        {ContentRoutes()}
        {AuthRoutes()}
        {MiscRoutes()}

        <Route path="mall" element={<MallPage />} />
      </Route>
    </Routes>
  );
}