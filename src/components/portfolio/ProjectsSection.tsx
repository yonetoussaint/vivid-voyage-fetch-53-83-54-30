import React from 'react';
import { Star, GitFork, ExternalLink, Github } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { projects } from './data';

interface ProjectsSectionProps {
  projectsRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsRef, visibleSections }) => {
  return (
    <section ref={projectsRef} id="projects" className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 px-2">Projects</h2>
      <div className="space-y-4">
        {projects.map((project, i) => (
          <AnimatedSection key={i} id="projects" delay={i * 100} visibleSections={visibleSections}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {project.stars}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-gray-600" />
                    {project.forks}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech.map((tech, j) => (
                    <span 
                      key={j}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Project
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="#" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};