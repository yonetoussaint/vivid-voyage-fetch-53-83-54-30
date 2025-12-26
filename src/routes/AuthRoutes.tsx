// routes/UserRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import Wallet from "../pages/Wallet";
import Messages from '../pages/Messages'; // Remove {} - it's a default export
import { ChatPage } from '../pages/Messages'; // Keep {} for named export
// Remove: import ConversationDetail from "../pages/ConversationDetail";
import ProfilePage from "../pages/ProfilePage";
import MoreMenu from "../pages/MoreMenu";
import Explore from '../pages/Explore';
import Wishlist from '../pages/Wishlist';
import Notifications from '../pages/Notifications';
import Addresses from '../pages/Addresses";
import Help from '../pages/Help';
import MyStations from "../pages/MyStations";
import ProductsPage from "../pages/ProductsPage";
import CartPage from '../pages/CartPage';
import MenuPage from '../pages/MenuPage';

export function UserRoutes() {
  return (
    <>
      <Route path="wallet" element={
        <CachedRoute>
          <Wallet />
        </CachedRoute>
      } />

      {/* Messages list */}
      <Route path="messages" element={
        <CachedRoute>
          <Messages />
        </CachedRoute>
      } />

      {/* Chat detail page - Use ChatPage from Messages.tsx */}
      <Route path="messages/:conversationId" element={
        <CachedRoute>
          <ChatPage />
        </CachedRoute>
      } />

      {/* Remove the duplicate route below */}
      {/* <Route path="/messages/:conversationId" element={<ChatPage />} /> */}

      <Route path="profile/*" element={
        <CachedRoute>
          <ProfilePage />
        </CachedRoute>
      } />

      <Route path="more" element={
        <CachedRoute>
          <MoreMenu />
        </CachedRoute>
      } />
      <Route path="more-menu" element={
        <CachedRoute>
          <MoreMenu />
        </CachedRoute>
      } />
      <Route path="explore" element={
        <CachedRoute>
          <Explore />
        </CachedRoute>
      } />
      <Route path="wishlist" element={
        <CachedRoute>
          <Wishlist />
        </CachedRoute>
      } />
      <Route path="notifications" element={
        <CachedRoute>
          <Notifications />
        </CachedRoute>
      } />
      <Route path="addresses" element={
        <CachedRoute>
          <Addresses />
        </CachedRoute>
      } />
      <Route path="help" element={
        <CachedRoute>
          <Help />
        </CachedRoute>
      } />
      
      {/* FIXED: Changed from "/my-stations" to "my-stations" */}
      <Route path="my-stations" element={
        <CachedRoute>
          <MyStations />
        </CachedRoute>
      } />
      
      {/* FIXED: Changed from "/products" to "products" */}
      <Route path="products" element={
        <CachedRoute>
          <ProductsPage />
        </CachedRoute>
      } />
      
      {/* FIXED: Changed from "/cart" to "cart" */}
      <Route path="cart" element={
        <CachedRoute>
          <CartPage />
        </CachedRoute>
      } />
      
      {/* FIXED: Changed from "/menu" to "menu" */}
      <Route path="menu" element={
        <CachedRoute>
          <MenuPage />
        </CachedRoute>
      } />
    </>
  );
}