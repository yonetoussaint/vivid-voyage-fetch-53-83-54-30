import React from 'react';
import { X, Mail, Phone, MapPin, Globe, Github, Linkedin, Download } from 'lucide-react';

interface SidePanelProps {
  sidePanelOpen: boolean;
  toggleSidePanel: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ sidePanelOpen, toggleSidePanel }) => {
  return (
    <>
      {sidePanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-50"
          onClick={toggleSidePanel}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 z-50 transform transition-transform duration-200 ${sidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Profile & Contact</h2>
            <button
              onClick={toggleSidePanel}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" 
                alt="Alex Chen"
                className="w-14 h-14 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">Alex Chen</h3>
                <p className="text-sm text-gray-600">Full Stack Developer</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-500">Available for work</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contact</h3>

            <div className="space-y-3">
              <a href="mailto:alex@example.com" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">alex@example.com</p>
                </div>
              </a>

              <a href="tel:+15551234567" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">San Francisco, CA</p>
                </div>
              </div>

              <a href="https://alexchen.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors">
                <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium text-gray-900">alexchen.dev</p>
                </div>
              </a>
            </div>

            <h3 className="text-sm font-medium text-gray-700 mt-6 mb-3">Connect</h3>
            <div className="flex gap-2">
              <a href="#" className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                <Github className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">GitHub</span>
              </a>
              <a href="#" className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 rounded transition-colors">
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-medium text-blue-900">LinkedIn</span>
              </a>
            </div>

            <button className="w-full flex items-center justify-center gap-2 p-3 mt-6 bg-gray-900 hover:bg-black text-white rounded transition-colors">
              <Download className="w-5 h-5" />
              <span className="font-medium">Download CV</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};