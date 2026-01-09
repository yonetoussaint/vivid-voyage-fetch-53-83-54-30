import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { experience } from './data';

interface ExperienceSectionProps {
  experienceRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experienceRef, visibleSections }) => {
  return (
    <section ref={experienceRef} id="experience" className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 px-2">Experience</h2>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

        <div className="space-y-6">
          {experience.map((exp, i) => (
            <AnimatedSection key={i} id="experience" delay={i * 100} visibleSections={visibleSections}>
              <div className="relative pl-16">
                <div className="absolute left-6 top-5 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>

                <div className="absolute left-0 top-4 w-12 text-center">
                  <span className="text-xs font-bold text-blue-600">{exp.year}</span>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                      <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};