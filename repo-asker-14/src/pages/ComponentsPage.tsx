
import React from 'react';
import ModernDropdownMenu from '@/components/transfer-app/ui/modern-dropdown-menu';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Modern Dropdown Menu</h1>
          <p className="text-gray-600">Ultra-clean design with nested features for seamless navigation</p>
        </div>

        <ModernDropdownMenu />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click outside to close menu</li>
            <li>• Smooth animations and transitions</li>
            <li>• Nested submenu support</li>
            <li>• Keyboard accessible</li>
            <li>• Clean shadcn-inspired design</li>
            <li>• Integrated with app navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
