// components/shared/SlideUpPanel.tsx
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  preventBodyScroll?: boolean;
  stickyFooter?: React.ReactNode;
}

export default function SlideUpPanel({
  isOpen,
  onClose,
  title,
  headerContent,
  children,
  className = '',
  showCloseButton = true,
  preventBodyScroll = true,
  stickyFooter
}: SlideUpPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Calculate content height when panel opens or children change
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const calculateHeight = () => {
        const contentElement = contentRef.current;
        if (contentElement) {
          // Get the actual height of the content
          const height = contentElement.scrollHeight;
          setContentHeight(height);
        }
      };

      // Calculate immediately
      calculateHeight();

      // Also calculate after a brief delay to ensure everything is rendered
      const timeoutId = setTimeout(calculateHeight, 100);
      return () => clearTimeout(timeoutId);
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

  // Scroll prevention logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen || !preventBodyScroll) return;

      const contentElement = contentRef.current;
      if (contentElement && contentElement.contains(e.target as Node)) {
        // Allow scrolling only if content exceeds available space
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
        // Allow scrolling only if content exceeds available space
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

  // Calculate if we need scrolling
  const needsScrolling = contentHeight > window.innerHeight * 0.8; // If content exceeds 80% of viewport height

  return (
    <>
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[70] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel - Dynamic height based on content */}
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-[70] animate-in slide-in-from-bottom duration-300 flex flex-col"
        style={{
          maxHeight: needsScrolling ? '90vh' : 'auto',
          height: needsScrolling ? '90vh' : 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        {(title || headerContent || showCloseButton) && (
          <div className="flex-shrink-0 bg-white z-10 flex items-center justify-between px-4 py-2 border-b border-gray-100 rounded-t-2xl">
            <div className="flex-1 min-w-0">
              {headerContent ? headerContent : (title && <h3 className="font-medium text-gray-900">{title}</h3>)}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Content Area - Only scrollable when needed */}
        <div 
          ref={contentRef}
          className={`flex-1 ${needsScrolling ? 'overflow-y-auto min-h-0' : 'overflow-hidden'} ${className}`}
          style={{
            WebkitOverflowScrolling: needsScrolling ? 'touch' : 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {children}
        </div>

        {/* Sticky Footer Area */}
        {stickyFooter && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white rounded-b-2xl">
            {stickyFooter}
          </div>
        )}
      </div>
    </>
  );
}