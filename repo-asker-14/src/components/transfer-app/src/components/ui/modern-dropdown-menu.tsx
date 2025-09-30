
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Clock, MapPin, Send, Settings, LogOut, CreditCard, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth-sdk/contexts/AuthContext';

interface SubmenuItem {
  label: string;
  icon?: React.ComponentType<any>;
  action: () => void;
  danger?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  hasSubmenu?: boolean;
  submenu?: SubmenuItem[];
  action?: () => void;
}

const ModernDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      hasSubmenu: true,
      submenu: [
        { label: 'Profile Settings', icon: Settings, action: () => navigate('/account') },
        { label: 'Payment Methods', icon: CreditCard, action: () => console.log('Payment Methods') },
        { label: 'Notifications', icon: Bell, action: () => console.log('Notifications') },
        { label: 'Privacy & Security', icon: Shield, action: () => console.log('Privacy & Security') },
        { label: 'Sign Out', icon: LogOut, action: handleLogout, danger: true }
      ]
    },
    {
      id: 'history',
      label: 'History',
      icon: Clock,
      hasSubmenu: true,
      submenu: [
        { label: 'Transfer History', action: () => navigate('/transfer-history') },
        { label: 'Transaction Records', action: () => console.log('Transaction Records') },
        { label: 'Download Reports', action: () => console.log('Download Reports') }
      ]
    },
    {
      id: 'track',
      label: 'Track Transfer',
      icon: Send,
      action: () => navigate('/track-transfer')
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: MapPin,
      hasSubmenu: true,
      submenu: [
        { label: 'Find Nearby Agents', action: () => navigate('/locations') },
        { label: 'Branch Locator', action: () => console.log('Branch Locator') },
        { label: 'ATM Finder', action: () => console.log('ATM Finder') }
      ]
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else if (item.action) {
      item.action();
      setIsOpen(false);
    }
  };

  const handleSubmenuItemClick = (submenuItem: SubmenuItem) => {
    submenuItem.action();
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-64 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <span>Menu</span>
        <ChevronDown 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleMenuItemClick(item)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        activeSubmenu === item.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {item.hasSubmenu && activeSubmenu === item.id && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {item.submenu?.map((submenuItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubmenuItemClick(submenuItem)}
                        className={`w-full flex items-center px-12 py-2.5 text-sm transition-colors duration-150 ${
                          submenuItem.danger 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {submenuItem.icon && (
                          <submenuItem.icon className="h-3.5 w-3.5 mr-2.5" />
                        )}
                        <span>{submenuItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDropdownMenu;
