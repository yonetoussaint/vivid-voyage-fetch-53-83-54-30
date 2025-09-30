
export const SPLASH_ANIMATIONS = {
  // Performance-optimized keyframes with GPU acceleration
  keyframes: `
    @keyframes title-physics-entry {
      0% {
        opacity: 0;
        transform: translate3d(0, -40px, 0) scale3d(0.7, 0.7, 1);
        filter: blur(5px);
        will-change: transform, opacity, filter;
      }
      30% {
        opacity: 0.4;
        transform: translate3d(0, -25px, 0) scale3d(0.85, 0.85, 1);
        filter: blur(3px);
      }
      60% {
        opacity: 0.8;
        transform: translate3d(0, -10px, 0) scale3d(0.95, 0.95, 1);
        filter: blur(1px);
      }
      80% {
        opacity: 0.95;
        transform: translate3d(0, -2px, 0) scale3d(0.98, 0.98, 1);
        filter: blur(0.3px);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
        filter: blur(0px);
        will-change: auto;
      }
    }

    @keyframes title-ultra-fast-exit {
      0% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
        filter: blur(0px) brightness(1);
        will-change: transform, opacity, filter;
      }
      50% {
        opacity: 0.3;
        transform: translate3d(0, -15px, 0) scale3d(0.8, 0.8, 1);
        filter: blur(2px) brightness(1.5);
      }
      100% {
        opacity: 0;
        transform: translate3d(0, -30px, 0) scale3d(0.5, 0.5, 1);
        filter: blur(5px) brightness(2);
        will-change: auto;
      }
    }

    @keyframes draw-path-physics {
      0% {
        stroke-dashoffset: 4000;
        stroke-width: 1;
        transform: translate3d(0, -20px, 0);
        filter: drop-shadow(0 10px 20px rgba(255, 255, 255, 0.1));
        will-change: stroke-dashoffset, transform, filter;
      }
      15% {
        stroke-width: 6;
        transform: translate3d(0, -15px, 0);
        filter: drop-shadow(0 15px 30px rgba(255, 255, 255, 0.3));
      }
      30% {
        stroke-dashoffset: 3000;
        stroke-width: 8;
        transform: translate3d(0, -10px, 0);
        filter: drop-shadow(0 20px 40px rgba(255, 255, 255, 0.5));
      }
      50% {
        stroke-dashoffset: 1500;
        stroke-width: 6;
        transform: translate3d(0, -5px, 0);
        filter: drop-shadow(0 25px 50px rgba(255, 255, 255, 0.7));
      }
      75% {
        stroke-dashoffset: 500;
        stroke-width: 4;
        transform: translate3d(0, 0, 0);
        filter: drop-shadow(0 30px 60px rgba(255, 255, 255, 0.8));
      }
      90% {
        stroke-dashoffset: 100;
        stroke-width: 3;
        transform: translate3d(0, 2px, 0);
        filter: drop-shadow(0 35px 70px rgba(255, 255, 255, 0.9));
      }
      100% {
        stroke-dashoffset: 0;
        stroke-width: 2;
        transform: translate3d(0, 0, 0);
        filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
        will-change: auto;
      }
    }

    @keyframes main-logo-ultra-fast-exit {
      0% {
        fill: #ffffff;
        stroke: #ffffff;
        stroke-width: 0;
        stroke-dashoffset: 0;
        transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
        filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0)) blur(0px);
        opacity: 1;
        will-change: transform, filter, opacity;
      }
      30% {
        fill: rgba(255, 255, 255, 0.7);
        stroke: #ffffff;
        stroke-width: 2;
        stroke-dashoffset: 1200;
        transform: scale3d(1.15, 1.15, 1) translate3d(0, -25px, 0);
        filter: brightness(2) drop-shadow(0 0 50px rgba(255, 255, 255, 0.9)) blur(3px);
        opacity: 0.8;
      }
      60% {
        fill: rgba(255, 255, 255, 0.3);
        stroke: #ffffff;
        stroke-width: 4;
        stroke-dashoffset: 2800;
        transform: scale3d(1.4, 1.4, 1) translate3d(0, -60px, 0);
        filter: brightness(3.5) drop-shadow(0 0 100px rgba(255, 255, 255, 1)) blur(8px);
        opacity: 0.4;
      }
      100% {
        fill: transparent;
        stroke: #ffffff;
        stroke-width: 8;
        stroke-dashoffset: 4000;
        transform: scale3d(2, 2, 1) translate3d(0, -120px, 0);
        filter: brightness(5) drop-shadow(0 0 150px rgba(255, 255, 255, 1)) blur(20px);
        opacity: 0;
        will-change: auto;
      }
    }

    @keyframes progressive-white-overlay-ultra-fast {
      0% { 
        opacity: 0;
        will-change: opacity;
      }
      100% { 
        opacity: 1;
        will-change: auto;
      }
    }

    @keyframes background-ultra-fast-exit {
      0% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
        filter: blur(0px) brightness(1) hue-rotate(0deg) contrast(1);
        will-change: transform, filter, opacity;
      }
      50% {
        opacity: 0.4;
        transform: scale3d(1.02, 1.02, 1);
        filter: blur(3px) brightness(2) hue-rotate(30deg) contrast(1.5);
      }
      100% {
        opacity: 0;
        transform: scale3d(0.9, 0.9, 1);
        filter: blur(10px) brightness(3.5) hue-rotate(60deg) contrast(2);
        will-change: auto;
      }
    }

    @keyframes sophisticated-ultra-fast-red-to-white-transform {
      0% {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
        will-change: background;
      }
      40% {
        background: linear-gradient(135deg, #fca5a5 0%, #f87171 50%, #ef4444 100%);
      }
      70% {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%);
      }
      100% {
        background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #ffffff 100%);
        will-change: auto;
      }
    }
  `,

  // Animation configurations
  configs: {
    titleEntry: 'title-physics-entry 1.5s ease-out 0.5s forwards',
    titleExit: 'title-ultra-fast-exit 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) forwards',
    logoEntry: 'draw-path-physics 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    logoExit: 'main-logo-ultra-fast-exit 1s cubic-bezier(0.77, 0, 0.175, 1) forwards',
    backgroundExit: 'background-ultra-fast-exit 1s cubic-bezier(0.77, 0, 0.175, 1) forwards',
    containerExit: 'sophisticated-ultra-fast-red-to-white-transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards'
  }
};
