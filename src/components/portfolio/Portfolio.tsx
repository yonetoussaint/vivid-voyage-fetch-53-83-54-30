import React, { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { SidePanel } from './SidePanel';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { TestimonialsSection } from './TestimonialsSection';
import { SkillsSection } from './SkillsSection';
import { tabs } from './data';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('about');
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const testimonialsRef = useRef(null);

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLElement>> = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };

    refs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(sectionId);
    setSectionDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'projects', ref: projectsRef },
        { id: 'experience', ref: experienceRef },
        { id: 'education', ref: educationRef },
        { id: 'testimonials', ref: testimonialsRef },
        { id: 'skills', ref: skillsRef }
      ];

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [aboutRef, projectsRef, experienceRef, educationRef, testimonialsRef, skillsRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        activeTab={activeTab}
        mobileMenuOpen={mobileMenuOpen}
        sectionDropdownOpen={sectionDropdownOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setSectionDropdownOpen={setSectionDropdownOpen}
        toggleSidePanel={toggleSidePanel}
        scrollToSection={scrollToSection}
      />

      <SidePanel
        sidePanelOpen={sidePanelOpen}
        toggleSidePanel={toggleSidePanel}
      />

      <main className="flex-1 overflow-y-auto pb-8 pt-24">
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          <AboutSection
            aboutRef={aboutRef}
            visibleSections={visibleSections}
          />

          <ProjectsSection
            projectsRef={projectsRef}
            visibleSections={visibleSections}
          />

          <ExperienceSection
            experienceRef={experienceRef}
            visibleSections={visibleSections}
          />

          <EducationSection
            educationRef={educationRef}
            visibleSections={visibleSections}
          />

          <TestimonialsSection
            testimonialsRef={testimonialsRef}
            visibleSections={visibleSections}
          />

          <SkillsSection
            skillsRef={skillsRef}
            visibleSections={visibleSections}
          />
        </div>
      </main>
    </div>
  );
}