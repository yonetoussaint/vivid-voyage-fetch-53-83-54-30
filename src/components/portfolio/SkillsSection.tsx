import React from 'react';
import { motion } from 'framer-motion';

const SkillsSection = ({ theme, t, skills }) => {
  return (
    <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.skills.title }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 py-2">
        {Object.entries(skills).map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>
              {t.skills[category]}
            </h3>
            <div className="flex flex-wrap gap-3">
              {items.map((skill, index) => (
                <span
                  key={index}
                  className={`skill-item px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#00ff88] hover:bg-[#2a2a2a]'
                      : 'bg-gray-100 border-gray-300 hover:border-green-600 hover:bg-green-50'
                  } transition-all duration-200`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;