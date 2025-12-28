// routes/UserRoutes.tsx - RENAMED TO AuthRoutes (but keeping user imports)
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import Wallet from "../pages/Wallet";
import Messages from '../pages/Messages'; // Remove {} - it's a default export
import { ChatPage } from '../pages/Messages'; // Keep {} for named export
// Remove: import ConversationDetail from "../pages/ConversationDetail";
import ProfilePage from "../pages/ProfilePage";

export function AuthRoutes() { // Changed from UserRoutes to AuthRoutes
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

      <Route path="profile/*" element={
        <CachedRoute>
          <ProfilePage />
        </CachedRoute>
      } />
    </>
  );
}