// components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* App Information Section - Meets Google OAuth Requirements */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* App Description */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mima Shopping App</h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Your ultimate shopping companion
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">
                Discover amazing deals, track prices, and shop smarter with our mobile-optimized platform. 
                Mima helps you find the best products from trusted sellers.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">Google OAuth Usage</h3>
                <p className="text-blue-200 text-sm">
                  We use Google OAuth to securely create your account using only your basic profile 
                  information (email and name) to personalize your shopping experience.
                </p>
              </div>
            </div>

            {/* Quick Links & Legal */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link to="/categories/electronics" className="block text-gray-400 hover:text-white transition-colors">
                    Electronics
                  </Link>
                  <Link to="/categories/fashion" className="block text-gray-400 hover:text-white transition-colors">
                    Fashion
                  </Link>
                  <Link to="/explore" className="block text-gray-400 hover:text-white transition-colors">
                    Explore
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <div className="space-y-2 text-sm">
                  <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                  <a href="mailto:support@mimaht.com" className="block text-gray-400 hover:text-white transition-colors">
                    Contact Support
                  </a>
                  <a href="mailto:privacy@mimaht.com" className="block text-gray-400 hover:text-white transition-colors">
                    Privacy Questions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2024 Mima Shopping App. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-400">Verified Domain: mimaht.com</span>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Your Privacy Matters
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;