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

// Helper function for smooth easing
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
  
  // Animation state
  const [underlineState, setUnderlineState] = useState({
    width: 0,
    left: 0,
    targetWidth: 0,
    targetLeft: 0,
    isAnimating: false,
    startTime: 0,
    startWidth: 0,
    startLeft: 0
  });
  
  const isInitialMount = useRef(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTabClickTime = useRef<number>(0);

  // Memoize refs update and reset initial mount flag
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
    isInitialMount.current = true;
  }, [categories]);

  // Calculate target position for the underline
  const calculateTargetPosition = useCallback(() => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);

    if (activeTabIndex === -1) {
      return null;
    }

    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span');
      if (textSpan) {
        // Use getBoundingClientRect for pixel-perfect measurements
        const textRect = textSpan.getBoundingClientRect();
        const textWidth = textRect.width;

        // Underline width based on text (60-70% for elegant look)
        const targetWidth = Math.max(textWidth * 0.65, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const targetLeft = buttonCenter - (targetWidth / 2);

        return { targetWidth, targetLeft };
      }
    }
    return null;
  }, [activeTab, categories]);

  // Ultra-smooth animation using requestAnimationFrame
  const animateUnderline = useCallback(() => {
    const now = Date.now();
    const elapsed = now - underlineState.startTime;
    const duration = 350; // Slightly longer for ultra-smooth feel
    const progress = Math.min(elapsed / duration, 1);

    // Use easing function for smooth animation
    const easedProgress = easeInOutCubic(progress);

    if (progress < 1) {
      // Calculate current position with easing
      const currentWidth = underlineState.startWidth + 
        (underlineState.targetWidth - underlineState.startWidth) * easedProgress;
      const currentLeft = underlineState.startLeft + 
        (underlineState.targetLeft - underlineState.startLeft) * easedProgress;

      setUnderlineState(prev => ({
        ...prev,
        width: currentWidth,
        left: currentLeft
      }));

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animateUnderline);
    } else {
      // Animation complete
      setUnderlineState(prev => ({
        ...prev,
        width: prev.targetWidth,
        left: prev.targetLeft,
        isAnimating: false
      }));
    }
  }, [underlineState]);

  // Start smooth animation to target
  const startSmoothAnimation = useCallback((targetWidth: number, targetLeft: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Debounce rapid clicks (minimum 100ms between animations)
    const now = Date.now();
    if (now - lastTabClickTime.current < 100) {
      return;
    }
    lastTabClickTime.current = now;

    setUnderlineState(prev => ({
      ...prev,
      targetWidth,
      targetLeft,
      startWidth: prev.width,
      startLeft: prev.left,
      startTime: Date.now(),
      isAnimating: true
    }));

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateUnderline);
  }, [animateUnderline]);

  // Update underline position with ultra-smooth animation
  const updateUnderlineSmoothly = useCallback(() => {
    const target = calculateTargetPosition();
    if (target) {
      startSmoothAnimation(target.targetWidth, target.targetLeft);
    }
  }, [calculateTargetPosition, startSmoothAnimation]);

  // Immediate update without animation (for initial load)
  const updateUnderlineImmediate = useCallback(() => {
    const target = calculateTargetPosition();
    if (target) {
      setUnderlineState(prev => ({
        ...prev,
        width: target.targetWidth,
        left: target.targetLeft,
        targetWidth: target.targetWidth,
        targetLeft: target.targetLeft,
        isAnimating: false
      }));
    }
  }, [calculateTargetPosition]);

  // Snap active tab to left with smooth scrolling
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
    
    // Check if tab is already visible and properly positioned
    const isTabPerfectlyVisible = 
      Math.abs(tabRect.left - containerRect.left) <= 16 && // Within 16px of left edge
      tabRect.right <= containerRect.right;
    
    if (!isTabPerfectlyVisible) {
      setIsScrolling(true);
      
      // Calculate precise scroll position
      const scrollLeft = activeTabElement.offsetLeft - 16;
      
      // Use smooth scroll with optimized timing
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });

      // Reset scrolling state with delay
      setTimeout(() => setIsScrolling(false), 350);
    }
  }, [activeTab, categories]);

  // Initial setup and snap
  useLayoutEffect(() => {
    if (activeTab && categories.length > 0) {
      if (isInitialMount.current) {
        // Immediate positioning for initial load
        updateUnderlineImmediate();
        isInitialMount.current = false;
      } else {
        // Smooth animation for subsequent changes
        updateUnderlineSmoothly();
      }
      
      // Snap to tab with slight delay to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(() => snapToTab(), 50);
      });
    }
  }, [activeTab, categories, updateUnderlineImmediate, updateUnderlineSmoothly, snapToTab]);

  // Handle resize and scroll events
  useEffect(() => {
    const handleResize = () => {
      if (activeTab && categories.length > 0) {
        updateUnderlineSmoothly();
        if (!isScrolling) {
          setTimeout(() => snapToTab(), 100);
        }
      }
    };

    const handleScroll = () => {
      if (activeTab && categories.length > 0 && !isScrolling) {
        updateUnderlineSmoothly();
      }
    };

    // Use optimized event listeners
    let resizeTimer: NodeJS.Timeout;
    const handleResizeOptimized = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    let scrollTimer: NodeJS.Timeout;
    const handleScrollOptimized = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 50);
    };

    window.addEventListener('resize', handleResizeOptimized);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollOptimized);
    }

    return () => {
      window.removeEventListener('resize', handleResizeOptimized);
      if (container) {
        container.removeEventListener('scroll', handleScrollOptimized);
      }
      clearTimeout(resizeTimer);
      clearTimeout(scrollTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, categories, updateUnderlineSmoothly, snapToTab, isScrolling]);

  // Tab click handler with ultra-smooth experience
  const handleTabClick = useCallback((id: string, path?: string) => {
    // Update active tab
    setActiveTab(id);

    // Snap to tab immediately
    snapToTab();

    // Start smooth underline animation
    updateUnderlineSmoothly();

    // Navigation
    if (path && !isSearchOverlayActive && !path.startsWith('#')) {
      navigate(path, { 
        preventScrollReset: true 
      });
    }

    if (isSearchOverlayActive && process.env.NODE_ENV === 'development') {
      console.log(`Search tab selected: ${id}`);
    }
  }, [setActiveTab, navigate, isSearchOverlayActive, categories, updateUnderlineSmoothly, snapToTab]);

  const handleCategoriesClick = useCallback(() => {
    navigate('/categories', { preventScrollReset: true });
  }, [navigate]);

  // Tab styles with smooth color transition
  const getTabClassName = useCallback((isActive: boolean) => {
    return `relative flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap outline-none flex-shrink-0 transition-all duration-300 ${
      isActive
        ? 'text-red-600 scale-[1.02]'
        : 'text-gray-700 hover:text-red-600 hover:scale-[1.02]'
    }`;
  }, []);

  // Ref callback
  const setTabRef = useCallback((el: HTMLButtonElement | null, index: number, id: string) => {
    tabRefs.current[index] = el;

    if (el && id === activeTab && !underlineState.isAnimating) {
      requestAnimationFrame(() => {
        if (isInitialMount.current) {
          updateUnderlineImmediate();
        }
      });
    }
  }, [activeTab, underlineState.isAnimating, updateUnderlineImmediate]);

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
              {icon && <span className="mr-2 transition-transform duration-300">{icon}</span>}
              <span className="font-medium select-none transition-all duration-300">{name}</span>
            </button>
          ))}

          {/* Ultra-smooth animated underline */}
          {activeTab && underlineState.width > 0 && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
              style={{ 
                width: `${underlineState.width}px`,
                left: `${underlineState.left}px`,
                transition: underlineState.isAnimating ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform, width, left',
                transform: 'translateZ(0)', // GPU acceleration
              }}
            />
          )}
        </div>
      </div>

      {showCategoriesButton && !isSearchOverlayActive && (
        <div className="absolute top-0 right-0 h-full flex items-center z-20 bg-white">
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-70" />
          <button
            type="button"
            onClick={handleCategoriesClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-300 hover:scale-110"
            aria-label={t('allCategories', { ns: 'categories' })}
          >
            <LayoutGrid className="h-5 w-5 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;