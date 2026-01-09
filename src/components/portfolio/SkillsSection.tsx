import React from 'react';
import { Code2 } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { skills } from './data';

interface SkillsSectionProps {
  skillsRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillsRef, visibleSections }) => {
  return (
    <section ref={skillsRef} id="skills" className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 px-2">Skills & Expertise</h2>

      <div className="space-y-4">
        {Object.entries(skills).map(([category, items], i) => (
          <AnimatedSection key={category} id="skills" delay={i * 100} visibleSections={visibleSections}>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((skill, j) => (
                  <div 
                    key={j}
                    className="group relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={skill.logo} 
                        alt={skill.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                    </div>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {skill.proficiency}% proficiency
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};