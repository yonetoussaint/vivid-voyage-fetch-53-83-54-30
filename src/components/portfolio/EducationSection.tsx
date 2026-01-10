import React from 'react';
import { Calendar, GraduationCap, Award } from 'lucide-react';
import { education, certifications } from './data';

interface EducationSectionProps {
  educationRef: React.RefObject<HTMLElement>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationRef }) => {
  return (
    <section ref={educationRef} id="education" className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 px-2">Education & Certifications</h2>

      <div className="space-y-4 mb-6">
        {education.map((edu, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold mb-1">{edu.degree}</h3>
                <div className="text-sm text-gray-600 mb-1">{edu.institution}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{edu.period}</span>
                </div>
                <p className="text-sm text-gray-600">{edu.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-3 px-2">Professional Certifications</h3>
      <div className="space-y-3">
        {certifications.map((cert, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm mb-1">{cert.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{cert.issuer}</span>
                  <span className="text-xs text-gray-500">{cert.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};