
import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutRef, visibleSections }) => {
  return (
    <section ref={aboutRef} id="about" className="scroll-mt-20">
      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-[12px]">
          {/* Real Profile Image */}
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />

          {/* Ultra subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-3">Hey there! 👋</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            I'm a software engineer specializing in building exceptional digital experiences. 
            Currently focused on creating accessible, human-centered products at scale.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With 5+ years of experience, I've worked on everything from e-commerce platforms 
            to real-time collaboration tools, always striving to write clean, maintainable code 
            that solves real problems.
          </p>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-[8px] border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-[8px] border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-[8px] border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.4k</div>
              <div className="text-sm text-gray-600">GitHub Stars</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-[8px] border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Get In Touch</h3>
          <div className="space-y-3">
            <a href="mailto:alex@example.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">alex@example.com</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors">
              <Github className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">github.com/alexchen</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100 hover:bg-gray-100 transition-colors">
              <Linkedin className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">linkedin.com/in/alexchen</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};