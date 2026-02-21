// MainLayout.jsx
import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';
import TabSelector from './TabSelector';
import { Flame, Droplets, Fuel, Zap, Gauge, Circle } from 'lucide-react';

const MainLayout = ({ 
  date, 
  shift, 
  children,
  onMenuToggle,
  activeTab,
  onDateChange,
  onShiftChange,
  // Pump props
  pompes,
  pompeEtendue,
  setPompeEtendue,
  showPropane,
  // Filter props
  filterType,
  setFilterType,
  // Vendor props
  vendeurs,
  vendeurActif,
  setVendeurActif,
  // Reset functions
  onResetShift,
  onResetDay,
  // Tasks stats
  tasksStats,
  // Optional vendor stats for badges
  vendorStats = {}
}) => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  useEffect(() => {
    if (headerRef.current) {
      const updateHeight = () => {
        setHeaderHeight(headerRef.current.offsetHeight);
      };

      updateHeight();
      window.addEventListener('resize', updateHeight);

      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [activeTab, vendeurs, vendeurActif, filterType]);

  // Determine if we should show the vendor selector
  const showVendorSelector = activeTab === 'vendeurs' || activeTab === 'depots' || activeTab === 'liasse';

  // Color palette for vendor tabs
  const colorPalette = [
    { bg: 'bg-blue-600', border: 'border-blue-600', badge: 'bg-blue-500' },
    { bg: 'bg-purple-600', border: 'border-purple-600', badge: 'bg-purple-500' },
    { bg: 'bg-orange-600', border: 'border-orange-600', badge: 'bg-orange-500' },
    { bg: 'bg-green-600', border: 'border-green-600', badge: 'bg-green-500' },
    { bg: 'bg-indigo-600', border: 'border-indigo-600', badge: 'bg-indigo-500' },
    { bg: 'bg-yellow-600', border: 'border-yellow-600', badge: 'bg-yellow-500' },
    { bg: 'bg-emerald-600', border: 'border-emerald-600', badge: 'bg-emerald-500' },
    { bg: 'bg-red-600', border: 'border-red-600', badge: 'bg-red-500' },
  ];

  // Build vendor tabs array
  const vendorTabs = [
    {
      id: null,
      label: 'Tous les Vendeurs',
      icon: 'users',
      badge: vendeurs?.length || 0,
      badgeColor: 'bg-blue-500'
    },
    ...vendeurs.map((vendeur, index) => {
      const colorIndex = index % colorPalette.length;
      const stats = vendorStats[vendeur] || {};
      
      return {
        id: vendeur,
        label: vendeur,
        icon: 'user',
        activeColor: `${colorPalette[colorIndex].bg} text-white border-${colorPalette[colorIndex].border.replace('border-', '')}`,
        badge: stats.affectations || 0,
        badgeColor: colorPalette[colorIndex].badge
      };
    })
  ];

  // Pump icons mapping
  const pumpIcons = [<Droplets size={16} />, <Fuel size={16} />, <Gauge size={16} />, <Zap size={16} />];

  // Build pump tabs array
  const pumpTabs = pompes.map((pompe, index) => ({
    id: pompe,
    label: `Pompe ${index + 1}`,
    icon: pumpIcons[index] || <Circle size={16} />,
    rounded: true
  }));

  // Task filter tabs
  const taskTabs = [
    { id: 'all', label: 'Toutes' },
    { id: 'pending', label: 'En attente' },
    { id: 'completed', label: 'Terminées' },
    { id: 'critical', label: 'Critiques' }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header Container */}
      <div 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
      >
        <Header
          date={date}
          shift={shift}
          activeTab={activeTab}
          onMenuToggle={onMenuToggle}
          onDateChange={onDateChange}
          onShiftChange={onShiftChange}
          onResetShift={onResetShift}
          onResetDay={onResetDay}
          tasksStats={tasksStats}
        />

        {/* Pump Selector - Only for pumps tab */}
        {activeTab === 'pumps' && (
          <div className="bg-white border-b border-slate-200">
            <TabSelector
              tabs={pumpTabs}
              activeTab={pompeEtendue}
              onTabChange={setPompeEtendue}
              variant="default"
              size="md"
              showPropane={showPropane}
              propaneActive={pompeEtendue === 'propane'}
              onPropaneClick={() => setPompeEtendue('propane')}
              containerClassName="py-1"
            />
          </div>
        )}

        {/* Vendor Tab Selector - For vendeurs, depots, and liasse tabs */}
        {showVendorSelector && (
          <div className="bg-white border-b border-slate-200">
            <TabSelector
              tabs={vendorTabs}
              activeTab={vendeurActif}
              onTabChange={setVendeurActif}
              variant="default"
              size="md"
              showBadges={true}
              containerClassName="py-1"
            />
          </div>
        )}

        {/* Task Type Selector - Only for tasks tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white border-b border-slate-200">
            <TabSelector
              tabs={taskTabs}
              activeTab={filterType}
              onTabChange={setFilterType}
              variant="pills"
              size="sm"
              containerClassName="py-2"
            />
          </div>
        )}
      </div>

      {/* Spacer - Dynamic height based on actual header height */}
      <div style={{ height: `${headerHeight}px` }}></div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Side Panel for desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;