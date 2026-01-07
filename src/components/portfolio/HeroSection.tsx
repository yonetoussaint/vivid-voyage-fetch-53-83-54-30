import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ theme, t, typedText, scrollToSection }) => {
  const [displayText, setDisplayText] = useState(t.hero.description);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (typedText && typedText !== displayText) {
      setIsTyping(true);
      setDisplayText(typedText);
      const timer = setTimeout(() => setIsTyping(false), 100);
      return () => clearTimeout(timer);
    }
  }, [typedText, displayText]);

  useEffect(() => {
    setDisplayText(t.hero.description);
    setIsTyping(false);
  }, [t.hero.description]);

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-16 pb-12 relative">
      <div className="w-full max-w-4xl px-3 py-4">
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 md:border-3 border-[#00ff88] mb-4 md:mb-6"
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
            className="text-[clamp(2rem,6vw,4rem)] font-bold leading-tight mb-3 tracking-tight"
          >
            Yoné<br />
            <span className="text-[#00ff88]">Toussaint</span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[clamp(1rem,2.5vw,1.2rem)] text-gray-400 mb-6 max-w-lg px-2 leading-relaxed min-h-[4rem] flex items-center justify-center"
          >
            <div className={`relative ${isTyping ? 'typing-cursor' : ''}`}>
              {displayText || t.hero.description}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 px-2 w-full max-w-xs sm:max-w-md"
          >
            <button
              onClick={() => scrollToSection('work')}
              className={`px-6 py-3 ${
                theme === 'dark' 
                  ? 'bg-[#00ff88] text-[#0a0a0a] border-[#00ff88] hover:bg-transparent hover:text-[#00ff88]'
                  : 'bg-green-600 text-white border-green-600 hover:bg-transparent hover:text-green-600'
              } font-semibold rounded-lg border-2 transition-all duration-300 active:scale-95 text-sm sm:text-base w-full`}
            >
              {t.hero.ctaWork}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`px-6 py-3 bg-transparent font-semibold rounded-lg border-2 ${
                theme === 'dark'
                  ? 'border-gray-700 text-white hover:border-[#00ff88] hover:text-[#00ff88]'
                  : 'border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600'
              } transition-all duration-300 active:scale-95 text-sm sm:text-base w-full`}
            >
              {t.hero.ctaContact}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Smaller on Mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className={`w-4 h-6 border-2 ${
          theme === 'dark' ? 'border-[#00ff88]/60' : 'border-green-600/60'
        } rounded-xl opacity-70`}>
          <div className={`scroll-dot absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1.5 ${
            theme === 'dark' ? 'bg-[#00ff88]' : 'bg-green-600'
          } rounded-sm`} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;