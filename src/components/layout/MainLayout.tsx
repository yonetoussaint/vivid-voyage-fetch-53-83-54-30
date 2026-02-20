// MainLayout.jsx (updated with meeting type selector)
import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';
import PumpSelector from './PumpSelector';
import TaskTypeSelector from './TaskTypeSelector';
import MeetingTypeSelector from './MeetingTypeSelector'; // Import MeetingTypeSelector
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
  // Meeting props
  meetingType,
  setMeetingType,
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
  }, [activeTab, vendeurs, vendeurActif, taskType, meetingType]);

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
          <VendorTabSelector
            vendeurs={vendeurs}
            vendeurActif={vendeurActif}
            setVendeurActif={setVendeurActif}
          />
        )}

        {/* Task Type Selector - Only for tasks tab */}
        {activeTab === 'tasks' && (
          <TaskTypeSelector
            taskType={taskType}
            setTaskType={setTaskType}
          />
        )}

        {/* Meeting Type Selector - Only for meetings tab */}
        {activeTab === 'meetings' && (
          <MeetingTypeSelector
            meetingType={meetingType}
            setMeetingType={setMeetingType}
          />
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