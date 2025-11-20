// components/shared/SlideUpPanel.tsx
import { X } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

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
  maxHeight?: number;
  dynamicHeight?: boolean;
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
  stickyFooter,
  maxHeight = 0.9,
  dynamicHeight = false
}: SlideUpPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Physics constants for ultra-smooth feel
  const SPRING_DAMPING = 0.7;
  const SPRING_STIFFNESS = 0.3;
  const VELOCITY_THRESHOLD = 0.5;
  const CLOSE_THRESHOLD = 0.3;
  const FRICTION = 0.95;

  // Improved height calculation
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const contentElement = contentRef.current;

      const calculateHeight = () => {
        if (contentElement) {
          const height = contentElement.scrollHeight;
          setContentHeight(height);
        }
      };

      const resizeObserver = new ResizeObserver(() => {
        calculateHeight();
      });

      if (contentElement) {
        resizeObserver.observe(contentElement);
        calculateHeight();
      }

      const timeoutId = setTimeout(calculateHeight, 100);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
      };
    } else {
      setContentHeight(0);
    }
  }, [isOpen, children]);

  // Body scroll locking
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

  // Physics-based spring animation
  const animateSpring = useCallback((targetY: number, initialVelocity: number = 0) => {
    let currentY = currentTranslate;
    let currentVelocity = initialVelocity;
    
    const animate = () => {
      const displacement = targetY - currentY;
      const springForce = displacement * SPRING_STIFFNESS;
      const dampingForce = currentVelocity * SPRING_DAMPING;
      
      currentVelocity += springForce - dampingForce;
      currentVelocity *= FRICTION;
      currentY += currentVelocity;

      setCurrentTranslate(currentY);

      // Continue animation if still moving significantly
      if (Math.abs(currentVelocity) > 0.1 || Math.abs(displacement) > 0.5) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentTranslate(targetY);
        if (targetY > 0 && targetY >= (panelRef.current?.offsetHeight || 0) * CLOSE_THRESHOLD) {
          onClose();
        }
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [currentTranslate, onClose]);

  // Enhanced drag handlers with velocity tracking
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    lastYRef.current = clientY;
    lastTimeRef.current = Date.now();
    setVelocity(0);
  }, []);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTimeRef.current;

    // Calculate velocity
    if (timeDelta > 0) {
      const newVelocity = (clientY - lastYRef.current) / timeDelta * 16; // Normalize to 60fps
      setVelocity(newVelocity);
    }

    lastYRef.current = clientY;
    lastTimeRef.current = currentTime;

    // Only allow dragging downward with rubber band effect at top
    if (deltaY > 0) {
      setCurrentTranslate(deltaY);
    } else {
      // Rubber band effect when dragging up
      setCurrentTranslate(deltaY * 0.3);
    }
  }, [isDragging, startY]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    const panelHeight = panelRef.current?.offsetHeight || 0;
    const shouldClose = 
      currentTranslate > panelHeight * CLOSE_THRESHOLD || 
      velocity > VELOCITY_THRESHOLD;

    if (shouldClose) {
      // Animate out with velocity
      animateSpring(panelHeight, velocity);
    } else {
      // Snap back with spring physics
      animateSpring(0, velocity);
    }
  }, [isDragging, currentTranslate, velocity, animateSpring]);

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      const moveHandler = (e: MouseEvent | TouchEvent) => handleDragMove(e);
      const endHandler = () => handleDragEnd();

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('touchmove', moveHandler, { passive: true });
      document.addEventListener('mouseup', endHandler);
      document.addEventListener('touchend', endHandler);

      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('mouseup', endHandler);
        document.removeEventListener('touchend', endHandler);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Scroll management
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
  }, [isOpen, preventBodyScroll]);

  if (!isOpen) return null;

  const maxPanelHeight = window.innerHeight * maxHeight;
  const needsScrolling = dynamicHeight ? false : contentHeight > maxPanelHeight;
  const panelHeight = dynamicHeight ? 'auto' : (needsScrolling ? maxPanelHeight : contentHeight);

  // Enhanced backdrop opacity with easing
  const maxTranslate = window.innerHeight * 0.8;
  const normalizedTranslate = Math.min(Math.max(currentTranslate, 0), maxTranslate);
  const backdropOpacity = 0.5 * (1 - (normalizedTranslate / maxTranslate));

  // Panel transform with subtle scale effect
  const scale = 1 - (normalizedTranslate / maxTranslate) * 0.05;
  const borderRadius = 16 + (normalizedTranslate / maxTranslate) * 8;

  return (
    <>
      {/* Ultra-smooth backdrop */}
      <div 
        className="fixed inset-0 bg-black z-[70]"
        style={{ 
          opacity: backdropOpacity,
          transition: isDragging ? 'none' : 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: `blur(${8 * (backdropOpacity / 0.5)}px)`,
          WebkitBackdropFilter: `blur(${8 * (backdropOpacity / 0.5)}px)`,
        }}
        onClick={onClose}
      />

      {/* Ultra-smooth panel */}
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-[70] flex flex-col"
        style={{
          maxHeight: dynamicHeight ? 'none' : `${maxPanelHeight}px`,
          height: panelHeight,
          transform: `translateY(${currentTranslate}px) scale(${scale})`,
          transformOrigin: 'bottom center',
          borderTopLeftRadius: `${borderRadius}px`,
          borderTopRightRadius: `${borderRadius}px`,
          transition: isDragging 
            ? 'none' 
            : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced drag handle */}
        <div 
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div 
              className="w-12 h-1.5 bg-gray-300 rounded-full transition-all duration-200"
              style={{
                transform: isDragging ? 'scaleX(1.2)' : 'scaleX(1)',
                opacity: isDragging ? 0.6 : 0.4,
              }}
            />
          </div>
        </div>

        {/* Header with enhanced animations */}
        {(title || headerContent || showCloseButton) && (
          <div 
            className="flex-shrink-0 bg-white z-10 flex items-center justify-between px-4 py-2 border-b border-gray-100"
            style={{
              opacity: 1 - (normalizedTranslate / maxTranslate) * 0.5,
              transition: isDragging ? 'none' : 'opacity 0.3s ease-out',
            }}
          >
            <div className="flex-1 min-w-0">
              {headerContent ? headerContent : (title && <h3 className="font-medium text-gray-900">{title}</h3>)}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200 ml-2 flex-shrink-0 hover:scale-110 active:scale-95"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Content with smooth scrolling */}
        <div 
          ref={contentRef}
          className={`flex-1 ${dynamicHeight ? 'overflow-visible' : (needsScrolling ? 'overflow-y-auto' : 'overflow-hidden')} ${className}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {stickyFooter && (
          <div 
            className="flex-shrink-0 border-t border-gray-200 bg-white"
            style={{
              borderBottomLeftRadius: `${borderRadius}px`,
              borderBottomRightRadius: `${borderRadius}px`,
            }}
          >
            {stickyFooter}
          </div>
        )}
      </div>
    </>
  );
}