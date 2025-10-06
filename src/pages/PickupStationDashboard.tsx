
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PickupStationLayout from '@/components/pickup-station-app/PickupStationLayout';
import PickupStationOverview from '@/components/pickup-station-app/pages/PickupStationOverview';
import PickupStationPackages from '@/components/pickup-station-app/pages/PickupStationPackages';
import PickupStationCustomers from '@/components/pickup-station-app/pages/PickupStationCustomers';
import PickupStationAnalytics from '@/components/pickup-station-app/pages/PickupStationAnalytics';
import PickupStationNotifications from '@/components/pickup-station-app/pages/PickupStationNotifications';
import PickupStationSettings from '@/components/pickup-station-app/pages/PickupStationSettings';

const PickupStationDashboard = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <PickupStationLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/pickup-station/overview" replace />} />
        <Route path="/overview" element={<PickupStationOverview />} />
        <Route path="/packages" element={<PickupStationPackages />} />
        <Route path="/customers" element={<PickupStationCustomers />} />
        <Route path="/analytics" element={<PickupStationAnalytics />} />
        <Route path="/notifications" element={<PickupStationNotifications />} />
        <Route path="/settings" element={<PickupStationSettings />} />
      </Routes>
    </PickupStationLayout>
  );
};

export default PickupStationDashboard;
