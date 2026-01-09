import React from 'react';
import { Github, Linkedin, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { tabs } from './data';

interface HeaderProps {
  activeTab: string;
  mobileMenuOpen: boolean;
  sectionDropdownOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSectionDropdownOpen: (open: boolean) => void;
  toggleSidePanel: () => void;
  scrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  mobileMenuOpen,
  sectionDropdownOpen,
  setMobileMenuOpen,
  setSectionDropdownOpen,
  toggleSidePanel,
  scrollToSection
}) => {
  const getActiveTabLabel = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : 'About';
  };

  const getActiveTabIcon = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.icon : null;
  };

  const getActiveTabDescription = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.description : 'Learn about my background';
  };

  const ActiveIcon = getActiveTabIcon();

  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidePanel}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle side panel"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            <div>
              <h1 className="font-bold text-lg">Alex Chen</h1>
              <p className="text-xs text-gray-600">Full Stack Developer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-white shadow-lg">
          <div className="max-w-4xl mx-auto py-2">
            <div className="grid grid-cols-2 gap-2 px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      scrollToSection(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!mobileMenuOpen && (
        <div className="border-t">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {ActiveIcon && <ActiveIcon className="w-4 h-4 text-gray-500" />}
                <span className="text-gray-700 text-sm font-medium">
                  {getActiveTabLabel()}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs">
                  {getActiveTabDescription()}
                </span>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  sectionDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {sectionDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setSectionDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 bg-white border-t shadow-lg z-50">
                  <div className="max-w-4xl mx-auto pb-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => scrollToSection(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                            isActive 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{tab.label}</div>
                            <div className="text-xs text-gray-500">{tab.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};