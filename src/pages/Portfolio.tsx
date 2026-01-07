import React, { useState, useEffect, useRef } from 'react';

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      setCursorPos(prev => ({
        x: prev.x + (cursorRef.current.x - prev.x) * 0.1,
        y: prev.y + (cursorRef.current.y - prev.y) * 0.1
      }));
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  const projects = [
    {
      title: 'Mima',
      description: 'A comprehensive online marketplace platform connecting buyers and sellers with seamless transaction capabilities.',
      tags: ['React', 'TypeScript', 'MongoDB'],
      link: 'https://mimaht.com',
      logo: '🛒'
    },
    {
      title: 'TransfèPam',
      description: 'Modern money transfer web application enabling fast and secure financial transactions with an intuitive interface.',
      tags: ['React', 'Node.js', 'Supabase'],
      logo: '💸'
    },
    {
      title: 'Auth SDK',
      description: 'Authentication SDK designed to simplify secure user authentication implementation for developers.',
      tags: ['TypeScript', 'SDK', 'Open Source'],
      link: '#',
      logo: '🔐'
    },
    {
      title: 'Easy+ Gaz',
      description: 'Project management application built for operational efficiency, streamlining workflow and team collaboration.',
      tags: ['React', 'JavaScript', 'MongoDB'],
      link: 'https://mimaht.com/easy',
      logo: '⚡'
    },
    {
      title: 'Open Source',
      description: 'Contributor to major open-source projects including PayPal SDK and Moncash SDK JS.',
      tags: ['JavaScript', 'SDK', 'Community'],
      logo: '🌍'
    }
  ];

  const skills = [
    'JavaScript', 'TypeScript', 'React.js', 'React Native',
    'HTML5', 'CSS3', 'Node.js', 'Supabase',
    'MongoDB', 'SDK', 'Full Stack', 'Open Source'
  ];

  const contactLinks = [
    { 
      name: 'Email', 
      href: 'mailto:yone95572@gmail.com',
      icon: '✉️',
      copyText: 'yone95572@gmail.com'
    },
    { 
      name: 'WhatsApp', 
      href: 'https://wa.me/47279318',
      icon: '💬',
      copyText: '+47279318'
    },
    { 
      name: 'GitHub', 
      href: '#',
      icon: '🐙'
    },
    { 
      name: 'LinkedIn', 
      href: '#',
      icon: '👔'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Simple toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#00ff88] text-black px-4 py-2 rounded-lg font-medium z-[9999] animate-fade-in-out';
      toast.textContent = 'Copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  };

  const profileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <style>{`
        @keyframes scroll {
          0%, 100% { transform: translate(-50%, 0); opacity: 1; }
          50% { transform: translate(-50%, 10px); opacity: 0.3; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
        }
        .scroll-dot {
          animation: scroll 2s infinite;
        }
        .animate-fade-in-out {
          animation: fadeInOut 2s ease-in-out;
        }
        .project-card {
          transition: all 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-4px);
        }
        .skill-item {
          transition: all 0.2s ease;
        }
        @media (max-width: 640px) {
          .hide-cursor-mobile {
            display: none;
          }
        }
      `}</style>

      {/* Cursor Follower - Hidden on mobile */}
      <div
        className="fixed w-5 h-5 border-2 border-[#00ff88] rounded-full pointer-events-none z-[9999] transition-transform duration-150 hide-cursor-mobile"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          opacity: cursorVisible ? 1 : 0
        }}
      />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-lg z-[2000] flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex flex-col items-center gap-8 text-center px-4">
            <button onClick={() => scrollToSection('work')} className="text-3xl font-medium hover:text-[#00ff88] transition-colors duration-300 px-4 py-3">
              Work
            </button>
            <button onClick={() => scrollToSection('skills')} className="text-3xl font-medium hover:text-[#00ff88] transition-colors duration-300 px-4 py-3">
              Skills
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-3xl font-medium hover:text-[#00ff88] transition-colors duration-300 px-4 py-3">
              Contact
            </button>
            <div className="mt-12 pt-8 border-t border-[#333] w-48">
              <p className="text-lg text-[#999]">yone95572@gmail.com</p>
              <p className="text-lg text-[#999] mt-2">+47279318</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-4 py-4 flex justify-between items-center z-[1000] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="text-xl font-bold tracking-tight px-2 py-1">YT</div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 list-none">
          <li>
            <button onClick={() => scrollToSection('work')} className="text-sm font-medium hover:text-[#00ff88] transition-colors duration-300 px-2 py-1">
              Work
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('skills')} className="text-sm font-medium hover:text-[#00ff88] transition-colors duration-300 px-2 py-1">
              Skills
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-[#00ff88] transition-colors duration-300 px-2 py-1">
              Contact
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 px-2 py-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 relative">
        <div className="w-full max-w-5xl px-2 py-2">
          <div className="flex flex-col items-center text-center">
            {/* Profile Picture */}
            <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-[#00ff88] mb-6 md:mb-8">
              <img 
                src={profileImage} 
                alt="Yoné Toussaint" 
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-tight mb-4 tracking-tight">
              Yoné<br />
              <span className="text-[#00ff88]">Toussaint</span>
            </h1>
            
            <p className="text-[clamp(1.1rem,3vw,1.3rem)] text-[#aaa] mb-8 max-w-xl px-2 py-1 leading-relaxed">
              Full Stack Developer crafting scalable web applications and contributing to open-source innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 px-2 py-2">
              <button
                onClick={() => scrollToSection('work')}
                className="px-8 py-3.5 bg-[#00ff88] text-[#0a0a0a] font-semibold rounded-lg border-2 border-[#00ff88] hover:bg-transparent hover:text-[#00ff88] transition-all duration-300 active:scale-95 text-base"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg border-2 border-[#333] hover:border-[#00ff88] hover:text-[#00ff88] transition-all duration-300 active:scale-95 text-base"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 border-2 border-[#00ff88]/60 rounded-xl opacity-70">
            <div className="scroll-dot absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#00ff88] rounded-sm" />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2">
          Selected <span className="text-[#00ff88]">Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card bg-[#111] p-6 rounded-xl border border-[#222] hover:border-[#00ff88] active:scale-[0.99] transition-all duration-300"
            >
              {/* Project Logo & Title */}
              <div className="flex items-center gap-4 mb-5">
                <div className="text-3xl bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
                  {project.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-[#2a2a2a] text-xs border border-[#333] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[#aaa] text-sm mb-5 leading-relaxed px-1 py-1 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#1a1a1a] text-xs border border-[#2a2a2a] rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              {project.link && project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#00ff88] hover:text-black text-[#00ff88] font-medium rounded-lg border border-[#2a2a2a] hover:border-[#00ff88] transition-all duration-300 active:scale-[0.98] text-sm"
                >
                  <span>Visit Site</span>
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2">
          Tech <span className="text-[#00ff88]">Stack</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-2 py-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="skill-item p-4 bg-[#111] text-center rounded-xl border border-[#222] hover:border-[#00ff88] hover:bg-[#1a1a1a] active:scale-95 transition-all duration-200"
            >
              <h4 className="text-sm font-medium px-1 py-1">{skill}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 max-w-2xl mx-auto">
        <div className="text-center px-2 py-2">
          <h2 className="text-[clamp(2rem,5vw,3rem)] mb-6 font-extrabold tracking-tight">
            Let's <span className="text-[#00ff88]">Connect</span>
          </h2>
          <p className="text-[#aaa] mb-10 text-lg px-2 py-1">
            Open to collaboration, opportunities, and interesting projects.
          </p>
          
          {/* Contact Cards */}
          <div className="space-y-4 mb-12">
            <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span className="text-sm">Email</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#aaa] truncate max-w-[160px] sm:max-w-none">yone95572@gmail.com</span>
                  <button 
                    onClick={() => copyToClipboard('yone95572@gmail.com')}
                    className="text-[#00ff88] hover:text-white active:scale-95 transition-all duration-200 p-2"
                    title="Copy email"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <span className="text-sm">WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#aaa]">+47279318</span>
                  <button 
                    onClick={() => copyToClipboard('+47279318')}
                    className="text-[#00ff88] hover:text-white active:scale-95 transition-all duration-200 p-2"
                    title="Copy WhatsApp"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 py-2">
            {contactLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-[#111] rounded-xl border border-[#222] hover:border-[#00ff88] hover:bg-[#1a1a1a] active:scale-95 transition-all duration-300"
              >
                <span className="text-2xl mb-2">{link.icon}</span>
                <span className="text-sm font-medium">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-[#222] text-[#666]">
        <p className="text-sm px-2 py-1">© 2026 Yoné Toussaint</p>
        <p className="text-xs mt-2 px-2 py-1 opacity-70">Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
}