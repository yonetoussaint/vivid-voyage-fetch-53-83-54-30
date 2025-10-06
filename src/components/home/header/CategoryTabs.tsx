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
  const isInitialMount = useRef(true);

  // Memoize refs update and reset initial mount flag
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
    isInitialMount.current = true; // Reset flag when categories change
  }, [categories]);

  // Reset initial mount flag when active tab changes
  useEffect(() => {
    isInitialMount.current = true;
  }, [activeTab]);

  // Instant underline calculation
  const updateUnderline = useCallback(() => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);

    if (activeTabIndex === -1) {
      return;
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

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  }, [activeTab, categories]);

  // Use useLayoutEffect for initial positioning - runs synchronously after DOM mutations
  useLayoutEffect(() => {
    if (activeTab && categories.length > 0) {
      // Immediate synchronous update
      updateUnderline();
    }
  }, [activeTab, categories, updateUnderline]);

  // Backup async updates for edge cases
  useEffect(() => {
    if (activeTab && categories.length > 0) {
      const timers = [
        setTimeout(() => updateUnderline(), 50),
        setTimeout(() => updateUnderline(), 200),
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [activeTab, categories, updateUnderline]);

  // Update on resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (activeTab && categories.length > 0) {
        updateUnderline();
      }
    };

    const handleScroll = () => {
      if (activeTab && categories.length > 0) {
        updateUnderline();
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
    };
  }, [activeTab, categories, updateUnderline]);

  // Tab click handler - UPDATED: with retry logic for first tab
  const handleTabClick = useCallback((id: string, path?: string) => {
    // First update the active tab
    setActiveTab(id);

    // Immediately calculate and update underline position
    const activeTabIndex = categories.findIndex(cat => cat.id === id);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const textSpan = activeTabElement.querySelector('span');
      if (textSpan) {
        // Use scrollWidth for actual text content width (more accurate)
        const textWidth = textSpan.scrollWidth;
        // Make underline 60-70% of text width for a sleek look
        const newWidth = Math.max(textWidth * 0.6, 20);

        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (buttonRect.width / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    } else {
      // If refs aren't available yet, retry after a short delay
      setTimeout(() => {
        updateUnderline();
      }, 10);
    }

    if (path && !isSearchOverlayActive && !path.startsWith('#')) {
      navigate(path, { 
        preventScrollReset: true 
      });
    }

    if (isSearchOverlayActive && process.env.NODE_ENV === 'development') {
      console.log(`Search tab selected: ${id}`);
    }
  }, [setActiveTab, navigate, isSearchOverlayActive, categories, updateUnderline]);

  const handleCategoriesClick = useCallback(() => {
    navigate('/search', { preventScrollReset: true });
  }, [navigate]);

  // Tab styles
  const getTabClassName = useCallback((isActive: boolean) => {
    return `relative flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap outline-none flex-shrink-0 ${
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
        updateUnderline();
        isInitialMount.current = false;
      });
    }
  }, [activeTab, updateUnderline]);

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

          {/* Static underline - no animation */}
          {activeTab && underlineWidth > 0 && (
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