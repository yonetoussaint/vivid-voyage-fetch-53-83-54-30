// components/layout/MainLayout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationsPanel from "@/components/home/header/LocationsPanel";
import AuthOverlay from "@/components/auth/AuthOverlay";
import SignInBanner from "@/components/layout/SignInBanner";
import { useMainLayout } from "@/hooks/main-layout.hooks";
import { HeaderFilterProvider } from "@/contexts/HeaderFilterContext";

function MainLayoutContent() {
  const location = useLocation();
  
  // Destructure ALL required values
  const {
    headerRef,
    bottomNavRef,
    contentRef,
    pageFlags,
    layoutHeightStyle, // Make sure this is here
    measurements,
    headerProps,
    setShowProductUpload,
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    isLocationListScreenOpen,
    locationListScreenData,
    setLocationListScreenOpen,
    isLocationScreenOpen,
    setLocationScreenOpen,
    isLocationsPanelOpen,
    setIsLocationsPanelOpen,
    selectedCity,
    handleCitySelect
  } = useMainLayout();

  // Debug log to check if layoutHeightStyle exists
  console.log('layoutHeightStyle exists:', !!layoutHeightStyle);
  console.log('pageFlags exists:', !!pageFlags);

  // If layoutHeightStyle is undefined, provide a fallback
  const safeLayoutHeightStyle = layoutHeightStyle || `
    :root {
      --header-height: 0px;
      --bottom-nav-height: 0px;
    }
    .app-content {
      height: 100vh;
    }
  `;

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: safeLayoutHeightStyle }} />

      {/* Header */}
      {pageFlags?.shouldShowHeader && (
        <div ref={headerRef} className="app-header">
          <AliExpressHeader 
            {...headerProps}
            onOpenLocationsPanel={() => setIsLocationsPanelOpen(true)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div 
        ref={contentRef} 
        className="app-content page-transition"
        style={{
          height: measurements?.contentHeight ? `${measurements.contentHeight}px` : '100vh',
          maxHeight: measurements?.contentHeight ? `${measurements.contentHeight}px` : '100vh',
        }}
      >
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {pageFlags?.shouldShowBottomNav && (
        <div ref={bottomNavRef} className="app-bottom-nav">
          <IndexBottomNav />
        </div>
      )}

      {/* Sign In Banner */}
      <SignInBanner />

      {/* Product Upload Overlay */}
      <ProductUploadOverlay
        isOpen={false}
        onClose={() => setShowProductUpload(false)}
      />

      {/* Locations Panel */}
      <LocationsPanel
        isOpen={isLocationsPanelOpen}
        onClose={() => setIsLocationsPanelOpen(false)}
        currentCity={selectedCity}
        onCitySelect={handleCitySelect}
      />

      {/* Auth Overlay */}
      <AuthOverlay />
    </div>
  );
}

export default function MainLayout() {
  return (
    <HeaderFilterProvider>
      <MainLayoutContent />
    </HeaderFilterProvider>
  );
}