import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function Addresses() {
  return (
    <div className="w-full bg-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add New</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-gray-900">Home</p>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">Default</span>
                </div>
                <p className="text-sm text-gray-600">
                  123 Main Street, Apt 4B<br />
                  New York, NY 10001<br />
                  United States
                </p>
                <p className="text-sm text-gray-500 mt-2">Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-2">Work</p>
                <p className="text-sm text-gray-600">
                  456 Business Ave, Suite 200<br />
                  New York, NY 10002<br />
                  United States
                </p>
                <p className="text-sm text-gray-500 mt-2">Phone: +1 (555) 987-6543</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
