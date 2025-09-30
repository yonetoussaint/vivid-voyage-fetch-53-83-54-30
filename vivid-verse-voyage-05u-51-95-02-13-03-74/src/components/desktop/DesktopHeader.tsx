
import React from 'react';
import { Globe, Search, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/common/LanguageSelector';
import UserDropdownMenu from './UserDropdownMenu';

const DesktopHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log('Logout clicked - clearing authentication');
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('authStateChanged'));
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  GLOBAL TRANSFÈ
                </h1>
                <p className="text-sm text-muted-foreground -mt-1">Worldwide Money Transfer</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Send Money
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/transfer-history')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/track-transfer')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Track
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/locations')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Locations
            </Button>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-64 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  2
                </Badge>
              </Button>
            </div>

            {/* User Menu */}
            <UserDropdownMenu onNavigate={handleNavigation} onLogout={handleLogout} />

            {/* Quick Transfer Button */}
            <Button variant="default" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              Quick Transfer
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
