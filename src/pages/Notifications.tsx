import React from 'react';
import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="w-full bg-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Welcome to PG Ecom!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Start exploring amazing deals and products
                </p>
                <p className="text-xs text-gray-400 mt-2">Just now</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Special Offer</p>
                <p className="text-sm text-gray-600 mt-1">
                  Get 20% off on your first purchase
                </p>
                <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
