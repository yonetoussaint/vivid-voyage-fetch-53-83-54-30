import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement>;
  visibleSections: Set<string>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutRef, visibleSections }) => {
  return (
    <section ref={aboutRef} id="about" className="scroll-mt-20">
      <div className="space-y-6">
        {/* Profile Image Section */}
        <AnimatedSection id="about" delay={0} visibleSections={visibleSections}>
          <div className="relative">
            {/* Profile Image Container */}
            <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-[36px_36px_12px_12px] shadow-md">
              {/* Curvy top border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
              
              {/* Profile Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {/* Placeholder for profile image - Replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">AC</span>
                  </div>
                  {/* Alternative: If you want to use an actual image, replace the above div with:
                      <img 
                        src="/path-to-your-image.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                  */}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20"></div>
              <div className="absolute top-8 right-8 w-6 h-6 rounded-full bg-white/20"></div>
              <div className="absolute bottom-8 left-10 w-10 h-10 rounded-full bg-white/10"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/15"></div>
            </div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">Available for opportunities</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="about" delay={100} visibleSections={visibleSections}>
          <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
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
        </AnimatedSection>

        <AnimatedSection id="about" delay={200} visibleSections={visibleSections}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">2.4k</div>
                <div className="text-sm text-gray-600">GitHub Stars</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="about" delay={300} visibleSections={visibleSections}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <a href="mailto:alex@example.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">alex@example.com</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Github className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">github.com/alexchen</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">linkedin.com/in/alexchen</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};