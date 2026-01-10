import React from 'react';
import { Star, ExternalLink, Globe, GitFork, ChevronRight, Download, Users } from 'lucide-react';
import { projects } from './data';

interface ProjectsSectionProps {
  projectsRef: React.RefObject<HTMLElement>;
}

// Tech logo mapping - using a public CDN (e.g., skillicons.dev or simpleicons.org)
const getTechLogoUrl = (techName: string) => {
  // Convert tech name to lowercase for consistent lookups
  const tech = techName.toLowerCase().trim();
  
  // Map common tech names to skillicons
  const iconMap: Record<string, string> = {
    'react': 'react',
    'typescript': 'typescript',
    'javascript': 'javascript',
    'nodejs': 'nodedotjs',
    'node.js': 'nodedotjs',
    'nextjs': 'nextdotjs',
    'next.js': 'nextdotjs',
    'vue': 'vuedotjs',
    'angular': 'angular',
    'python': 'python',
    'django': 'django',
    'flask': 'flask',
    'java': 'openjdk',
    'spring': 'spring',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'laravel': 'laravel',
    'mysql': 'mysql',
    'postgresql': 'postgresql',
    'mongodb': 'mongodb',
    'redis': 'redis',
    'docker': 'docker',
    'kubernetes': 'kubernetes',
    'aws': 'amazonaws',
    'azure': 'microsoftazure',
    'gcp': 'googlecloud',
    'firebase': 'firebase',
    'graphql': 'graphql',
    'tailwind': 'tailwindcss',
    'sass': 'sass',
    'redux': 'redux',
    'jest': 'jest',
    'webpack': 'webpack',
    'vite': 'vite',
    'git': 'git',
    'github': 'github',
    'gitlab': 'gitlab',
    'figma': 'figma',
    'adobe': 'adobephotoshop',
    'photoshop': 'adobephotoshop',
    'illustrator': 'adobeillustrator',
    'xd': 'adobexd'
  };

  const iconName = iconMap[tech] || tech;
  
  // Using skillicons.dev CDN
  return `https://skillicons.dev/icons?i=${iconName}`;
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsRef }) => {
  return (
    <section ref={projectsRef} id="projects" className="scroll-mt-16  py-8 md:px-6 lg:px-8">
      {/* Header - Simplified for mobile */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-500 text-sm">Discover my latest web applications and projects</p>
      </div>

      {/* Projects Grid - Mobile first approach */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
          >
            {/* Project Header - Clean, no color */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                {/* App Logo/Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm border border-gray-300">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-gray-700 font-bold text-lg">
                        {project.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {project.company || "Web Application"}
                    </p>
                  </div>
                </div>
                
                {/* Star Rating - Compact */}
                <div className="flex items-center gap-1 bg-gray-50 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-700 font-medium text-sm">
                    {project.stars || "4.8"}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-5">
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.desc}
              </p>

              {/* Stats Row - Horizontal Scroll on Mobile */}
              <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                  <Download className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 text-sm font-medium">
                    {project.downloads || "5M+"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 text-sm font-medium">
                    {project.users || "Active Users"}
                  </span>
                </div>

                {project.forks && (
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <GitFork className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-sm font-medium">
                      {project.forks}
                    </span>
                  </div>
                )}
              </div>

              {/* Tech Stack - Grid layout with logos */}
              <div className="mb-5">
                <h4 className="text-gray-700 text-sm font-semibold mb-3">Tech Stack</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {project.tech?.slice(0, 6).map((tech, j) => (
                    <div 
                      key={j}
                      className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group relative"
                      title={tech}
                    >
                      <div className="w-8 h-8 mb-1 flex items-center justify-center">
                        <img 
                          src={getTechLogoUrl(tech)}
                          alt={tech}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to text if icon fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = 
                              `<span class="text-gray-700 font-medium text-xs">${tech.charAt(0).toUpperCase()}</span>`;
                          }}
                        />
                      </div>
                      <span className="text-gray-600 text-xs text-center truncate w-full">
                        {tech.length > 10 ? `${tech.substring(0, 9)}...` : tech}
                      </span>
                    </div>
                  ))}
                  {project.tech && project.tech.length > 6 && (
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 mb-1 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-lg">+</span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {project.tech.length - 6} more
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Single Featured Screenshot - Better for mobile */}
              <div className="mb-5">
                <h4 className="text-gray-700 text-sm font-semibold mb-2">Preview</h4>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {project.screenshots?.[0] ? (
                    <img 
                      src={project.screenshots[0]} 
                      alt={`${project.title} preview`}
                      className="w-full h-40 object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Preview coming soon</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Stacked on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={project.liveUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  Live Demo
                </a>
                
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <GitFork className="w-4 h-4" />
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  Updated: {project.lastUpdated || "Recently"}
                </span>
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                >
                  Details <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-only hint */}
      <div className="mt-8 text-center md:hidden">
        <p className="text-gray-400 text-sm">💡 Swipe horizontally to see more info</p>
      </div>
    </section>
  );
};