import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = ({ theme, t, experience }) => {
  return (
    <section id="experience" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.experience.title }}
      />

      <div className="space-y-8">
        {experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`relative pl-8 border-l-2 ${
              theme === 'dark' ? 'border-[#00ff88]' : 'border-green-600'
            }`}
          >
            {/* Current badge */}
            {exp.current && (
              <span className={`absolute -left-2 top-0 px-3 py-1 text-xs font-medium rounded-full ${
                theme === 'dark' 
                  ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {t.experience.current}
              </span>
            )}

            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{exp.title}</h3>
                  <p className={`text-lg ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>
                    {exp.company}
                  </p>
                </div>
                <div className={`mt-2 md:mt-0 text-right ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <p className="font-medium">{exp.period}</p>
                  <p className="text-sm">{exp.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t.experience.responsibilities}:</h4>
                <ul className={`space-y-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {exp.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t.experience.achievements}:</h4>
                <ul className={`space-y-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className={`mr-2 ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t.experience.techStack}:</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.techStack.map((tech, i) => (
                    <span key={i} className={`px-3 py-1 text-sm rounded-full ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2a] text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;