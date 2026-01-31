import React from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';

const MainLayout = ({ 
  date, 
  shift, 
  setDate, 
  setShift, 
  handleReinitialiserShift, 
  handleReinitialiserJour,
  children,
  onMenuToggle,
  activeTab 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        date={date}
        shift={shift}
        activeTab={activeTab}
        onMenuToggle={onMenuToggle}
        handleReinitialiserShift={handleReinitialiserShift}
        handleReinitialiserJour={handleReinitialiserJour}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Side Panel for desktop - always visible */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)] overflow-auto">
          <div className="">
              {children}         
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;