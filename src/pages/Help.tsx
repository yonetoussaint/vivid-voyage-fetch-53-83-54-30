import React from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, Book, AlertCircle } from 'lucide-react';

export default function Help() {
  return (
    <div className="w-full bg-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        </div>
        
        <div className="space-y-4">
          {/* Contact Options */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Contact Us</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Live Chat</p>
                  <p className="text-sm text-gray-600">Get instant help from our team</p>
                </div>
              </button>
              
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Call Support</p>
                  <p className="text-sm text-gray-600">+1 (800) 123-4567</p>
                </div>
              </button>
              
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-purple-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-600">support@pgecom.com</p>
                </div>
              </button>
            </div>
          </div>

          {/* Help Topics */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Help Topics</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Book className="w-5 h-5 text-orange-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Getting Started</p>
                  <p className="text-sm text-gray-600">Learn how to use PG Ecom</p>
                </div>
              </button>
              
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Orders & Returns</p>
                  <p className="text-sm text-gray-600">Manage your orders</p>
                </div>
              </button>
              
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">FAQs</p>
                  <p className="text-sm text-gray-600">Find answers to common questions</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
