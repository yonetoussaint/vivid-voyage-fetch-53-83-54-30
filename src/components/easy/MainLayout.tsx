import React from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import VerticalTabs from './VerticalTabs';
import PumpSelector from './PumpSelector';

const MainLayout = ({ 
  date, 
  shift, 
  children,
  onMenuToggle,
  activeTab,
  onDateChange,
  onShiftChange,
  // Add these new props for PumpSelector
  pompes,
  pompeEtendue,
  setPompeEtendue,
  showPropane
}) => {
  // Calculate header heights dynamically
  const headerHeight = 64; // h-16 = 4rem = 64px
  const pumpSelectorHeight = 56; // py-3 (12px) + component (~44px)
  
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white ">
        <Header
          date={date}
          shift={shift}
          activeTab={activeTab}
          onMenuToggle={onMenuToggle}
          onDateChange={onDateChange}
          onShiftChange={onShiftChange}
        />
      </div>

      {/* Pump Selector - Fixed below header, only for pumps tab */}
      {activeTab === 'pumps' && (
        <div 
          className="fixed left-0 right-0 z-40 bg-white "
          style={{ top: `${headerHeight}px` }}
        >
          <div className="">
            <div className="max-w-6xl mx-auto">
              <PumpSelector 
                pompes={pompes}
                pompeEtendue={pompeEtendue}
                setPompeEtendue={setPompeEtendue}
                showPropane={showPropane}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacer - Adjust height based on whether PumpSelector is visible */}
      <div 
        className="flex-shrink-0"
        style={{ 
          height: activeTab === 'pumps' 
            ? `${headerHeight + pumpSelectorHeight}px` 
            : `${headerHeight}px` 
        }}
      ></div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Side Panel for desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;