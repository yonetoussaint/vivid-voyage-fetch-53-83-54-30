import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { CategoryRoutes } from "../routes/CategoryRoutes";
import AddReviewPage from '@/pages/AddReviewPage';
import { ContentRoutes } from "../routes/ContentRoutes";
import { AuthRoutes } from "../routes/AuthRoutes";
import { MiscRoutes } from "../routes/MiscRoutes";
import MallPage from "@/pages/MallPage";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
// Remove or fix this import if ChatPage doesn't exist
// import { ChatPage } from "@/pages/Messages";
import GasStationSystem from "@/pages/EasyPlus";
import ProfilePage from "@/pages/ProfilePage";
import Portfolio from "@/pages/Portfolio.tsx";
import ProductDetail from "@/pages/ProductDetail";
import Calculator from "@/pages/Calculator";
import Index from "@/pages/Index";
import ReviewsPage from "@/components/product/ReviewsPage";
import AuthCallback from "@/pages/AuthCallback";
// Remove the KGPattisseriePOS import
// import KGPattisseriePOS from "@/pages/KGPattiseriePOS";
// Import the VendorPostComments component
import VendorPostComments from '@/components/home/VendorPostComments';

export function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Google OAuth callback route - OUTSIDE MainLayout */}
      <Route
        path="auth/callback"
        element={
          <AuthCallback />
        }
      />
<Route path="/product/:productId/add-review" element={<AddReviewPage />} />

      {/* ✅ Error route for auth failures */}
      <Route
        path="auth/error"
        element={
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
              <p className="text-gray-600 mb-4">There was a problem signing in with Google.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        }
      />

      {/* KG Pâtisserie POS System route - REMOVED */}

      {/* NEW ROUTE: Vendor Post Comments */}
      <Route
        path="comments"
        element={
          <VendorPostComments />
        }
      />

      {/* Product Detail Routes - OUTSIDE MainLayout for unrestricted scrolling */}
      <Route
        path="product/:id/:tab"
        element={
          <ProductDetail />
        }
      />

      <Route
        path="portfolio"
        element={
          <Portfolio/>
        }
      />

      <Route path="product/:id" element={<Navigate to="overview" replace />} />

      <Route
        path="calculator"
        element={
          <Calculator/>
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

        {/* Comment out or remove this route if ChatPage doesn't exist */}
        {/* <Route
          path="messages/:chatId"
          element={
            <ChatPage />
          }
        /> */}

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

        <Route 
          path="mall" 
          element={
            <MallPage />
          } 
        />
      </Route>
    </Routes>
  );
}