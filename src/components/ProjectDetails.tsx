import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectDetails({ project, t, theme, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${
          theme === 'dark' ? 'bg-[#111]' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-4xl p-4 rounded-xl ${
              theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
            }`}>
              {project.logo}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className={`px-3 py-1 text-sm rounded-full ${
                    theme === 'dark' 
                      ? 'bg-[#2a2a2a] text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
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

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t.projects.description}</h3>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {project.fullDescription || project.description}
            </p>
          </div>

          {project.challenges && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.projects.challenges}</h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {challenge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.solutions && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.projects.solutions}</h3>
              <ul className="space-y-2">
                {project.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`mr-2 ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>✓</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {solution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-800">
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 text-center py-3 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {t.projects.liveDemo}
              </a>
            )}
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 text-center py-3 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t.projects.repository}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}