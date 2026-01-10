import React from 'react';
import { Star, ExternalLink, Globe, Users, GitFork, ChevronRight } from 'lucide-react';
import { projects } from './data';

interface ProjectsSectionProps {
  projectsRef: React.RefObject<HTMLElement>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsRef }) => {
  return (
    <section ref={projectsRef} id="projects" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold">Featured Web Apps</h2>
        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-8">
        {projects.map((project, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Web App Header Section */}
            <div className="flex items-start gap-4 mb-6">
              {/* Web App Logo */}
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

              {/* Web App Info */}
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {project.company || "Web Application"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={project.liveUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Live Demo
                    </a>
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <GitFork className="w-4 h-4" />
                        Code
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-700 text-sm font-medium ml-1">
                      {project.stars || "142"}
                    </span>
                  </div>
                  
                  {project.forks && (
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <GitFork className="w-3 h-3" />
                      <span>{project.forks} forks</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Users className="w-3 h-3" />
                    <span>{project.users || "Active Users"}</span>
                  </div>
                  
                  <span className="text-gray-500 text-sm">
                    {project.tech?.[0] || "React"}
                  </span>
                </div>
              </div>
            </div>

            {/* Web App Description */}
            <p className="text-gray-600 text-sm mb-6">
              {project.desc}
            </p>

            {/* Technology Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech?.map((tech, j) => (
                <span 
                  key={j}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Horizontal Scrollable Screenshots/Previews */}
            <div className="mb-4">
              <h4 className="text-gray-900 font-medium mb-3">Preview</h4>
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                  {project.screenshots?.map((screenshot, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img 
                        src={screenshot} 
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )) || (
                    <div className="w-full h-40 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                      No preview images available
                    </div>
                  )}
                </div>
                
                {/* Scroll indicator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Last updated: {project.lastUpdated || "Recently"}
              </div>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};