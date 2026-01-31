import React, { useRef, useEffect, useState } from 'react';
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
  pompes,
  pompeEtendue,
  setPompeEtendue,
  showPropane
}) => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64); // Default fallback

  useEffect(() => {
    if (headerRef.current) {
      const updateHeight = () => {
        setHeaderHeight(headerRef.current.offsetHeight);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [activeTab]); // Recalculate when tab changes

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header Container - Let it size naturally */}
      <div 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white "
      >
        <Header
          date={date}
          shift={shift}
          activeTab={activeTab}
          onMenuToggle={onMenuToggle}
          onDateChange={onDateChange}
          onShiftChange={onShiftChange}
        />
        
        {/* Pump Selector - Part of the header flow */}
        {activeTab === 'pumps' && (
          <div className="bg-white">
            
              <PumpSelector 
                pompes={pompes}
                pompeEtendue={pompeEtendue}
                setPompeEtendue={setPompeEtendue}
                showPropane={showPropane}
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
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;