import React from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';

const MainLayout = ({ 
  date, 
  shift, 
  children,
  onMenuToggle,
  activeTab,
  onDateChange,
  onShiftChange 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header is already sticky with top-0 z-30 */}
      <Header
        date={date}
        shift={shift}
        activeTab={activeTab}
        onMenuToggle={onMenuToggle}
        onDateChange={onDateChange}
        onShiftChange={onShiftChange}
      />

      {/* Main Content Area - fills remaining space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Panel for desktop - always visible */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content - scrolls independently */}
        <main className="flex-1 overflow-auto">
          <div className="p-2 sm:p-4">
            {children}         
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;