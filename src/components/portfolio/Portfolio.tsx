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
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Function to measure and update header height
  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
      // Also set as CSS variable for potential CSS usage
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  };

  // Update header height on mount and when menu states change
  useEffect(() => {
    updateHeaderHeight();
    
    const handleResize = () => {
      updateHeaderHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update header height when mobile menu or dropdown states change
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      updateHeaderHeight();
    });
  }, [mobileMenuOpen, sectionDropdownOpen]);

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLElement>> = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };

    if (refs[sectionId]?.current) {
      const element = refs[sectionId].current;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
        behavior: 'smooth'
      });
    }

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

      const scrollPosition = window.scrollY + headerHeight + 20; // Add small buffer

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
  }, [headerHeight]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: `-${headerHeight}px 0px 0px 0px`
      }
    );

    const sections = [aboutRef, projectsRef, experienceRef, educationRef, testimonialsRef, skillsRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [headerHeight]);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    setMobileMenuOpen(false);
    setSectionDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
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

      {/* Main content starts below the header */}
      <main 
        className="flex-1 overflow-y-auto pb-8"
        style={{ marginTop: `${headerHeight}px` }}
      >
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