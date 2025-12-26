// components/layout/MainLayout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationScreen from "@/components/home/header/LocationScreen";
import LocationListScreen from "@/components/home/header/LocationListScreen";
import LocationsPanel from "@/components/home/header/LocationsPanel";
import AuthOverlay from "@/components/auth/AuthOverlay";
import SignInBanner from "@/components/layout/SignInBanner";
import { useMainLayout } from "@/hooks/main-layout.hooks";
import { HeaderFilterProvider } from "@/contexts/HeaderFilterContext";

function MainLayoutContent() {
  const location = useLocation();

  const {
    // Refs
    headerRef,
    bottomNavRef,
    contentRef,

    // Page flags
    pageFlags,

    // Layout
    layoutHeightStyle,
    measurements,

    // Configuration
    headerProps,

    // State setters
    setShowProductUpload,

    // Context values
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    isLocationListScreenOpen,
    locationListScreenData,
    setLocationListScreenOpen,
    isLocationScreenOpen,
    setLocationScreenOpen,

    // Location panel state
    isLocationsPanelOpen,
    setIsLocationsPanelOpen,
    selectedCity,
    handleCitySelect
  } = useMainLayout();

  // Determine if we're on the mall route
  const isMallRoute = location.pathname === '/mall' || location.pathname.startsWith('/mall/');

  // Determine if we're on the communes route
  const isCommunesRoute = location.pathname === '/communes';

  // Prepare header props conditionally
  const finalHeaderProps = {
    ...headerProps,
    // Override header props for mall route
    ...(isMallRoute ? {
      showCategoryTabs: false, // Hide category tabs on mall
      showSearchList: true,    // Show search list on mall
      flatBorders: true,
      // Optional: Custom search items for mall
      searchListItems: [
        "Luxury watches", 
        "Designer bags", 
        "Premium electronics",
        "High-end fashion",
        "Luxury cosmetics",
        "Designer shoes",
        "Luxury jewelry"
      ]
    } : {
      showCategoryTabs: true,  // Show category tabs everywhere else
      showSearchList: false,   // Hide search list everywhere else
    }),
    // Pass the function to open locations panel
    onOpenLocationsPanel: () => setIsLocationsPanelOpen(true)
  };

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: layoutHeightStyle || '' }} />

      {/* Header - Now hidden on conversation detail pages */}
      {pageFlags?.shouldShowHeader && (
        <div ref={headerRef} className="app-header">
          <AliExpressHeader {...finalHeaderProps} />
        </div>
      )}

      {/* Main Content Area - Native-like scrolling */}
      <div 
        ref={contentRef} 
        className="app-content page-transition"
        style={{
          height: measurements?.contentHeight ? `${measurements.contentHeight}px` : '100vh',
          maxHeight: measurements?.contentHeight ? `${measurements.contentHeight}px` : '100vh',
          minHeight: measurements?.contentHeight ? `${measurements.contentHeight}px` : '100vh',
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

      {/* Sign In Banner - Hide on communes route */}
      {!isCommunesRoute && <SignInBanner />}

      {/* Product Upload Overlay */}
      <ProductUploadOverlay
        isOpen={false}
        onClose={() => setShowProductUpload(false)}
      />

      {/* Location List Screen */}
      {isLocationListScreenOpen && locationListScreenData && (
        <LocationListScreen
          title={locationListScreenData.title}
          items={locationListScreenData.items}
          onSelect={(item) => {
            locationListScreenData.onSelect(item);
            setLocationListScreenOpen(false);
          }}
          onClose={() => setLocationListScreenOpen(false)}
          searchPlaceholder={locationListScreenData.searchPlaceholder}
        />
      )}

      {/* Location Screen */}
      {isLocationScreenOpen && (
        <LocationScreen
          onClose={() => setLocationScreenOpen(false)}
          showHeader={true}
        />
      )}

      {/* Locations Panel - Only renders when isOpen is true */}
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

// Main export that wraps with provider
export default function MainLayout() {
  return (
    <HeaderFilterProvider>
      <MainLayoutContent />
    </HeaderFilterProvider>
  );
}