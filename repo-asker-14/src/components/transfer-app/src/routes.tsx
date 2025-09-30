import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "@/components/layout/MainLayout";
import MobileMultiStepTransferSheetPage from "@/pages/MobileMultiStepTransferSheetPage";
import DesktopMultiStepTransferPage from "@/components/desktop/DesktopMultiStepTransferPage";
import DeviceRouter from "@/components/common/DeviceRouter";
import TransferHistoryPage from "@/pages/TransferHistoryPage";
import TransferDetailsPage from "@/pages/TransferDetailsPage"; // <-- import the details page
import TrackTransferPage from "@/pages/TrackTransferPage";
import LocationsPage from "@/pages/LocationsPage";
import AccountPage from "@/pages/AccountPage";
import ComponentsPage from "@/pages/ComponentsPage";
import HelloPage from "@/pages/HelloPage";
import NotFound from "@/components/NotFound";
import SignInScreen from "@/auth-sdk/components/SignInScreen";
import OAuthCallback from "@/auth-sdk/components/OAuthCallback";
import DashboardCallback from "@/auth-sdk/components/DashboardCallback";
import AuthSuccessCallback from "@/auth-sdk/components/AuthSuccessCallback";
import AuthErrorCallback from "@/auth-sdk/components/AuthErrorCallback";
import AuthCallback from "@/auth-sdk/components/AuthCallback";
import PayPalCheckout from "@/components/transfer/PayPalCheckout"; // or wherever you placed it

// Component that renders the appropriate transfer page based on device
const TransferPageRouter = () => (
  <DeviceRouter
    mobileComponent={MobileMultiStepTransferSheetPage}
    desktopComponent={DesktopMultiStepTransferPage}
  />
);

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInScreen />
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  },
  {
    path: "/auth/success",
    element: <AuthSuccessCallback />
  },
  {
    path: "/auth/error",
    element: <AuthErrorCallback />
  },
  {
    path: "/dashboard",
    element: <DashboardCallback />
  },
  {
    path: "/",
    element: <App><MainLayout /></App>,
    children: [
      { 
        index: true, 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer", 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer-sheet", 
        element: <TransferPageRouter />
      },
      { 
        path: "transfer-history", 
        element: <TransferHistoryPage />
      },
      { 
        path: "transfer-history/:id",
        element: <TransferDetailsPage />
      },
      { 
        path: "track-transfer", 
        element: <TrackTransferPage />
      },
      { 
        path: "locations", 
        element: <LocationsPage />
      },
      { 
        path: "account", 
        element: <AccountPage />
      },
      { 
        path: "components", 
        element: <ComponentsPage />
      },
      { 
        path: "hello", 
        element: <HelloPage />
      },
      { 
        path: "paypal-checkout",    // Add this line
        element: <PayPalCheckout />  // Add this line
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);