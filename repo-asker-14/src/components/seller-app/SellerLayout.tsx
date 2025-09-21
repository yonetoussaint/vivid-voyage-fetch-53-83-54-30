import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Warehouse, DollarSign, Megaphone, HelpCircle, Settings,
  Menu, Bell, Store, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductHeader from '@/components/product/ProductHeader';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBackClick = () => {
    navigate('/profile');
  };

  const navigationItems = [
    { name: 'Overview', href: '/seller-dashboard/overview', icon: LayoutDashboard },
    { name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { name: 'Inventory', href: '/seller-dashboard/inventory', icon: Warehouse },
    { name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { name: 'Support', href: '/seller-dashboard/support', icon: HelpCircle },
    { name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-72' : 'w-64'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Seller Hub</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={`w-full justify-start min-h-[44px] h-12 px-3 text-left ${
                  isActive(item.href) 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Button>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">John's Store</p>
                <p className="text-muted-foreground truncate">Premium Seller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Product Header */}
        <ProductHeader
          forceScrolledState={true}
          showCloseIcon={true}
          onCloseClick={handleBackClick}
          stickyMode={true}
          actionButtons={[
            {
              Icon: Bell,
              onClick: () => {},
              count: 3
            }
          ]}
        />
        
        {/* Mobile Sidebar Toggle - Show on mobile when header is present */}
        {isMobile && (
          <div className="fixed top-2 left-2 z-40">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm border"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        )}


        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;