import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ theme, t, typedText, scrollToSection }) => {
  // Add local state to manage typing display
  const [displayText, setDisplayText] = useState('');

  // Sync typedText with a small delay to prevent layout shift
  useEffect(() => {
    if (typedText) {
      setDisplayText(typedText);
    }
  }, [typedText]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 relative">
      <div className="w-full max-w-5xl px-2 py-2">
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-[#00ff88] mb-6 md:mb-8"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
              alt="Yoné Toussaint" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-tight mb-4 tracking-tight"
          >
            Yoné<br />
            <span className="text-[#00ff88]">Toussaint</span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[clamp(1.1rem,3vw,1.3rem)] text-gray-400 mb-8 max-w-xl px-2 py-1 leading-relaxed min-h-[5rem]"
          >
            <div className={`inline-block ${displayText ? 'typing-animation' : ''}`}>
              {displayText || t.hero.description}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 px-2 py-2"
          >
            <button
              onClick={() => scrollToSection('work')}
              className={`px-8 py-3.5 ${
                theme === 'dark' 
                  ? 'bg-[#00ff88] text-[#0a0a0a] border-[#00ff88] hover:bg-transparent hover:text-[#00ff88]'
                  : 'bg-green-600 text-white border-green-600 hover:bg-transparent hover:text-green-600'
              } font-semibold rounded-lg border-2 transition-all duration-300 active:scale-95 text-base`}
            >
              {t.hero.ctaWork}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`px-8 py-3.5 bg-transparent font-semibold rounded-lg border-2 ${
                theme === 'dark'
                  ? 'border-gray-700 text-white hover:border-[#00ff88] hover:text-[#00ff88]'
                  : 'border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600'
              } transition-all duration-300 active:scale-95 text-base`}
            >
              {t.hero.ctaContact}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className={`w-5 h-8 border-2 ${
          theme === 'dark' ? 'border-[#00ff88]/60' : 'border-green-600/60'
        } rounded-xl opacity-70`}>
          <div className={`scroll-dot absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 ${
            theme === 'dark' ? 'bg-[#00ff88]' : 'bg-green-600'
          } rounded-sm`} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;