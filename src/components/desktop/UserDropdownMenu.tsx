import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Clock, MapPin, Send, Settings, LogOut, CreditCard, Bell, Shield } from 'lucide-react';

interface UserDropdownMenuProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const menuItems = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      hasSubmenu: true,
      submenu: [
        { label: 'Profile Settings', icon: Settings, action: () => onNavigate('/account') },
        { label: 'Payment Methods', icon: CreditCard, action: () => console.log('Payment Methods') },
        { label: 'Notifications', icon: Bell, action: () => console.log('Notifications') },
        { label: 'Privacy & Security', icon: Shield, action: () => console.log('Privacy & Security') },
        { label: 'Sign Out', icon: LogOut, action: onLogout, danger: true }
      ]
    },
    {
      id: 'history',
      label: 'History',
      icon: Clock,
      hasSubmenu: true,
      submenu: [
        { label: 'Transfer History', action: () => onNavigate('/transfer-history') },
        { label: 'Transaction Records', action: () => console.log('Transaction Records') },
        { label: 'Download Reports', action: () => console.log('Download Reports') }
      ]
    },
    {
      id: 'track',
      label: 'Track Transfer',
      icon: Send,
      action: () => onNavigate('/track-transfer')
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: MapPin,
      hasSubmenu: true,
      submenu: [
        { label: 'Find Nearby Agents', action: () => onNavigate('/locations') },
        { label: 'Branch Locator', action: () => console.log('Branch Locator') },
        { label: 'ATM Finder', action: () => console.log('ATM Finder') }
      ]
    }
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.hasSubmenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else if (item.action) {
      item.action();
      setIsOpen(false);
    }
  };

  const handleSubmenuItemClick = (submenuItem: any) => {
    submenuItem.action();
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-gray-900">User</p>
          <p className="text-xs text-gray-500">Premium Member</p>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
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

export default UserDropdownMenu;