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
  const isInitialMount = useRef(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [previousTab, setPreviousTab] = useState<string>('');
  const [previousLeft, setPreviousLeft] = useState(0);
  const [previousWidth, setPreviousWidth] = useState(0);

  // Memoize refs update and reset initial mount flag
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
    isInitialMount.current = true; // Reset flag when categories change
  }, [categories]);

  // Reset initial mount flag when active tab changes
  useEffect(() => {
    isInitialMount.current = true;
  }, [activeTab]);

  // Calculate target position for the underline
  const calculateTargetPosition = useCallback((tabId: string) => {
    const activeTabIndex = categories.findIndex(cat => cat.id === tabId);

    if (activeTabIndex === -1) {
      return { width: 0, left: 0 };
    }

    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span');
      if (textSpan) {
        // Force layout recalculation before measuring
        void activeTabElement.offsetHeight;
        void textSpan.offsetHeight;

        // Use getBoundingClientRect for more accurate measurements
        const textRect = textSpan.getBoundingClientRect();
        const textWidth = textRect.width;

        // Make underline 60-70% of text width for a sleek look
        const newWidth = Math.max(textWidth * 0.6, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        return { width: newWidth, left: underlineStart };
      }
    }
    return { width: 0, left: 0 };
  }, [categories]);

  // Start smooth slide animation
  const startSlideAnimation = useCallback((fromLeft: number, fromWidth: number, toLeft: number, toWidth: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsAnimating(true);
    setUnderlineLeft(fromLeft);
    setUnderlineWidth(fromWidth);
    
    const startTime = performance.now();
    const duration = 300; // ms
    const easing = (t: number) => {
      // Smooth cubic bezier easing: ease-in-out
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      // Interpolate position and width simultaneously
      const currentLeft = fromLeft + (toLeft - fromLeft) * easedProgress;
      const currentWidth = fromWidth + (toWidth - fromWidth) * easedProgress;

      setUnderlineLeft(currentLeft);
      setUnderlineWidth(currentWidth);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setUnderlineLeft(toLeft);
        setUnderlineWidth(toWidth);
        setTargetWidth(toWidth);
        setTargetLeft(toLeft);
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Update underline position with smooth slide animation
  const updateUnderlineWithSlide = useCallback((newTabId: string) => {
    const currentPosition = calculateTargetPosition(activeTab);
    const targetPosition = calculateTargetPosition(newTabId);

    if (currentPosition.width > 0 && targetPosition.width > 0) {
      // Store previous values for animation
      setPreviousTab(activeTab);
      setPreviousLeft(currentPosition.left);
      setPreviousWidth(currentPosition.width);

      // Start sliding animation
      startSlideAnimation(
        currentPosition.left,
        currentPosition.width,
        targetPosition.left,
        targetPosition.width
      );
    }
  }, [activeTab, calculateTargetPosition, startSlideAnimation]);

  // Immediate update without animation (for initial load)
  const updateUnderlineImmediate = useCallback(() => {
    const position = calculateTargetPosition(activeTab);
    setUnderlineWidth(position.width);
    setUnderlineLeft(position.left);
    setTargetWidth(position.width);
    setTargetLeft(position.left);
  }, [activeTab, calculateTargetPosition]);

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
      const scrollLeft = activeTabElement.offsetLeft - 16; // Add small padding
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });

      // Reset scrolling state after animation completes
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

  // Backup async updates for edge cases
  useEffect(() => {
    if (activeTab && categories.length > 0) {
      const timers = [
        setTimeout(() => {
          updateUnderlineImmediate();
          snapToTab();
        }, 50),
        setTimeout(() => {
          updateUnderlineImmediate();
          snapToTab();
        }, 200),
      ];

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [activeTab, categories, updateUnderlineImmediate, snapToTab]);

  // Update on resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (activeTab && categories.length > 0) {
        updateUnderlineImmediate();
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeTab, categories, updateUnderlineImmediate, snapToTab, isScrolling, isAnimating]);

  // Tab click handler with snapping and smooth slide animation
  const handleTabClick = useCallback((id: string, path?: string) => {
    // If clicking the same tab or animation is in progress, do nothing
    if (id === activeTab || isAnimating) {
      return;
    }

    // Store the previous tab before updating
    const oldTab = activeTab;
    
    // First update the active tab
    setActiveTab(id);

    // Start smooth slide animation from old tab to new tab
    updateUnderlineWithSlide(id);

    // Snap to the clicked tab
    snapToTab();

    if (path && !isSearchOverlayActive && !path.startsWith('#')) {
      navigate(path, { 
        preventScrollReset: true 
      });
    }

    if (isSearchOverlayActive && process.env.NODE_ENV === 'development') {
      console.log(`Search tab selected: ${id}`);
    }
  }, [activeTab, setActiveTab, navigate, isSearchOverlayActive, categories, updateUnderlineWithSlide, snapToTab, isAnimating]);

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
      // Use requestAnimationFrame to ensure DOM is ready but still appear instant
      requestAnimationFrame(() => {
        updateUnderlineImmediate();
        snapToTab();
        isInitialMount.current = false;
      });
    }
  }, [activeTab, updateUnderlineImmediate, snapToTab]);

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

          {/* Animated underline with realistic sliding motion */}
          {activeTab && underlineWidth > 0 && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
              style={{ 
                width: underlineWidth,
                left: underlineLeft,
                transition: isAnimating ? 'none' : 'left 0.2s ease, width 0.2s ease',
                willChange: isAnimating ? 'left, width' : 'auto',
                transform: 'translateZ(0)', // Hardware acceleration
              }}
            />
          )}

          {/* Optional: Visual indicator of the animation path */}
          {isAnimating && previousTab && previousTab !== activeTab && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-30"
              style={{
                width: Math.abs(underlineLeft - previousLeft) + Math.max(underlineWidth, previousWidth),
                left: Math.min(underlineLeft, previousLeft) - Math.max(underlineWidth, previousWidth) / 2,
                transition: 'none',
              }}
            />
          )}
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