import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";

export default function TabsNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "", 
  style = {}, 
  edgeToEdge = false, 
  isLoading = false,
  variant = "underline" // "underline" | "pills"
}) {
  const tabRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const isInitialMount = useRef(true);

  // Initialize active tab on mount if not provided
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      const firstTab = tabs[0];
      if (firstTab) {
        onTabChange(firstTab.id);
      }
    }
  }, [tabs, activeTab, onTabChange]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
    isInitialMount.current = true;
  }, [tabs]);

  // Function to update underline position and width - matches reference component
  const updateUnderline = useCallback(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span:last-child');
      
      if (textSpan) {
        // Force layout recalculation before measuring
        void activeTabElement.offsetHeight;
        void textSpan.offsetHeight;

        // Use getBoundingClientRect for more accurate measurements
        const textRect = textSpan.getBoundingClientRect();
        const textWidth = textRect.width;

        // Make underline 60% of text width to match reference
        const newWidth = Math.max(textWidth * 0.6, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  }, [activeTab, tabs]);

  // Use useLayoutEffect for initial positioning - matches reference
  useLayoutEffect(() => {
    if (activeTab && tabs.length > 0 && variant === "underline") {
      updateUnderline();
    }
  }, [activeTab, tabs, variant, updateUnderline]);

  // Backup async updates for edge cases
  useEffect(() => {
    if (activeTab && tabs.length > 0 && variant === "underline") {
      const timers = [
        setTimeout(() => updateUnderline(), 50),
        setTimeout(() => updateUnderline(), 200),
      ];

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [activeTab, tabs, variant, updateUnderline]);

  // Update on resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (activeTab && tabs.length > 0 && variant === "underline") {
        updateUnderline();
      }
    };

    const handleScroll = () => {
      if (activeTab && tabs.length > 0 && variant === "underline") {
        updateUnderline();
      }
      setShouldAutoScroll(false);
    };

    window.addEventListener('resize', handleResize);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeTab, tabs, variant, updateUnderline]);

  // Handle tab scrolling
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const paddingLeft = 8; // Matches reference component gap-1
      const newScrollLeft = activeTabElement.offsetLeft - paddingLeft;

      containerElement.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }

    const timer = setTimeout(() => setShouldAutoScroll(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab, tabs, shouldAutoScroll]);

  const handleTabClick = (id) => {
    setShouldAutoScroll(true);
    
    // Immediate underline update like reference component
    const activeTabIndex = tabs.findIndex(tab => tab.id === id);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement && variant === "underline") {
      const textSpan = activeTabElement.querySelector('span:last-child');
      if (textSpan) {
        const textWidth = textSpan.scrollWidth;
        const newWidth = Math.max(textWidth * 0.6, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    } else if (variant === "underline") {
      // If refs aren't available yet, retry after a short delay
      setTimeout(() => {
        updateUnderline();
      }, 10);
    }

    onTabChange(id);
  };

  // Ref callback that updates underline when refs are set
  const setTabRef = useCallback((el, index, id) => {
    tabRefs.current[index] = el;

    // If this is the active tab and we have the element, update underline immediately
    if (el && id === activeTab && isInitialMount.current && variant === "underline") {
      requestAnimationFrame(() => {
        updateUnderline();
        isInitialMount.current = false;
      });
    }
  }, [activeTab, variant, updateUnderline]);

  // Default style - matches reference component exactly
  const defaultStyle = {
    maxHeight: '40px',
    opacity: 1,
    backgroundColor: 'white',
    ...style
  };

  // Tab styles - matches reference component exactly
  const getTabClassName = (isActive) => {
    if (variant === "pills") {
      return `relative flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap outline-none flex-shrink-0 ${
        isActive
          ? 'bg-pink-100 text-pink-700'
          : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`;
    }
    
    // Underline variant - matches reference exactly
    return `relative flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap outline-none flex-shrink-0 ${
      isActive
        ? 'text-red-600'
        : 'text-gray-700 hover:text-red-600'
    }`;
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-white ${className}`}
        style={defaultStyle}
      >
        <div className="h-full w-full">
          <div
            className="flex items-center overflow-x-auto no-scrollbar h-full w-full relative"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex items-center gap-1">
              {tabs.map((tab, index) => {
                const widths = ['w-16', 'w-20', 'w-16', 'w-20', 'w-20', 'w-16', 'w-20', 'w-16', 'w-20'];
                const width = widths[index] || 'w-16';
                return (
                  <div key={tab.id} className="flex-shrink-0">
                    <div className={`h-5 bg-gray-200 rounded ${width} animate-pulse`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={defaultStyle}
    >
      {/* Tabs List */}
      <div className="h-full w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full w-full relative"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingRight: edgeToEdge ? '0px' : '2.5rem',
          }}
        >
          <div className="flex items-center gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={el => setTabRef(el, index, tab.id)}
                onClick={() => handleTabClick(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={getTabClassName(activeTab === tab.id)}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                <span className="font-medium select-none">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Animated underline - matches reference component exactly */}
          {activeTab && variant === "underline" && underlineWidth > 0 && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
              style={{ 
                width: underlineWidth,
                left: underlineLeft,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}