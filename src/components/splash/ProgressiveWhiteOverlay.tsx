
import React from 'react';
import { ProgressiveWhiteOverlayProps } from './types';
import { SPLASH_ANIMATIONS } from './animations';

const ProgressiveWhiteOverlay: React.FC<ProgressiveWhiteOverlayProps> = ({ isExiting }) => {
  const circles = React.useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 100 + i * 150,
      opacity: 0.15 + (i * 0.05),
      duration: 0.6 + i * 0.1,
      delay: 0.2 + i * 0.03
    })), []
  );

  const waves = React.useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      opacity: 0.1 + i * 0.15,
      duration: 0.5 + i * 0.1,
      delay: 0.3 + i * 0.05
    })), []
  );

  if (!isExiting) return null;

  return (
    <>
      <style>{SPLASH_ANIMATIONS.keyframes}</style>
      <div 
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{
          animation: SPLASH_ANIMATIONS.configs.containerExit,
          willChange: 'opacity'
        }}
        aria-hidden="true"
      >
        {/* Ultra fast expanding white circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {circles.map((circle) => (
            <div
              key={circle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                transform: 'scale3d(0, 0, 1)',
                opacity: circle.opacity,
                animation: `ultra-fast-white-circle-expand-${circle.id + 1} ${circle.duration}s cubic-bezier(0.23, 1, 0.32, 1) ${circle.delay}s forwards`,
                willChange: 'transform, opacity, filter'
              }}
            />
          ))}
        </div>
        
        {/* Ultra fast gradient waves */}
        <div className="absolute inset-0">
          {waves.map((wave) => (
            <div
              key={`wave-${wave.id}`}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${wave.opacity}) 0%, transparent 70%)`,
                opacity: 0,
                animation: `ultra-fast-wave-expand-${wave.id + 1} ${wave.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${wave.delay}s forwards`,
                willChange: 'opacity, transform'
              }}
            />
          ))}
        </div>
        
        {/* Ultra fast final white overlay */}
        <div 
          className="absolute inset-0 bg-white"
          style={{
            opacity: 0,
            animation: 'final-ultra-fast-white-complete 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.6s forwards',
            willChange: 'opacity, transform, filter'
          }}
        />
      </div>
    </>
  );
};

export default ProgressiveWhiteOverlay;
