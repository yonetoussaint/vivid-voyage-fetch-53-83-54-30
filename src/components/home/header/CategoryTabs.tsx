import { LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryTab {
  id: string;
  name: string;
  icon?: ReactNode;
  path?: string;
}

interface CategoryTabsProps {
  progress: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: CategoryTab[];
  showCategoriesButton?: boolean;
  isSearchOverlayActive?: boolean;
}

const CategoryTabs = ({
  progress,
  activeTab,
  setActiveTab,
  categories,
  showCategoriesButton = true,
  isSearchOverlayActive = false,
}: CategoryTabsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetLeft, setTargetLeft] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);
  const [startWidth, setStartWidth] = useState(0);
  const [startLeft, setStartLeft] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const previousActiveTabRef = useRef<string | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Memoize refs update and reset initial mount flag
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
    isInitialMount.current = true;
  }, [categories]);

  // Calculate target position for the underline
  const calculateTargetPosition = useCallback((tabId: string = activeTab) => {
    const activeTabIndex = categories.findIndex(cat => cat.id === tabId);

    if (activeTabIndex === -1) {
      return null;
    }

    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span');
      if (textSpan) {
        void activeTabElement.offsetHeight;
        void textSpan.offsetHeight;

        const textRect = textSpan.getBoundingClientRect();
        const textWidth = textRect.width;
        const newWidth = Math.max(textWidth * 0.6, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        return { width: newWidth, left: underlineStart };
      }
    }
    return null;
  }, [activeTab, categories]);

  // Start smooth animation
  const startAnimation = useCallback((fromTabId: string | null, toTabId: string) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Get current position
    const currentPosition = fromTabId ? calculateTargetPosition(fromTabId) : null;
    const targetPosition = calculateTargetPosition(toTabId);

    if (!targetPosition) return;

    // Set start values
    if (currentPosition) {
      setStartWidth(currentPosition.width);
      setStartLeft(currentPosition.left);
      
      // Determine direction
      setDirection(currentPosition.left < targetPosition.left ? 'right' : 'left');
    } else {
      setStartWidth(underlineWidth);
      setStartLeft(underlineLeft);
    }

    // Set target values
    setTargetWidth(targetPosition.width);
    setTargetLeft(targetPosition.left);

    // Start animation
    setIsAnimating(true);
    setAnimationStartTime(Date.now());
    
    const animate = (currentTime: number) => {
      if (!animationStartTime) return;
      
      const elapsed = currentTime - animationStartTime;
      const duration = 300; // Total animation duration in ms
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      // Animate width
      const widthDiff = targetPosition.width - startWidth;
      const currentWidth = startWidth + (widthDiff * easeOutCubic);
      setUnderlineWidth(currentWidth);
      
      // Animate position
      const leftDiff = targetPosition.left - startLeft;
      const currentLeft = startLeft + (leftDiff * easeOutCubic);
      setUnderlineLeft(currentLeft);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setUnderlineWidth(targetPosition.width);
        setUnderlineLeft(targetPosition.left);
        setIsAnimating(false);
        setAnimationStartTime(null);
        setDirection(null);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [underlineWidth, underlineLeft, startWidth, startLeft, calculateTargetPosition]);

  // Update underline position with animation
  const updateUnderline = useCallback((fromTabId: string | null = null) => {
    startAnimation(fromTabId, activeTab);
  }, [activeTab, startAnimation]);

  // Immediate update without animation (for initial load)
  const updateUnderlineImmediate = useCallback(() => {
    const position = calculateTargetPosition();
    if (position) {
      setUnderlineWidth(position.width);
      setUnderlineLeft(position.left);
      setTargetWidth(position.width);
      setTargetLeft(position.left);
      setStartWidth(position.width);
      setStartLeft(position.left);
    }
  }, [calculateTargetPosition]);

  // Snap active tab to left
  const snapToTab = useCallback(() => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);
    
    if (activeTabIndex === -1 || !scrollContainerRef.current) {
      return;
    }

    const activeTabElement = tabRefs.current[activeTabIndex];
    if (!activeTabElement) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTabElement.getBoundingClientRect();
    
    // Check if tab is already visible
    const isTabVisible = 
      tabRect.left >= containerRect.left && 
      tabRect.right <= containerRect.right;
    
    // If tab is not fully visible, scroll to make it visible on the left
    if (!isTabVisible || tabRect.left < containerRect.left) {
      setIsScrolling(true);
      
      // Calculate scroll position to bring tab to left side
      const scrollLeft = activeTabElement.offsetLeft - 16;
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => setIsScrolling(false), 300);
    }
  }, [activeTab, categories]);

  // Use useLayoutEffect for initial positioning
  useLayoutEffect(() => {
    if (activeTab && categories.length > 0) {
      // Immediate synchronous update for initial load
      updateUnderlineImmediate();
      
      // Snap to tab on active tab change
      requestAnimationFrame(() => {
        snapToTab();
      });
    }
  }, [activeTab, categories, updateUnderlineImmediate, snapToTab]);

  // Handle tab change with animation
  useEffect(() => {
    if (activeTab && previousActiveTabRef.current !== activeTab) {
      // Start animation from previous tab to current tab
      updateUnderline(previousActiveTabRef.current);
      previousActiveTabRef.current = activeTab;
    }
  }, [activeTab, updateUnderline]);

  // Update on resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (activeTab && categories.length > 0) {
        if (!isAnimating) {
          updateUnderlineImmediate();
        }
        if (!isScrolling) {
          snapToTab();
        }
      }
    };

    const handleScroll = () => {
      if (activeTab && categories.length > 0 && !isScrolling && !isAnimating) {
        updateUnderlineImmediate();
      }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, categories, updateUnderlineImmediate, snapToTab, isScrolling, isAnimating]);

  // Tab click handler with snapping and animation
  const handleTabClick = useCallback((id: string, path?: string) => {
    const fromTab = activeTab;
    
    // First update the active tab
    setActiveTab(id);

    // Snap to the clicked tab
    snapToTab();

    // Animate from previous tab to new tab
    if (fromTab !== id) {
      updateUnderline(fromTab);
    }

    if (path && !isSearchOverlayActive && !path.startsWith('#')) {
      navigate(path, { 
        preventScrollReset: true 
      });
    }

    if (isSearchOverlayActive && process.env.NODE_ENV === 'development') {
      console.log(`Search tab selected: ${id}`);
    }
  }, [setActiveTab, navigate, isSearchOverlayActive, categories, updateUnderline, snapToTab, activeTab]);

  const handleCategoriesClick = useCallback(() => {
    navigate('/categories', { preventScrollReset: true });
  }, [navigate]);

  // Tab styles
  const getTabClassName = useCallback((isActive: boolean) => {
    return `relative flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap outline-none flex-shrink-0 transition-colors duration-300 ${
      isActive
        ? 'text-red-600'
        : 'text-gray-700 hover:text-red-600'
    }`;
  }, []);

  // Ref callback that updates underline when refs are set
  const setTabRef = useCallback((el: HTMLButtonElement | null, index: number, id: string) => {
    tabRefs.current[index] = el;

    // If this is the active tab and we have the element, update underline immediately
    if (el && id === activeTab && isInitialMount.current) {
      requestAnimationFrame(() => {
        updateUnderlineImmediate();
        snapToTab();
        isInitialMount.current = false;
      });
    }
  }, [activeTab, updateUnderlineImmediate, snapToTab]);

  // Render the animated underline with direction-aware styling
  const renderUnderline = () => {
    if (!activeTab || underlineWidth === 0) return null;

    const isShrinking = startWidth > targetWidth;
    const isGrowing = startWidth < targetWidth;
    
    // Calculate the center point for smoother width changes
    const currentCenter = underlineLeft + (underlineWidth / 2);
    const targetCenter = targetLeft + (targetWidth / 2);

    return (
      <div
        className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
        style={{ 
          width: underlineWidth,
          left: underlineLeft,
          transform: `translateX(${direction === 'right' ? '-2px' : direction === 'left' ? '2px' : '0px'})`,
          transition: 'none', // We handle animation manually with requestAnimationFrame
          willChange: isAnimating ? 'width, left, transform' : 'auto',
          filter: isAnimating ? `drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))` : 'none',
        }}
      />
    );
  };

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ maxHeight: '40px' }}>
      <div className="h-full w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full w-full relative"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingRight: isSearchOverlayActive ? '0px' : '2.5rem',
            scrollBehavior: isScrolling ? 'smooth' : 'auto'
          }}
        >
          {categories.map(({ id, name, icon, path }, index) => (
            <button
              key={id}
              ref={el => setTabRef(el, index, id)}
              onClick={() => handleTabClick(id, path)}
              aria-pressed={activeTab === id}
              className={getTabClassName(activeTab === id)}
            >
              {icon && <span className="mr-2">{icon}</span>}
              <span className="font-medium select-none">{name}</span>
            </button>
          ))}

          {renderUnderline()}
        </div>
      </div>

      {showCategoriesButton && !isSearchOverlayActive && (
        <div className="absolute top-0 right-0 h-full flex items-center z-20 bg-white">
          <div className="h-6 w-px bg-gray-200 opacity-50" />
          <button
            type="button"
            onClick={handleCategoriesClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors duration-150"
            aria-label={t('allCategories', { ns: 'categories' })}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;