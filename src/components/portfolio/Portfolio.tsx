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
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Function to measure and update header height
  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
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
    // Small timeout to ensure DOM has updated
    setTimeout(updateHeaderHeight, 50);
  }, [mobileMenuOpen, sectionDropdownOpen]);

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };

    if (refs[sectionId]?.current) {
      const element = refs[sectionId].current;
      const scrollTarget = element.offsetTop - headerHeight + 1; // +1 ensures it's just below header
      
      window.scrollTo({
        top: scrollTarget,
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

      // Account for header height in scroll position
      const scrollPosition = window.scrollY + headerHeight + 10;

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
      {/* Fixed Header */}
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

      {/* Main Content - No margin or padding, content starts at top */}
      <div 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          {/* Add id attributes to sections for IntersectionObserver */}
          <section id="about">
            <AboutSection
              aboutRef={aboutRef}
              visibleSections={visibleSections}
            />
          </section>

          <section id="projects">
            <ProjectsSection
              projectsRef={projectsRef}
              visibleSections={visibleSections}
            />
          </section>

          <section id="experience">
            <ExperienceSection
              experienceRef={experienceRef}
              visibleSections={visibleSections}
            />
          </section>

          <section id="education">
            <EducationSection
              educationRef={educationRef}
              visibleSections={visibleSections}
            />
          </section>

          <section id="testimonials">
            <TestimonialsSection
              testimonialsRef={testimonialsRef}
              visibleSections={visibleSections}
            />
          </section>

          <section id="skills">
            <SkillsSection
              skillsRef={skillsRef}
              visibleSections={visibleSections}
            />
          </section>
        </div>
      </div>
    </div>
  );
}