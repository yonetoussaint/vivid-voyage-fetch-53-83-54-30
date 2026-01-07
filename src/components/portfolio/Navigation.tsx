import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  t, 
  theme, 
  toggleTheme, 
  toggleLanguage, 
  language, 
  scrollToSection 
}) => {
  return (
    <>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[2000] flex items-center justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-8 text-center px-4"
            >
              {Object.entries(t.nav).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="text-3xl font-medium hover:text-[#00ff88] transition-colors duration-300 px-4 py-3"
                >
                  {value}
                </button>
              ))}
              <div className="mt-12 pt-8 border-t border-gray-700 w-48">
                <p className="text-lg text-gray-400">yone95572@gmail.com</p>
                <p className="text-lg text-gray-400 mt-2">+47279318</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full px-4 py-4 flex justify-between items-center z-[1000] ${
        theme === 'dark' ? 'bg-[#0a0a0a]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="text-xl font-bold tracking-tight px-2 py-1">YT</div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 list-none">
          {Object.entries(t.nav).map(([key, value]) => (
            <li key={key}>
              <button onClick={() => scrollToSection(key)} className={`text-sm font-medium hover:text-[#00ff88] transition-colors duration-300 px-2 py-1 ${
                theme === 'light' ? 'text-gray-700' : 'text-white'
              }`}>
                {value}
              </button>
            </li>
          ))}

          {/* Theme Toggle */}
          <li>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:opacity-80 transition-all duration-300`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>

          {/* Language Toggle */}
          <li>
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:opacity-80 transition-all duration-300 font-medium`}
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </li>
        </ul>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded bg-gray-800 text-sm font-medium"
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>
          <button 
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 px-2 py-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 ${
              theme === 'dark' ? 'bg-white' : 'bg-gray-900'
            } transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 ${
              theme === 'dark' ? 'bg-white' : 'bg-gray-900'
            } transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 ${
              theme === 'dark' ? 'bg-white' : 'bg-gray-900'
            } transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;