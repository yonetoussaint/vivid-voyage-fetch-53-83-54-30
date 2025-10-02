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
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-40 animate-in slide-in-from-bottom duration-300 flex flex-col"
        style={{
          maxHeight: '90vh',
          height: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        {(title || showCloseButton) && (
          <div className="flex-shrink-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100 rounded-t-2xl"> {/* Added rounded-t-2xl */}
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

        {/* Scrollable Content Area - REMOVED bg-white from here */}
        <div 
          ref={contentRef}
          className={`flex-1 overflow-y-auto ${className}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          {children}
        </div>

        {/* Sticky Footer Area */}
        {stickyFooter && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white rounded-b-2xl"> {/* Added rounded-b-2xl */}
            {stickyFooter}
          </div>
        )}
      </div>
    </>
  );
}