
import React from 'react';
import { QuantumBackgroundProps } from './types';
import { SPLASH_ANIMATIONS } from './animations';

const QuantumBackground: React.FC<QuantumBackgroundProps> = ({ isExiting }) => {
  const particles = React.useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      animationDuration: 3 + Math.random() * 2,
      animationDelay: Math.random() * 2
    })), []
  );

  return (
    <>
      <style>{SPLASH_ANIMATIONS.keyframes}</style>
      <div 
        className="absolute inset-0"
        style={{
          animation: isExiting 
            ? SPLASH_ANIMATIONS.configs.backgroundExit
            : 'background-physics-pulse 4s ease-in-out infinite',
          willChange: isExiting ? 'transform, filter, opacity' : 'auto'
        }}
      >
        {/* Enhanced gradient layers with GPU acceleration */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-red-400/20 via-red-500/10 to-transparent"
          style={{ willChange: 'auto' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-conic from-red-500/5 via-transparent to-red-600/5"
          style={{ willChange: 'auto' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-300/15 via-transparent to-red-700/15"
          style={{ willChange: 'auto' }}
        />
        
        {/* Optimized quantum particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                opacity: particle.opacity,
                animation: isExiting 
                  ? `particle-ultra-fast-exit ${0.6 + Math.random() * 0.3}s cubic-bezier(0.77, 0, 0.175, 1) ${Math.random() * 0.2}s forwards`
                  : `particle-float ${particle.animationDuration}s ease-in-out ${particle.animationDelay}s infinite`,
                willChange: isExiting ? 'transform, opacity, filter' : 'transform'
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default QuantumBackground;
