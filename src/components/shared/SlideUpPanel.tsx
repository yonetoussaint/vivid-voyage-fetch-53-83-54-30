// components/shared/SlideUpPanel.tsx
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
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
  children,
  className = '',
  showCloseButton = true,
  preventBodyScroll = true,
  stickyFooter
}: SlideUpPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

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
        return;
      }

      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpen || !preventBodyScroll) return;

      const contentElement = contentRef.current;
      if (contentElement && contentElement.contains(e.target as Node)) {
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
  }, [isOpen, preventBodyScroll]);

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[70] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel - Remove fixed height, use max-height with auto height */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-[70] animate-in slide-in-from-bottom duration-300 flex flex-col"
        style={{
          maxHeight: '90vh', // Still limit to 90vh max
          height: 'auto', // Let content determine height
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        {(title || showCloseButton) && (
          <div className="flex-shrink-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100 rounded-t-2xl">
            {title && <h3 className="font-medium text-gray-900">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content Area - Add min-height: 0 for proper flex behavior */}
        <div 
          ref={contentRef}
          className={`flex-1 overflow-y-auto min-h-0 ${className}`}
          style={{
            WebkitOverflowScrolling: 'touch',
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