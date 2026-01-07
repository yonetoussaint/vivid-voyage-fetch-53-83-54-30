import React from 'react';

const Footer = ({ theme, t, setShowAdmin, showAdmin, analytics }) => {
  return (
    <footer className={`text-center py-8 px-4 ${
      theme === 'dark' ? 'border-t border-[#222] text-gray-600' : 'border-t border-gray-200 text-gray-500'
    }`}>
      <p className="text-sm px-2 py-1">{t.footer.copyright}</p>
      <p className="text-xs mt-2 px-2 py-1 opacity-70">{t.footer.builtWith}</p>

      {/* Admin Access Button (hidden by default) */}
      <button
        onClick={() => setShowAdmin(!showAdmin)}
        className="mt-4 text-xs opacity-50 hover:opacity-100 transition-opacity"
      >
        {showAdmin ? 'Hide Admin' : 'Admin'}
      </button>

      {/* Analytics Badge */}
      <div className="mt-4 text-xs opacity-50">
        {analytics.pageViews} views • {analytics.contactSubmissions} contacts
      </div>
    </footer>
  );
};

export default Footer;