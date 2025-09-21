import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Warehouse, DollarSign, Megaphone, HelpCircle, Settings,
  Bell, Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductHeader from '@/components/product/ProductHeader';
import TabsNavigation from '@/components/home/TabsNavigation';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBackClick = () => {
    navigate('/profile');
  };

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/seller-dashboard/')[1];
    return path || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/seller-dashboard/overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', href: '/seller-dashboard/inventory', icon: Warehouse },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'support', name: 'Support', href: '/seller-dashboard/support', icon: HelpCircle },
    { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      setActiveTab(tabId);
      navigate(item.href);
    }
  };

  // Convert navigation items to tabs format
  const tabs = navigationItems.map(item => ({
    id: item.id,
    label: item.name
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header with seller info */}
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

      {/* Seller Info Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">John's Store</h1>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Premium Seller Dashboard</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>⭐ Premium Account</span>
                <span>📊 Dashboard Analytics</span>
                <span>🛡️ Verified Business</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="bg-white border-b sticky top-16 z-30">
        <TabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>
    </div>
  );
};

export default SellerLayout;