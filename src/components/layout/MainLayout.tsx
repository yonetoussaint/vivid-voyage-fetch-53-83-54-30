import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Add useLocation
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationScreen from "@/components/home/header/LocationScreen";
import LocationListScreen from "@/components/home/header/LocationListScreen";
import AuthOverlay from "@/components/auth/AuthOverlay";
import SignInBanner from "@/components/layout/SignInBanner";
import { useMainLayout } from "@/hooks/main-layout.hooks";
import { HeaderFilterProvider } from "@/contexts/HeaderFilterContext";

function MainLayoutContent() {
  const location = useLocation(); // Get current route
  
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
    setLocationScreenOpen
  } = useMainLayout();

  // Determine if we're on the mall route
  const isMallRoute = location.pathname === '/mall' || location.pathname.startsWith('/mall/');
  
  // Prepare header props conditionally
  const finalHeaderProps = {
    ...headerProps,
    // Override header props for mall route
    ...(isMallRoute ? {
      showCategoryTabs: false, // Hide category tabs on mall
      showSearchList: true,    // Show search list on mall
      searchListTitle: "Popular in Mall",
      flatBorders: true,
      // Optional: Custom search items for mall
      // searchListItems: ["Luxury watches", "Designer bags", "Premium electronics"]
    } : {
      showCategoryTabs: true,  // Show category tabs everywhere else
      showSearchList: false,   // Hide search list everywhere else
    })
  };

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: layoutHeightStyle }} />

      {/* Header - Now hidden on conversation detail pages */}
      {pageFlags.shouldShowHeader && (
        <div ref={headerRef} className="app-header">
          <AliExpressHeader {...finalHeaderProps} />
        </div>
      )}

      {/* Main Content Area - Native-like scrolling */}
      <div 
        ref={contentRef} 
        className="app-content page-transition"
        style={{
          height: `${measurements.contentHeight}px`,
          maxHeight: `${measurements.contentHeight}px`,
          minHeight: `${measurements.contentHeight}px`,
        }}
      >
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {pageFlags.shouldShowBottomNav && (
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