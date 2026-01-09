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
  const [headerHeight, setHeaderHeight] = useState(0); // Track header height

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
    }
  };

  // Update header height on mount and on window resize
  useEffect(() => {
    updateHeaderHeight();
    
    const handleResize = () => {
      updateHeaderHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update header height when mobile menu opens/closes
  useEffect(() => {
    updateHeaderHeight();
  }, [mobileMenuOpen]);

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
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
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

      const scrollPosition = window.scrollY + headerHeight;

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
  }, [headerHeight]); // Re-run when header height changes

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
        rootMargin: `-${headerHeight}px 0px 0px 0px` // Adjust root margin based on header height
      }
    );

    const sections = [aboutRef, projectsRef, experienceRef, educationRef, testimonialsRef, skillsRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [headerHeight]); // Re-run when header height changes

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div ref={headerRef}>
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

      <main 
        className="flex-1 overflow-y-auto pb-8"
        style={{ paddingTop: `${headerHeight}px` }} // Add dynamic padding based on header height
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