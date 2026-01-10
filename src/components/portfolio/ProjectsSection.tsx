import React from 'react';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

// Tech stack data with logo URLs from public CDNs
const techStack = [
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
  { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Jest', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg' },
  { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutRef, visibleSections }) => {
  return (
    <section ref={aboutRef} id="about" className="scroll-mt-20">
      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-[12px]">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Portrait professionnel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        </div>

        {/* Bio Card - Clean Header */}
        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Enchanté ✨</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ingénieur logiciel passionné par la création d'expériences numériques d'exception. 
            Je consacre mon art à concevoir des produits élégants, accessibles et centrés sur l'humain, 
            à l'échelle.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Fort de plus de cinq années d'expérience, j'ai eu le privilège de collaborer sur 
            des projets variés – des plateformes e-commerce aux outils de collaboration en temps réel. 
            Mon exigence : un code d'une pureté cristalline, maintenable, qui résout avec élégance 
            les défis les plus complexes.
          </p>
        </div>

        {/* Tech Stack Card - Clean Header */}
        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">Stack technique</h3>
            </div>
            <a 
              href="https://github.com/alexchen?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>Voir les projets</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {techStack.map((tech) => (
              <div 
                key={tech.name}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <img 
                    src={tech.logo} 
                    alt={tech.name}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Card - Clean Header */}
        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">Quelques repères</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-[8px] border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
              <div className="text-sm text-gray-600">Années d'expertise</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-[8px] border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Projets aboutis</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-[8px] border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.4k</div>
              <div className="text-sm text-gray-600">Étoiles GitHub</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-[8px] border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction client</div>
            </div>
          </div>
        </div>

        {/* Contact Card - Clean Header */}
        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">Restons en contact</h3>
          </div>
          <div className="space-y-3">
            <a 
              href="mailto:alex@example.com" 
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200">
                <Mail className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 truncate">alex@example.com</div>
                <div className="text-xs text-gray-400">Email professionnel</div>
              </div>
            </a>
            <a 
              href="https://github.com/alexchen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200">
                <Github className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 truncate">github.com/alexchen</div>
                <div className="text-xs text-gray-400">Projets open-source</div>
              </div>
            </a>
            <a 
              href="https://linkedin.com/in/alexchen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200">
                <Linkedin className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 truncate">linkedin.com/in/alexchen</div>
                <div className="text-xs text-gray-400">Expérience professionnelle</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};