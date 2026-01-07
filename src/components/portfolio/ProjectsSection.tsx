import React from 'react';
import { motion } from 'framer-motion';

const ProjectsSection = ({ 
  theme, 
  t, 
  activeProjectFilter, 
  setActiveProjectFilter, 
  filteredProjects, 
  setSelectedProject,
  trackProjectClick
}) => {
  return (
    <section id="work" className="py-20 px-4 max-w-6xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.projects.title }}
      />

      {/* Project Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-12 px-2 py-2">
        {['all', 'web', 'sdk', 'opensource'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveProjectFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeProjectFilter === filter
                ? theme === 'dark'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-green-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.projects[`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`]}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-2">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`project-card ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'
            } p-6 rounded-xl border hover:border-[#00ff88] active:scale-[0.99] transition-all duration-300 shadow-lg`}
          >
            {/* Project Logo & Title */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`text-3xl p-3 rounded-lg border ${
                theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-300'
              }`}>
                {project.logo}
              </div>
              <div>
                <h3 className="text-xl font-bold">{project.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className={`px-2 py-1 text-xs border rounded ${
                      theme === 'dark' 
                        ? 'bg-[#2a2a2a] border-[#333]' 
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className={`text-sm mb-5 leading-relaxed px-1 py-1 line-clamp-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag, i) => (
                <span key={i} className={`px-2.5 py-1 text-xs border rounded ${
                  theme === 'dark' 
                    ? 'bg-[#1a1a1a] border-[#2a2a2a]' 
                    : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {project.link && project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProjectClick(project.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all duration-300 active:scale-[0.98] text-sm ${
                    theme === 'dark'
                      ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#00ff88] hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88]'
                      : 'bg-gray-100 border-gray-300 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'
                  }`}
                >
                  <span>{t.projects.visitSite}</span>
                  <span>→</span>
                </a>
              )}

              <button
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2.5 rounded-lg border font-medium transition-all duration-300 active:scale-[0.98] text-sm ${
                  theme === 'dark'
                    ? 'border-[#2a2a2a] text-gray-400 hover:border-[#00ff88] hover:text-[#00ff88]'
                    : 'border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600'
                }`}
              >
                {t.projects.viewDetails}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;