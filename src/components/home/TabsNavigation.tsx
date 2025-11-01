import { useState, useRef, useEffect } from "react";

export default function TabsNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "", 
  style = {}, 
  edgeToEdge = false, 
  isLoading = false,
  variant = "underline" // New prop: "underline" | "pills"
}) {
  const tabRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Initialize underline width on mount
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
  }, [tabs]);

  // Function to update underline position and width
  const updateUnderline = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span:last-child');

      if (textSpan) {
        const textWidth = textSpan.offsetWidth;
        const newWidth = Math.max(textWidth * 0.8, 20);
        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (activeTabElement.offsetWidth / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  };

  // Update underline when active tab changes
  useEffect(() => {
    if (activeTab && variant === "underline") {
      setTimeout(updateUnderline, 0);
    }
  }, [activeTab, tabs, variant]);

  // Handle tab scrolling - only auto-scroll when shouldAutoScroll is true
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const paddingLeft = edgeToEdge ? 16 : 8;
      const newScrollLeft = activeTabElement.offsetLeft - paddingLeft;

      containerElement.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }

    const timer = setTimeout(() => setShouldAutoScroll(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab, tabs, edgeToEdge, shouldAutoScroll]);

  // Set initial underline when component mounts
  useEffect(() => {
    if (activeTab && tabs.length > 0 && variant === "underline") {
      setTimeout(updateUnderline, 100);
    }
  }, []);

  const handleTabClick = (id) => {
    setShouldAutoScroll(true);
    onTabChange(id);
  };

  // Default style
  const defaultStyle = {
    maxHeight: variant === "pills" ? '48px' : '40px',
    opacity: 1,
    backgroundColor: 'white',
  };

  // Merge styles - passed style overrides default
  const finalStyle = { ...defaultStyle, ...style };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div
        className={`relative w-full transition-all duration-700 overflow-hidden ${className}`}
        style={finalStyle}
      >
        <div className="h-full w-full">
          <div
            className="flex items-center overflow-x-auto no-scrollbar h-full w-full relative px-2 py-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className={`flex items-center ${variant === "pills" ? "space-x-2" : "space-x-7"}`}>
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
      className={`relative w-full transition-all duration-700 overflow-hidden ${className}`}
      style={finalStyle}
    >
      {/* Tabs List */}
      <div className="h-full w-full">
        <div
          ref={scrollContainerRef}
          className={`flex items-center overflow-x-auto no-scrollbar h-full w-full relative ${
            edgeToEdge ? 'px-2' : 'px-2'
          } ${variant === "pills" ? 'py-1' : ''}`}
          onScroll={() => setShouldAutoScroll(false)}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className={`flex items-center ${variant === "pills" ? "space-x-2" : "space-x-7"}`}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={el => (tabRefs.current[index] = el)}
                onClick={() => handleTabClick(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`
                  relative flex items-center py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none flex-shrink-0
                  ${
                    variant === "pills" 
                      ? `
                          px-3 rounded-full border
                          ${activeTab === tab.id
                            ? 'bg-pink-100 border-pink-200 text-pink-700 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `
                      : `
                          ${activeTab === tab.id
                            ? 'text-red-600'
                            : 'text-gray-700 hover:text-red-600'
                          }
                        `
                  }
                `}
              >
                {tab.icon && <span className="mr-1">{tab.icon}</span>}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Animated underline - only for underline variant */}
          {activeTab && variant === "underline" && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: underlineWidth,
                left: underlineLeft,
                transform: 'translateZ(0)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}