// routes/PaymentRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import Checkout from "../pages/Checkout";
import ProductCheckout from "../pages/ProductCheckout";
import PayPalCheckout from "../pages/PayPalCheckout";
import PayPalHostedCheckout from "../pages/PayPalHostedCheckout";
import PayPalPayment from "../pages/PayPalPayment";
import DynamicPayPalCheckout from "../pages/DynamicPayPalCheckout";
import PayPalDepositPage from "../pages/PayPalDepositPage";
import DepositPage from "../pages/DepositPage";
import NFTPaymentPage from "../pages/NFTPaymentPage";
import TopUpPage from "../pages/TopUpPage";
import TransferPage from "../pages/TransferPage";
import TransferHomePage from "../pages/TransferHomePage";

export function PaymentRoutes() {
  return (
    <>
      <Route path="checkout" element={
        <CachedRoute shouldCache={false}>
          <Checkout />
        </CachedRoute>
      } />
      <Route path="product-checkout" element={
        <CachedRoute shouldCache={false}>
          <ProductCheckout />
        </CachedRoute>
      } />
      <Route path="paypal-checkout" element={
        <CachedRoute shouldCache={false}>
          <PayPalCheckout />
        </CachedRoute>
      } />
      <Route path="paypal-hosted-checkout" element={
        <CachedRoute shouldCache={false}>
          <PayPalHostedCheckout />
        </CachedRoute>
      } />
      <Route path="paypal-payment" element={
        <CachedRoute shouldCache={false}>
          <PayPalPayment />
        </CachedRoute>
      } />
      <Route path="dynamic-paypal-checkout" element={
        <CachedRoute shouldCache={false}>
          <DynamicPayPalCheckout />
        </CachedRoute>
      } />
      <Route path="paypal-deposit" element={
        <CachedRoute shouldCache={false}>
          <PayPalDepositPage />
        </CachedRoute>
      } />
      <Route path="deposit" element={
        <CachedRoute shouldCache={false}>
          <DepositPage />
        </CachedRoute>
      } />
      <Route path="nft-payment" element={
        <CachedRoute shouldCache={false}>
          <NFTPaymentPage />
        </CachedRoute>
      } />
      <Route path="topup" element={
        <CachedRoute shouldCache={false}>
          <TopUpPage />
        </CachedRoute>
      } />
      <Route path="transfer-old" element={
        <CachedRoute shouldCache={false}>
          <TransferPage />
        </CachedRoute>
      } />
      <Route path="transfer" element={
        <CachedRoute shouldCache={false}>
          <TransferHomePage />
        </CachedRoute>
      } />
    </>
  );
}