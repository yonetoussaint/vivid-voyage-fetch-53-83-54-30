// Alternative: Simplified version with CSS-only solution
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './Header';
import { SidePanel } from './SidePanel';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { TestimonialsSection } from './TestimonialsSection';
import { SkillsSection } from './SkillsSection';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('about');
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(96); // Default estimate

  const headerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Simple header height measurement
  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        // Set CSS variable
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    measureHeader();
    window.addEventListener('resize', measureHeader);
    
    return () => window.removeEventListener('resize', measureHeader);
  }, []);

  // Update height when menus change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mobileMenuOpen, sectionDropdownOpen]);

  const scrollToSection = useCallback((sectionId: string) => {
    const refs = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };

    const element = refs[sectionId as keyof typeof refs]?.current;
    if (!element) return;

    // Use browser's native scrollIntoView with scroll-margin-top from CSS
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });

    setActiveTab(sectionId);
    setSectionDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

  // Simple scroll detection
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

      const scrollPosition = window.scrollY + headerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  // Intersection Observer
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

    const elements = [aboutRef, projectsRef, experienceRef, educationRef, testimonialsRef, skillsRef];
    elements.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    setMobileMenuOpen(false);
    setSectionDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
      >
        <Header
          activeTab={activeTab}
          mobileMenuOpen={mobileMenuOpen}
          sectionDropdownOpen={sectionDropdownOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setSectionDropdownOpen={setSectionDropdownOpen}
          toggleSidePanel={toggleSidePanel}
          scrollToSection={scrollToSection}
        />
      </div>

      <SidePanel
        sidePanelOpen={sidePanelOpen}
        toggleSidePanel={toggleSidePanel}
      />

      {/* Main Content - margin-top equals header height */}
      <main 
        className="flex-1 w-full"
        style={{ marginTop: `${headerHeight}px` }}
      >
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          <section 
            id="about"
            ref={aboutRef}
            className="scroll-mt-header"
          >
            <AboutSection visibleSections={visibleSections} />
          </section>

          <section 
            id="projects"
            ref={projectsRef}
            className="scroll-mt-header"
          >
            <ProjectsSection visibleSections={visibleSections} />
          </section>

          <section 
            id="experience"
            ref={experienceRef}
            className="scroll-mt-header"
          >
            <ExperienceSection visibleSections={visibleSections} />
          </section>

          <section 
            id="education"
            ref={educationRef}
            className="scroll-mt-header"
          >
            <EducationSection visibleSections={visibleSections} />
          </section>

          <section 
            id="testimonials"
            ref={testimonialsRef}
            className="scroll-mt-header"
          >
            <TestimonialsSection visibleSections={visibleSections} />
          </section>

          <section 
            id="skills"
            ref={skillsRef}
            className="scroll-mt-header"
          >
            <SkillsSection visibleSections={visibleSections} />
          </section>
        </div>
      </main>
    </div>
  );
}