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
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Portrait" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-3">Bonjour 👋</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Je suis ingénieur logiciel, spécialisé dans la création d'expériences numériques de qualité. 
            Actuellement, je me concentre sur le développement de produits accessibles et centrés sur l'utilisateur.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Avec plus de 5 ans d'expérience, j'ai travaillé sur divers projets, des plateformes e-commerce 
            aux outils de collaboration en temps réel. Je m'efforce toujours d'écrire un code propre et maintenable 
            qui résout de vrais problèmes.
          </p>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">En quelques chiffres</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-[8px] border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
              <div className="text-sm text-gray-600">Années d'expérience</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-[8px] border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Projets réalisés</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-[8px] border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.4k</div>
              <div className="text-sm text-gray-600">Étoiles GitHub</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-[8px] border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Me contacter</h3>
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