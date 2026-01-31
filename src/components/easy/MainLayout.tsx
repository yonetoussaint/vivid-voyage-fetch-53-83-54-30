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
    <div className="h-screen flex flex-col">
      {/* Fixed Header Container - This is what makes it sticky */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <Header
          date={date}
          shift={shift}
          activeTab={activeTab}
          onMenuToggle={onMenuToggle}
          onDateChange={onDateChange}
          onShiftChange={onShiftChange}
        />
      </div>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 flex-shrink-0"></div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Side Panel for desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content - This will scroll */}
        <main className="flex-1 overflow-auto">
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;