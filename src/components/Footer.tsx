// components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-600 text-sm">
              © 2024 Mima. All rights reserved.
            </span>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/privacy" 
              className="text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:support@mimaht.com" 
              className="text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;