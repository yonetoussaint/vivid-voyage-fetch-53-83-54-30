// MainLayout.jsx
import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';
import TabSelector from './TabSelector';
import { Flame, Droplets, Fuel, Zap, Gauge, Circle, Users, User, DollarSign } from 'lucide-react';

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
  // Conditionnement props
  conditionnementDenom,
  setConditionnementDenom,
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
  }, [activeTab, vendeurs, vendeurActif, filterType, conditionnementDenom]);

  // Determine if we should show the vendor selector
  const showVendorSelector = activeTab === 'vendeurs' || activeTab === 'depots' || activeTab === 'conditionnement';

  // Color palette for vendor tabs (from original VendorTabSelector)
  const colorPalette = [
    { color: 'bg-blue-600 text-white', borderColor: 'border-blue-600', badge: 'bg-blue-500' },
    { color: 'bg-purple-600 text-white', borderColor: 'border-purple-600', badge: 'bg-purple-500' },
    { color: 'bg-orange-600 text-white', borderColor: 'border-orange-600', badge: 'bg-orange-500' },
    { color: 'bg-green-600 text-white', borderColor: 'border-green-600', badge: 'bg-green-500' },
    { color: 'bg-indigo-600 text-white', borderColor: 'border-indigo-600', badge: 'bg-indigo-500' },
    { color: 'bg-yellow-600 text-white', borderColor: 'border-yellow-600', badge: 'bg-yellow-500' },
    { color: 'bg-emerald-600 text-white', borderColor: 'border-emerald-600', badge: 'bg-emerald-500' },
    { color: 'bg-red-600 text-white', borderColor: 'border-red-600', badge: 'bg-red-500' },
  ];

  // Build vendor tabs array
  const vendorTabs = [
    {
      id: null,
      label: 'Tous les Vendeurs',
      icon: <Users className="w-4 h-4" />,
      activeColor: 'bg-blue-600 text-white border-blue-600',
      badge: vendeurs?.length || 0,
      badgeColor: 'bg-blue-500'
    },
    ...vendeurs.map((vendeur, index) => {
      const colorIndex = index % colorPalette.length;
      const stats = vendorStats[vendeur] || {};
      
      return {
        id: vendeur,
        label: vendeur,
        icon: <User className="w-4 h-4" />,
        activeColor: colorPalette[colorIndex].color + ' border-' + colorPalette[colorIndex].borderColor.replace('border-', ''),
        badge: stats.affectations || 0,
        badgeColor: colorPalette[colorIndex].badge
      };
    })
  ];

  // Pump icons mapping (from original PumpSelector)
  const pumpIcons = [<Droplets size={14} />, <Fuel size={14} />, <Gauge size={14} />, <Zap size={14} />];

  // Build pump tabs array
  const pumpTabs = pompes.map((pompe, index) => ({
    id: pompe,
    label: `Pompe ${index + 1}`,
    icon: pumpIcons[index] || <Circle size={14} />
  }));

  // Task filter tabs
  const taskTabs = [
    { id: 'all', label: 'Toutes' },
    { id: 'pending', label: 'En attente' },
    { id: 'completed', label: 'Terminées' },
    { id: 'critical', label: 'Critiques' }
  ];

  // Conditionnement denomination tabs
  const denominationValues = [1000, 500, 250, 100, 50, 25, 10, 5];
  const conditionnementTabs = denominationValues.map(value => ({
    id: value,
    label: `${value} Gdes`,
    icon: <DollarSign className="w-3 h-3" />
  }));

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
              size="md"
              showPropane={showPropane}
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
              size="md"
              showBadges={true}
              containerClassName="py-1"
            />
          </div>
        )}

        {/* Conditionnement Denomination Selector - Only for conditionnement tab */}
        {activeTab === 'conditionnement' && (
          <div className="bg-white border-b border-slate-200">
            <TabSelector
              tabs={conditionnementTabs}
              activeTab={conditionnementDenom}
              onTabChange={setConditionnementDenom}
              size="sm"
              containerClassName="py-2"
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