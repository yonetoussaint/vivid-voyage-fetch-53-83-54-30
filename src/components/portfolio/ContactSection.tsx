import React from 'react';

const ContactSection = ({
  theme,
  t,
  language,
  contactForm,
  handleInputChange,
  handleContactSubmit,
  formStatus,
  copyToClipboard,
  contactLinks
}) => {
  return (
    <section id="contact" className="py-20 px-4 max-w-2xl mx-auto">
      <div className="text-center px-2 py-2">
        <h2 
          className="text-[clamp(2rem,5vw,3rem)] mb-6 font-extrabold tracking-tight"
          dangerouslySetInnerHTML={{ __html: t.contact.title }}
        />
        <p className={`text-lg mb-10 px-2 py-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.contact.subtitle}
        </p>

        {/* Contact Form */}
        <form onSubmit={handleContactSubmit} className="mb-12">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t.contact.name} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                  } outline-none transition-all duration-300`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t.contact.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                  } outline-none transition-all duration-300`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.contact.subject} *
              </label>
              <input
                type="text"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                } outline-none transition-all duration-300`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.contact.message} *
              </label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                } outline-none transition-all duration-300 resize-none`}
              />
            </div>

            {formStatus.message && (
              <div className={`p-4 rounded-lg ${
                formStatus.type === 'success'
                  ? theme === 'dark'
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20'
                    : 'bg-green-50 text-green-800 border border-green-200'
                  : formStatus.type === 'error'
                  ? theme === 'dark'
                    ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                    : 'bg-red-50 text-red-800 border border-red-200'
                  : theme === 'dark'
                    ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus.type === 'sending'}
              className={`w-full py-3.5 font-semibold rounded-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {formStatus.type === 'sending' ? t.contact.sending : t.contact.send}
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="space-y-4 mb-12">
          <div className={`p-5 rounded-xl ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    yone95572@gmail.com
                  </p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard('yone95572@gmail.com')}
                className={`p-2 rounded-lg hover:opacity-80 transition-all duration-200 ${
                  theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                }`}
                title={language === 'fr' ? 'Copier l\'email' : 'Copy email'}
              >
                📋
              </button>
            </div>
          </div>

          <div className={`p-5 rounded-xl ${
            theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    +47279318
                  </p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard('+47279318')}
                className={`p-2 rounded-lg hover:opacity-80 transition-all duration-200 ${
                  theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                }`}
                title={language === 'fr' ? 'Copier le numéro' : 'Copy number'}
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 py-2">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 active:scale-95 ${
                theme === 'dark'
                  ? 'bg-[#111] border-[#222] hover:border-[#00ff88] hover:bg-[#1a1a1a]'
                  : 'bg-white border-gray-200 hover:border-green-600 hover:bg-green-50 shadow-sm'
              }`}
            >
              <span className="text-2xl mb-2">{link.icon}</span>
              <span className="text-sm font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;