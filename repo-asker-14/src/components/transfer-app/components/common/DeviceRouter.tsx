
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DeviceRouterProps {
  mobileComponent: React.ComponentType;
  desktopComponent?: React.ComponentType;
}

const DeviceRouter: React.FC<DeviceRouterProps> = ({ 
  mobileComponent: MobileComponent, 
  desktopComponent: DesktopComponent 
}) => {
  const isMobile = useIsMobile();

  // Prevent flash by not rendering until we know the device type
  if (isMobile === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If no desktop component is provided, use mobile component for both
  if (!DesktopComponent) {
    return <MobileComponent />;
  }

  return isMobile ? <MobileComponent /> : <DesktopComponent />;
};

export default DeviceRouter;
