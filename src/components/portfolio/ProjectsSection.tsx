import React from 'react';
import { Star, ExternalLink, Globe, Users, GitFork, ChevronRight } from 'lucide-react';
import { projects } from './data';

interface ProjectsSectionProps {
  projectsRef: React.RefObject<HTMLElement>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsRef }) => {
  return (
    <section ref={projectsRef} id="projects" className="scroll-mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Web Apps</h2>
            <p className="text-gray-600 mt-2">Interactive applications built with modern technologies</p>
          </div>
          <a 
            href="#" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
          >
            View all projects
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Logo/Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 flex items-center justify-center">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-blue-600">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {project.company || "Web Application"}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <a 
                        href={project.liveUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none min-w-[120px]"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 flex-1 sm:flex-none min-w-[100px]"
                        >
                          <GitFork className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-700 text-sm font-medium ml-1">
                        {project.stars || "142"}
                      </span>
                    </div>
                    
                    {project.forks && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <GitFork className="w-3 h-3 mr-1" />
                        <span>{project.forks}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{project.users || "Active Users"}</span>
                    </div>
                    
                    <span className="text-gray-500 text-sm truncate">
                      {project.tech?.[0] || "React"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {project.desc}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech?.map((tech, j) => (
                  <span 
                    key={j}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Screenshots */}
              <div className="mb-6">
                <h4 className="text-gray-900 font-medium mb-3">Preview</h4>
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {project.screenshots?.map((screenshot, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 w-56 h-32 sm:w-64 sm:h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={screenshot} 
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )) || (
                      <div className="flex-shrink-0 w-full h-32 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center text-gray-500">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                          <p className="text-sm">No preview available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                <div className="text-sm text-gray-500">
                  Updated {project.lastUpdated || "recently"}
                </div>
                <a 
                  href="#" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
                >
                  View details
                  <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 lg:hidden">
          <a 
            href="#" 
            className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-lg transition-colors border border-gray-200"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
};