// components/easy/MainLayout.jsx
import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';
import PumpSelector from './PumpSelector';
import TaskTypeSelector from './TaskTypeSelector';
import VendorTabSelector from './VendorTabSelector';

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
  // Task props
  taskType,
  setTaskType,
  // Vendor props
  vendeurs,
  vendeurActif,
  setVendeurActif,
  // Reset functions
  onResetShift,
  onResetDay,
  // Tasks stats
  tasksStats
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
  }, [activeTab, vendeurs, vendeurActif]);

  // Debug logging
  useEffect(() => {
    console.log('MainLayout activeTab:', activeTab);
    console.log('MainLayout vendeurs:', vendeurs);
    console.log('MainLayout vendeurActif:', vendeurActif);
  }, [activeTab, vendeurs, vendeurActif]);

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

        {/* Debug indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1">
            Active Tab: {activeTab}
          </div>
        )}

        {/* Pump Selector - Only for pumps tab */}
        {activeTab === 'pumps' && (
          <div className="bg-white border-b border-slate-200">
            <PumpSelector 
              pompes={pompes}
              pompeEtendue={pompeEtendue}
              setPompeEtendue={setPompeEtendue}
              showPropane={showPropane}
            />
          </div>
        )}

        {/* Vendor Tab Selector - For vendeurs tab */}
        {activeTab === 'vendeurs' && (
          <div className="bg-white border-b border-slate-200 py-2">
            <VendorTabSelector
              vendeurs={vendeurs}
              vendeurActif={vendeurActif}
              setVendeurActif={setVendeurActif}
            />
          </div>
        )}

        {/* Task Type Selector - Only for tasks tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white border-b border-slate-200 py-2">
            <TaskTypeSelector
              taskType={taskType}
              setTaskType={setTaskType}
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