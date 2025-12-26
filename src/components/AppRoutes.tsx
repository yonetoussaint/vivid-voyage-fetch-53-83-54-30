// components/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Wallet from "@/pages/Wallet";
import Messages from '@/pages/Messages';
import { ChatPage } from '@/pages/Messages';
import ProfilePage from "@/pages/ProfilePage";
import MoreMenu from "@/pages/MoreMenu";
import Explore from '@/pages/Explore';
import Wishlist from '@/pages/Wishlist';
import Notifications from "@/pages/Notifications";
import Addresses from "@/pages/Addresses";
import Help from "@/pages/Help";
import MyStations from "@/pages/MyStations";
import ProductsPage from "@/pages/ProductsPage";
import CartPage from '@/pages/CartPage';
import MenuPage from '@/pages/MenuPage';
import AdminPage from "@/pages/AdminPage";
import MallPage from "@/pages/MallPage";
// Import other pages as needed

export function AppRoutes() {
  return (
    <Routes>
      {/* All routes inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* User Routes */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:conversationId" element={<ChatPage />} />
        <Route path="/profile/*" element={<ProfilePage />} />
        <Route path="/more" element={<MoreMenu />} />
        <Route path="/more-menu" element={<MoreMenu />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/help" element={<Help />} />
        <Route path="/my-stations" element={<MyStations />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* Mall Route */}
        <Route path="/mall" element={<MallPage />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Add other routes from your route functions here */}
        {/* Example: Homepage, Product, Category routes, etc. */}
        
      </Route>
    </Routes>
  );
}