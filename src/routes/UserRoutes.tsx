// routes/UserRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import Wallet from "../pages/Wallet";
import { Messages, ChatPage } from '../pages/Messages';
import ConversationDetail from "../pages/ConversationDetail";
import ProfilePage from "../pages/ProfilePage";
import MoreMenu from "../pages/MoreMenu";
import Explore from '../pages/Explore';
import Wishlist from '../pages/Wishlist';
import Notifications from '../pages/Notifications';
import Addresses from '../pages/Addresses';
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
      <Route path="messages" element={
        <CachedRoute>
          <Messages />
        </CachedRoute>
      } />
      <Route path="messages/:conversationId" element={
        <CachedRoute>
          <ConversationDetail />
        </CachedRoute>
      } />
      <Route path="profile/*" element={
        <CachedRoute>
          <ProfilePage />
        </CachedRoute>
      } />

<Route path="/messages/:conversationId" element={<ChatPage />} />

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
      <Route path="/my-stations" element={
        <CachedRoute>
          <MyStations />
        </CachedRoute>
      } />
      <Route path="/products" element={
        <CachedRoute>
          <ProductsPage />
        </CachedRoute>
      } />
      <Route path="/cart" element={
        <CachedRoute>
          <CartPage />
        </CachedRoute>
      } />
      <Route path="/menu" element={
        <CachedRoute>
          <MenuPage />
        </CachedRoute>
      } />
    </>
  );
}

