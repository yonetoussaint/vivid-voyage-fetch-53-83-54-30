import React from "react";
import { Outlet } from "react-router-dom";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationScreen from "@/components/home/header/LocationScreen";
import LocationListScreen from "@/components/home/header/LocationListScreen";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useMainLayout } from "@/hooks/main-layout.hooks";
import { HeaderFilterProvider } from "@/contexts/HeaderFilterContext";

function MainLayoutContent() {
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

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: layoutHeightStyle }} />

      {/* Header - Now hidden on conversation detail pages */}
      {pageFlags.shouldShowHeader && (
        <div ref={headerRef} className="app-header">
          <AliExpressHeader {...headerProps} />
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

      {/* Auth Overlay - Fixed with high z-index to appear above everything */}
      {isAuthOverlayOpen && (
        <div className="fixed inset-0 z-[9999]">
          
{/* Auth Overlay */}
<AuthOverlay
  isOpen={isAuthOverlayOpen}
  onClose={() => setIsAuthOverlayOpen(false)}
/>
        </div>
      )}
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