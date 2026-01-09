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
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Measure header height using ResizeObserver
  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        // Update CSS custom property
        document.documentElement.style.setProperty('--header-height', `${height}px`);
        document.documentElement.classList.add('has-fixed-header');
      }
    };

    // Initial measurement
    const timer = setTimeout(() => {
      updateHeight();
      setIsReady(true);
    }, 100);

    // Use ResizeObserver to track header height changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setHeaderHeight(height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    });

    resizeObserver.observe(headerRef.current);

    // Also listen to window resize
    const handleResize = () => {
      updateHeight();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      document.documentElement.classList.remove('has-fixed-header');
    };
  }, []);

  // Update height when menu states change
  useEffect(() => {
    if (!isReady) return;

    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [mobileMenuOpen, sectionDropdownOpen, isReady]);

  const scrollToSection = useCallback((sectionId: string) => {
    if (!isReady) return;

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

    // Calculate position with header offset
    const elementTop = element.offsetTop;
    const scrollTarget = elementTop - headerHeight;

    // Smooth scroll
    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });

    setActiveTab(sectionId);
    setSectionDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [headerHeight, isReady]);

  // Handle scroll for active tab detection
  useEffect(() => {
    if (!isReady || headerHeight === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + headerHeight;
      
      const sections = [
        { id: 'about', element: aboutRef.current },
        { id: 'projects', element: projectsRef.current },
        { id: 'experience', element: experienceRef.current },
        { id: 'education', element: educationRef.current },
        { id: 'testimonials', element: testimonialsRef.current },
        { id: 'skills', element: skillsRef.current }
      ];

      // Find active section
      let currentActive = activeTab;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          currentActive = section.id;
          break;
        }
      }

      if (currentActive !== activeTab) {
        setActiveTab(currentActive);
      }
    };

    // Throttle scroll event
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [headerHeight, isReady, activeTab]);

  // Intersection Observer for animations
  useEffect(() => {
    if (!isReady || headerHeight === 0) return;

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

  // Add scroll-margin CSS dynamically
  useEffect(() => {
    if (!isReady || headerHeight === 0) return;

    const styleId = 'portfolio-scroll-margin';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    // Add scroll margin to all sections
    style.textContent = `
      [data-portfolio-section] {
        scroll-margin-top: ${headerHeight + 20}px;
      }
      .portfolio-section {
        scroll-margin-top: ${headerHeight + 20}px;
      }
    `;

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [headerHeight, isReady]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Fixed Header */}
      <div 
        ref={headerRef}
        className="fixed-header fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
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
      <main 
        className="flex-1 w-full main-content"
        style={{ 
          marginTop: `${headerHeight}px`,
          minHeight: `calc(100vh - ${headerHeight}px)`,
          '--header-height': `${headerHeight}px`
        } as React.CSSProperties}
      >
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          {/* About Section */}
          <section 
            id="about"
            ref={aboutRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <AboutSection visibleSections={visibleSections} />
          </section>

          {/* Projects Section */}
          <section 
            id="projects"
            ref={projectsRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <ProjectsSection visibleSections={visibleSections} />
          </section>

          {/* Experience Section */}
          <section 
            id="experience"
            ref={experienceRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <ExperienceSection visibleSections={visibleSections} />
          </section>

          {/* Education Section */}
          <section 
            id="education"
            ref={educationRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <EducationSection visibleSections={visibleSections} />
          </section>

          {/* Testimonials Section */}
          <section 
            id="testimonials"
            ref={testimonialsRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <TestimonialsSection visibleSections={visibleSections} />
          </section>

          {/* Skills Section */}
          <section 
            id="skills"
            ref={skillsRef}
            data-portfolio-section
            className="portfolio-section scroll-mt-header"
          >
            <SkillsSection visibleSections={visibleSections} />
          </section>
        </div>
      </main>

      {/* Debug overlay (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-70 z-50">
            Header: {headerHeight}px | Active: {activeTab}
          </div>
          <div 
            className="fixed top-0 left-0 right-0 h-1 bg-red-500 z-50"
            style={{ top: `${headerHeight}px` }}
          />
        </>
      )}
    </div>
  );
}