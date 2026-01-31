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
    <>
      {/* Header outside of any flex container - fixed at top */}
      <div className="sticky top-0 z-50">
        <Header
          date={date}
          shift={shift}
          activeTab={activeTab}
          onMenuToggle={onMenuToggle}
          onDateChange={onDateChange}
          onShiftChange={onShiftChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-screen bg-gray-50 pt-16"> {/* Add padding-top equal to header height */}
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
    </>
  );
};

export default MainLayout;