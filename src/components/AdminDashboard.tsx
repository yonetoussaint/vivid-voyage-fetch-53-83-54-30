import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard({ projects, analytics, theme, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-2xl flex ${
          theme === 'dark' ? 'bg-[#111]' : 'bg-white'
        }`}
      >
        {/* Sidebar */}
        <div className={`w-64 border-r ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-gray-50 border-gray-200'
        } p-6`}>
          <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            {['overview', 'projects', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? theme === 'dark'
                      ? 'bg-[#00ff88] text-black'
                      : 'bg-green-600 text-white'
                    : theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ✕
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <h4 className="text-lg font-semibold">Page Views</h4>
                  <p className="text-3xl font-bold mt-2">{analytics.pageViews}</p>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <h4 className="text-lg font-semibold">Contact Submissions</h4>
                  <p className="text-3xl font-bold mt-2">{analytics.contactSubmissions}</p>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <h4 className="text-lg font-semibold">Projects</h4>
                  <p className="text-3xl font-bold mt-2">{projects.length}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Project Clicks</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.projectClicks).map(([projectId, clicks]) => {
                    const project = projects.find(p => p.id === parseInt(projectId));
                    return (
                      <div key={projectId} className="flex items-center justify-between">
                        <span>{project?.title || `Project ${projectId}`}</span>
                        <span className="font-semibold">{clicks} clicks</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Manage Projects</h4>
                <button className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-green-600 text-white'
                }`}>
                  Add New Project
                </button>
              </div>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{project.logo}</span>
                        <div>
                          <h5 className="font-semibold">{project.title}</h5>
                          <p className="text-sm opacity-70">{project.tags.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Analytics Overview</h4>
              <p>More analytics features coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Theme Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Enable dark mode by default</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Follow system theme</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Form</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Email Service</label>
                    <select className={`w-full p-2 rounded border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-300'
                    }`}>
                      <option>EmailJS</option>
                      <option>Formspree</option>
                      <option>Custom API</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className={`px-6 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-green-600 text-white'
              }`}>
                Save Settings
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}