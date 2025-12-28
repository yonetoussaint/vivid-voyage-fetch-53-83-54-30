import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { CategoryRoutes } from "../routes/CategoryRoutes";
import { ContentRoutes } from "../routes/ContentRoutes";
import { AuthRoutes } from "../routes/AuthRoutes";
import { AdminSellerRoutes } from "../routes/AdminSellerRoutes";
import { ProductEditRoutes } from "../routes/ProductEditRoutes";
import { PaymentRoutes } from "../routes/PaymentRoutes";
import { MiscRoutes } from "../routes/MiscRoutes";
import AdminPage from "@/pages/AdminPage";
import MallPage from "@/pages/MallPage";
import CachedRoute from "./CachedRoute";
import ConditionalHomepage from "./layout/ConditionalHomepage";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import SingleProductDetail from "@/pages/SingleProductDetail";
import ProductDescriptionPage from "@/pages/ProductDescriptionPage";
import ProductCommentsPage from "@/pages/ProductCommentsPage";
import ProductQAPage from "@/pages/ProductQAPage";
import AskQuestionPage from "@/pages/AskQuestionPage";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
import { ChatPage } from "@/pages/Messages";
import ProfilePage from "@/pages/ProfilePage";
import MoreMenu from "@/pages/MoreMenu";
import Explore from "@/pages/Explore";
import Wishlist from "@/pages/Wishlist";
import Notifications from "@/pages/Notifications";
import Addresses from "@/pages/Addresses";
import Help from "@/pages/Help";
import MyStations from "@/pages/MyStations";
import ProductsPage from "@/pages/ProductsPage";
import CartPage from "@/pages/CartPage";
import MenuPage from "@/pages/MenuPage";
import CommunesPage from "@/pages/CommunesPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Product Detail Routes - OUTSIDE MainLayout for unrestricted scrolling */}
      <Route
        path="product/:id/:tab"
        element={
          <CachedRoute>
            <ProductDetail />
          </CachedRoute>
        }
      />
      
      <Route path="product/:id" element={<Navigate to="overview" replace />} />

      <Route
        path="product/:id/description"
        element={
          <CachedRoute>
            <ProductDescriptionPage />
          </CachedRoute>
        }
      />

      <Route
        path="product/:id/comments"
        element={
          <CachedRoute>
            <ProductCommentsPage />
          </CachedRoute>
        }
      />

      <Route
        path="product/:id/qa"
        element={
          <CachedRoute>
            <ProductQAPage />
          </CachedRoute>
        }
      />

      <Route
        path="product/:id/ask-question"
        element={
          <CachedRoute>
            <AskQuestionPage />
          </CachedRoute>
        }
      />

      <Route
        path="single-product/:id"
        element={
          <CachedRoute>
            <SingleProductDetail />
          </CachedRoute>
        }
      />

      <Route
        path="single-product/:id/comments"
        element={
          <CachedRoute>
            <ProductCommentsPage />
          </CachedRoute>
        }
      />

      <Route
        path="single-product/:id/ask-question"
        element={
          <CachedRoute>
            <AskQuestionPage />
          </CachedRoute>
        }
      />

      {/* All other routes - INSIDE MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <CachedRoute>
              <ConditionalHomepage />
            </CachedRoute>
          }
        />
        <Route
          path="for-you"
          element={
            <CachedRoute>
              <ConditionalHomepage />
            </CachedRoute>
          }
        />
        <Route
          path="index"
          element={
            <CachedRoute>
              <Index />
            </CachedRoute>
          }
        />

        <Route
          path="wallet"
          element={
            <CachedRoute>
              <Wallet />
            </CachedRoute>
          }
        />

        <Route
          path="messages"
          element={
            <CachedRoute>
              <Messages />
            </CachedRoute>
          }
        />

        <Route
          path="messages/:conversationId"
          element={
            <CachedRoute>
              <ChatPage />
            </CachedRoute>
          }
        />

        <Route
          path="profile/*"
          element={
            <CachedRoute>
              <ProfilePage />
            </CachedRoute>
          }
        />

        <Route
          path="more"
          element={
            <CachedRoute>
              <MoreMenu />
            </CachedRoute>
          }
        />
        <Route
          path="more-menu"
          element={
            <CachedRoute>
              <MoreMenu />
            </CachedRoute>
          }
        />
        <Route
          path="explore"
          element={
            <CachedRoute>
              <Explore />
            </CachedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <CachedRoute>
              <Wishlist />
            </CachedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <CachedRoute>
              <Notifications />
            </CachedRoute>
          }
        />
        <Route
          path="addresses"
          element={
            <CachedRoute>
              <Addresses />
            </CachedRoute>
          }
        />
        <Route
          path="help"
          element={
            <CachedRoute>
              <Help />
            </CachedRoute>
          }
        />

        <Route
          path="my-stations"
          element={
            <CachedRoute>
              <MyStations />
            </CachedRoute>
          }
        />

        <Route
          path="products"
          element={
            <CachedRoute>
              <ProductsPage />
            </CachedRoute>
          }
        />

        <Route
          path="cart"
          element={
            <CachedRoute>
              <CartPage />
            </CachedRoute>
          }
        />

        <Route
          path="menu"
          element={
            <CachedRoute>
              <MenuPage />
            </CachedRoute>
          }
        />

        <Route
          path="communes"
          element={
            <CachedRoute>
              <CommunesPage />
            </CachedRoute>
          }
        />

        {CategoryRoutes()}
        {ContentRoutes()}
        {AuthRoutes()}
        {AdminSellerRoutes()}
        {ProductEditRoutes()}
        {PaymentRoutes()}
        {MiscRoutes()}

        <Route path="mall" element={<MallPage />} />

        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}