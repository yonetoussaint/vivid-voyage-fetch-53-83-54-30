// components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* App Description Section - Meets Google Requirements */}
        <div className="border-b border-gray-800 pb-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h2 className="text-2xl font-bold">Mima Shopping App</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">About Mima</h3>
              <p className="text-gray-300 mb-4">
                Mima is your ultimate shopping companion. Discover amazing deals, track prices, 
                and shop smarter with our mobile-optimized platform.
              </p>
              <p className="text-gray-300">
                We use Google OAuth to securely create your account and personalize your shopping experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Usage Transparency</h3>
              <p className="text-gray-300 mb-3">
                When you sign in with Google, we only access your basic profile information (email and name) to:
              </p>
              <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                <li>Create and manage your Mima account</li>
                <li>Personalize your shopping experience</li>
                <li>Send order notifications</li>
                <li>Provide customer support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Mima App</h4>
            <p className="text-gray-400 text-sm">
              Your smart shopping companion for finding the best deals and managing your purchases.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link 
                to="/privacy" 
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a 
                href="mailto:support@mimaht.com" 
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="mailto:help@mimaht.com" 
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Help Center
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-gray-400 text-sm">
              Have questions about our app or how we use your data? We're here to help.
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Mima Shopping App. All rights reserved. 
            <span className="mx-2">•</span>
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Your privacy is important to us
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;