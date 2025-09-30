
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopFooter from "@/components/desktop/DesktopFooter";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import SignInScreen from "@/auth-sdk/components/SignInScreen";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth-sdk/contexts/AuthContext";
import { useNativeCapabilities } from "@/hooks/useNativeCapabilities";

function MainLayoutContent() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated, isLoading } = useAuth();
  const { isNative } = useNativeCapabilities();

  const isHomePage = pathname === "/";
  const isMultiStepTransfer = pathname === "/" || pathname === "/transfer" || pathname === "/transfer-sheet";
  const isAccountPage = pathname === "/account";
  const isComponentsPage = pathname === "/components";
  const isBottomNavExcludedPage = ["/locations", "/track-transfer", "/account", "/transfer-history"].includes(pathname);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  // Calculate bottom padding based on whether we're in multi-step transfer mode
  const getBottomPadding = () => {
    if (!isMobile || isComponentsPage || isBottomNavExcludedPage) return '0px';
    if (isMultiStepTransfer) return '112px'; // 64px (continue button) + 48px (nav bar)
    return '48px'; // Just nav bar
  };

  const headerHeightStyle = `
    :root {
      --header-height: 0px;
      --bottom-nav-height: ${getBottomPadding()};
    }
  `;

  return (
    <div className={`min-h-screen flex flex-col ${isNative ? 'native-press' : ''} bg-white text-foreground`}>
      <style dangerouslySetInnerHTML={{ __html: headerHeightStyle }} />

      <main className={`flex-grow relative ${isMobile ? '' : 'min-h-screen'}`} style={{ paddingBottom: getBottomPadding() }}>
        <Outlet />
      </main>

      {/* Desktop footer - show for all desktop pages except components */}
      {!isMobile && !isComponentsPage && <DesktopFooter />}

      {/* Mobile bottom navigation - hide on components page, multi-step transfer page, and excluded pages */}
      {isMobile && !isComponentsPage && !isMultiStepTransfer && !isBottomNavExcludedPage && <IndexBottomNav />}
    </div>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}
