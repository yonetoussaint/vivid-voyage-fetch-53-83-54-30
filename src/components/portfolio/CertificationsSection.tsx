import React from 'react';
import { motion } from 'framer-motion';

const CertificationsSection = ({ theme, t, certifications, language }) => {
  return (
    <section id="certifications" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.certifications.title }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2">
        {certifications.map((cert) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl border ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`text-3xl p-3 rounded-lg ${
                theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
              }`}>
                {cert.logo}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{cert.title}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cert.issuer}
                </p>
                <div className={`flex items-center gap-4 mt-2 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <span>{t.certifications.issued}: {new Date(cert.date).toLocaleDateString(language)}</span>
                  {cert.expiry && (
                    <span>{t.certifications.validUntil}: {new Date(cert.expiry).toLocaleDateString(language)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                ID: {cert.credentialId}
              </span>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#1a1a1a] text-[#00ff88] hover:bg-[#00ff88] hover:text-black'
                    : 'bg-gray-100 text-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                {t.certifications.viewCert}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection;