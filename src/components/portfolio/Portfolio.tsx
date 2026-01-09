import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isReady, setIsReady] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Measure header height
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Initial measurement after a delay
    const initTimer = setTimeout(() => {
      updateHeight();
      setIsReady(true);
    }, 100);

    // Update on resize
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Update height when menu states change
  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [mobileMenuOpen, sectionDropdownOpen, isReady]);

  const scrollToSection = useCallback((sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };

    const element = refs[sectionId]?.current;
    if (!element) return;

    // Get the element's position relative to the document
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    
    // Calculate the target scroll position (element top minus header height)
    const scrollTarget = elementTop - headerHeight;
    
    // Scroll to the calculated position
    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });

    setActiveTab(sectionId);
    setSectionDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [headerHeight]);

  // Handle scroll for active tab detection
  useEffect(() => {
    if (!isReady) return;

    const handleScroll = () => {
      // Calculate scroll position accounting for header
      const scrollPosition = window.scrollY + headerHeight + 10;
      
      const sections = [
        { id: 'about', element: aboutRef.current },
        { id: 'projects', element: projectsRef.current },
        { id: 'experience', element: experienceRef.current },
        { id: 'education', element: educationRef.current },
        { id: 'testimonials', element: testimonialsRef.current },
        { id: 'skills', element: skillsRef.current }
      ];

      // Find the current active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const elementTop = section.element.getBoundingClientRect().top + window.pageYOffset;
          
          if (elementTop <= scrollPosition) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight, isReady]);

  // Intersection Observer for animations
  useEffect(() => {
    if (!isReady) return;

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

    const sections = [
      { ref: aboutRef, id: 'about' },
      { ref: projectsRef, id: 'projects' },
      { ref: experienceRef, id: 'experience' },
      { ref: educationRef, id: 'education' },
      { ref: testimonialsRef, id: 'testimonials' },
      { ref: skillsRef, id: 'skills' }
    ];

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        // Ensure each section has an ID
        if (!ref.current.id) {
          ref.current.id = id;
        }
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [headerHeight, isReady]);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    setMobileMenuOpen(false);
    setSectionDropdownOpen(false);
  };

  // Add CSS for scroll-margin-top to prevent content hiding
  useEffect(() => {
    if (!isReady) return;

    const style = document.createElement('style');
    style.textContent = `
      .section-scroll-margin {
        scroll-margin-top: ${headerHeight + 10}px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [headerHeight, isReady]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Fixed Header - outside of main content flow */}
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

      {/* Main Content - starts below header */}
      <div 
        ref={mainContainerRef}
        className="flex-1 w-full"
        style={{ 
          marginTop: `${headerHeight}px`,
          minHeight: `calc(100vh - ${headerHeight}px)`
        }}
      >
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          {/* Add scroll-margin class and ensure sections have IDs */}
          <div 
            id="about"
            ref={aboutRef}
            className="section-scroll-margin"
          >
            <AboutSection visibleSections={visibleSections} />
          </div>

          <div 
            id="projects"
            ref={projectsRef}
            className="section-scroll-margin"
          >
            <ProjectsSection visibleSections={visibleSections} />
          </div>

          <div 
            id="experience"
            ref={experienceRef}
            className="section-scroll-margin"
          >
            <ExperienceSection visibleSections={visibleSections} />
          </div>

          <div 
            id="education"
            ref={educationRef}
            className="section-scroll-margin"
          >
            <EducationSection visibleSections={visibleSections} />
          </div>

          <div 
            id="testimonials"
            ref={testimonialsRef}
            className="section-scroll-margin"
          >
            <TestimonialsSection visibleSections={visibleSections} />
          </div>

          <div 
            id="skills"
            ref={skillsRef}
            className="section-scroll-margin"
          >
            <SkillsSection visibleSections={visibleSections} />
          </div>
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 z-50">
          Header Height: {headerHeight}px
        </div>
      )}
    </div>
  );
}