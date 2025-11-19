import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', component: AdminDashboard },
    { id: 'users', label: 'User Management', component: UserManagement },
    { id: 'sellers', label: 'Seller Management', component: null },
    { id: 'products', label: 'Product Management', component: null },
    { id: 'orders', label: 'Order Management', component: null },
    { id: 'analytics', label: 'Analytics', component: null },
    { id: 'settings', label: 'Settings', component: null },
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side - Sandwich menu and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          </div>

          {/* Right side - User info */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          bg-white shadow-sm border-r border-gray-200 transition-all duration-300
          ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
        `}>
          <nav className="h-full py-4">
            <ul className="space-y-1 px-3">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-colors
                      ${activeSection === item.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;