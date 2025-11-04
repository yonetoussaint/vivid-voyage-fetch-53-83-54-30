// components/layout/StickyTabsLayout.tsx
import React from 'react';
import { useStickyTabs } from '@/hooks/useStickyTabs';
import TabsNavigation, { TabsNavigationRef } from '@/components/home/TabsNavigation';

export interface TabItem {
  id: string;
  label: string;
  icon?: any;
}

interface StickyTabsLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  headerHeight: number;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showTopBorder?: boolean;
  variant?: "underline" | "pills";
  className?: string;
  stickImmediately?: boolean;
  isEnabled?: boolean;
  normalTabsRef?: React.RefObject<TabsNavigationRef>;
  stickyTabsRef?: React.RefObject<TabsNavigationRef>;
}

const StickyTabsLayout: React.FC<StickyTabsLayoutProps> = ({
  children,
  header,
  headerHeight,
  tabs,
  activeTab,
  onTabChange,
  showTopBorder = false,
  variant = "underline",
  className = '',
  stickImmediately = false,
  isEnabled = true,
  normalTabsRef,
  stickyTabsRef
}) => {
  const {
    tabsContainerRef,
    tabsRef,
    isSticky,
    tabsHeight
  } = useStickyTabs({
    headerHeight,
    isEnabled,
    stickImmediately
  });

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {header}
      </div>

      {/* Tabs Navigation */}
      <div
        ref={tabsContainerRef}
        style={{ height: isSticky ? `${tabsHeight}px` : 'auto' }}
      >
        <div className="relative">
          {/* Normal Tabs - Always in document flow */}
          <div
            ref={tabsRef}
            style={{ 
              position: 'relative', 
              zIndex: 30,
              marginTop: `${headerHeight}px`
            }}
          >
            <TabsNavigation
              ref={normalTabsRef}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showTopBorder={showTopBorder}
              variant={variant}
            />
          </div>

          {/* Sticky Tabs - Fixed when scrolling */}
          <div
            className={`fixed left-0 right-0 z-40 bg-white shadow-sm transition-all duration-300 ease-out ${
              isSticky
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }`}
            style={{
              top: `${headerHeight}px`,
              willChange: 'transform, opacity',
            }}
          >
            <TabsNavigation
              ref={stickyTabsRef}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showTopBorder={true}
              variant={variant}
              className="bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        paddingTop: isSticky || stickImmediately 
          ? `${headerHeight + tabsHeight}px` 
          : `${headerHeight}px` 
      }}>
        {children}
      </div>
    </div>
  );
};

export default StickyTabsLayout;
