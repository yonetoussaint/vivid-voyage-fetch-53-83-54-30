// components/shared/SlideUpPanel.tsx
import { X, HelpCircle, ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  showHelpButton?: boolean;
  showBackButton?: boolean;
  onHelpClick?: () => void;
  onBack?: () => void;
  preventBodyScroll?: boolean;
  stickyFooter?: React.ReactNode;
  maxHeight?: number;
  dynamicHeight?: boolean;
  showDragHandle?: boolean;
}

export default function SlideUpPanel({
  isOpen,
  onClose,
  title,
  headerContent,
  children,
  className = '',
  showCloseButton = true,
  showHelpButton = false,
  showBackButton = false,
  onHelpClick,
  onBack,
  preventBodyScroll = true,
  stickyFooter,
  maxHeight = 0.9,
  dynamicHeight = false,
  showDragHandle = true
}: SlideUpPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  // Check if header controls are present (icons or title)
  const hasHeaderControls = showCloseButton || showHelpButton || showBackButton || title || headerContent;

  // Improved height calculation with ResizeObserver
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const contentElement = contentRef.current;

      const calculateHeight = () => {
        if (contentElement) {
          // Use getBoundingClientRect for more accurate measurement
          const height = contentElement.scrollHeight;
          setContentHeight(height);
        }
      };

      // Use ResizeObserver for better dynamic content handling
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          calculateHeight();
        }
      });

      if (contentElement) {
        resizeObserver.observe(contentElement);
        // Initial calculation
        calculateHeight();
      }

      // Fallback timeout for initial render
      const timeoutId = setTimeout(calculateHeight, 150);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
      };
    } else {
      setContentHeight(0);
    }
  }, [isOpen, children]);

  // Handle body scroll locking
  useEffect(() => {
    if (preventBodyScroll && isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isOpen, preventBodyScroll]);

  // Drag handlers inspired by React Native BottomSheet
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent drag if user is interacting with interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('select')) {
      return;
    }

    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setCurrentTranslate(0);
  }, []);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;

    // Only allow dragging downward (closing)
    if (deltaY > 0) {
      setCurrentTranslate(deltaY);
    }
  }, [isDragging, startY]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // If dragged more than 40% of panel height or 100px, close it
    const panelHeight = panelRef.current?.offsetHeight || 0;
    const closeThreshold = Math.max(panelHeight * 0.4, 100);

    if (currentTranslate > closeThreshold) {
      onClose();
    } else {
      // Animate back to original position
      setCurrentTranslate(0);
    }
  }, [isDragging, currentTranslate, onClose]);

  // Add/remove global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Scroll prevention logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen || !preventBodyScroll) return;

      const contentElement = contentRef.current;
      if (contentElement && contentElement.contains(e.target as Node)) {
        const isScrollable = contentElement.scrollHeight > contentElement.clientHeight;
        if (!isScrollable) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpen || !preventBodyScroll) return;

      const contentElement = contentRef.current;
      if (contentElement && contentElement.contains(e.target as Node)) {
        const isScrollable = contentElement.scrollHeight > contentElement.clientHeight;
        if (!isScrollable) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
    };

    if (isOpen && preventBodyScroll) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, preventBodyScroll, contentHeight]);

  if (!isOpen) return null;

  // Calculate if we need scrolling - with dynamic height option
  const maxPanelHeight = window.innerHeight * maxHeight;
  const needsScrolling = dynamicHeight ? false : contentHeight > maxPanelHeight;

  // For dynamic height, use auto height, otherwise use calculated height
  const panelHeight = dynamicHeight ? 'auto' : (needsScrolling ? maxPanelHeight : contentHeight);

  // Calculate dynamic styles for drag animation
  const panelStyle = {
    maxHeight: dynamicHeight ? 'none' : `${maxPanelHeight}px`,
    height: panelHeight,
    transform: `translateY(${currentTranslate}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
  };

  // Calculate opacity for backdrop based on drag
  const backdropOpacity = Math.max(0, 0.5 - (currentTranslate / (window.innerHeight * 0.8)));

  return (
    <>
      {/* Dynamic Backdrop */}
      <div 
        className="fixed inset-0 bg-black backdrop-blur-md z-[70] transition-opacity duration-200"
        style={{ 
          opacity: backdropOpacity,
          animation: !isDragging ? 'fadeIn 0.3s ease-out' : 'none'
        }}
        onClick={onClose}
      />

      {/* Panel with integrated header and drag handle */}
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-md shadow-lg z-[70] flex flex-col"
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Combined Header Area with Drag Handle and Controls */}
        <div className="flex-shrink-0 bg-white rounded-t-md">
          {/* Drag Handle - Always at the very top */}
          {showDragHandle && (
            <div 
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
          )}

          {/* Header Controls - Only show if we have buttons or title */}
          {hasHeaderControls && (
            <div 
              className={`flex items-center justify-between px-4 pb-3 ${showDragHandle ? '' : 'pt-3'}`}
              // Add drag capability to header area when no drag handle is present
              {...(!showDragHandle && {
                onMouseDown: handleDragStart,
                onTouchStart: handleDragStart,
                style: { cursor: 'grab' }
              })}
            >
              {/* Left side - Back button OR Close button */}
              <div className="flex-1 flex justify-start">
                {showBackButton && onBack ? (
                  <button
                    onClick={onBack}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                ) : showCloseButton ? (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                ) : (
                  <div className="w-6"></div> // Spacer for alignment when no left button
                )}
              </div>

              {/* Center - Title or header content */}
              <div className="flex-1 flex justify-center min-w-0">
                {headerContent ? (
                  headerContent
                ) : (
                  title && (
                    <h3 className="font-medium text-gray-900 truncate px-2">
                      {title}
                    </h3>
                  )
                )}
              </div>

              {/* Right side - Help button or spacer */}
              <div className="flex-1 flex justify-end">
                {showHelpButton ? (
                  <button
                    onClick={onHelpClick}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                  </button>
                ) : (
                  <div className="w-6"></div> // Spacer for alignment when no right button
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Area - Handle scrolling based on dynamicHeight prop */}
        <div 
          ref={contentRef}
          className={`flex-1 ${dynamicHeight ? 'overflow-visible' : (needsScrolling ? 'overflow-y-auto' : 'overflow-hidden')} ${className}`}
          style={{
            WebkitOverflowScrolling: needsScrolling ? 'touch' : 'auto',
            scrollBehavior: 'smooth',
          }}
          // Add drag capability to content area when no drag handle is present
          {...(!showDragHandle && {
            onMouseDown: handleDragStart,
            onTouchStart: handleDragStart,
            style: { cursor: 'grab' }
          })}
        >
          {children}
        </div>

        {/* Sticky Footer Area */}
        {stickyFooter && (
          <div 
            className="flex-shrink-0 border-t border-gray-200 bg-white rounded-b-md"
            // Add drag capability to footer area when no drag handle is present
            {...(!showDragHandle && {
              onMouseDown: handleDragStart,
              onTouchStart: handleDragStart,
              style: { cursor: 'grab' }
            })}
          >
            {stickyFooter}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}