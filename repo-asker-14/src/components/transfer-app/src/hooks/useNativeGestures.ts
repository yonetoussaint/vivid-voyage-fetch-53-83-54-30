import { useRef, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface UseNativeGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableHaptics?: boolean;
}

export const useNativeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enableHaptics = true,
}: UseNativeGesturesProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const endX = useRef(0);
  const endY = useRef(0);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (enableHaptics && Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    endX.current = e.touches[0].clientX;
    endY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = async () => {
    const deltaX = endX.current - startX.current;
    const deltaY = endY.current - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only process swipe if it's significant enough
    if (Math.max(absDeltaX, absDeltaY) < threshold) return;

    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        await triggerHaptic();
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        await triggerHaptic();
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        await triggerHaptic();
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        await triggerHaptic();
        onSwipeUp();
      }
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return ref;
};