import React, { useState, useEffect, useRef } from 'react';

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
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
  };

  const projects = [
    {
      title: 'Mima',
      description: 'A comprehensive online marketplace platform connecting buyers and sellers with seamless transaction capabilities.',
      tags: ['React', 'TypeScript', 'MongoDB'],
      link: 'https://mimaht.com',
      logo: '🛒' // Marketplace icon
    },
    {
      title: 'TransfèPam',
      description: 'Modern money transfer web application enabling fast and secure financial transactions with an intuitive interface.',
      tags: ['React', 'Node.js', 'Supabase'],
      logo: '💸' // Money transfer icon
    },
    {
      title: 'Auth SDK',
      description: 'Authentication SDK designed to simplify secure user authentication implementation for developers.',
      tags: ['TypeScript', 'SDK', 'Open Source'],
      link: '#',
      logo: '🔐' // Security/authentication icon
    },
    {
      title: 'Easy+ Gaz',
      description: 'Project management application built for operational efficiency, streamlining workflow and team collaboration.',
      tags: ['React', 'JavaScript', 'MongoDB'],
      link: 'https://mimaht.com/easy',
      logo: '⚡' // Fast/efficient icon
    },
    {
      title: 'Open Source Contributions',
      description: 'Active contributor to major open-source projects including PayPal SDK and Moncash SDK JS, improving payment integrations.',
      tags: ['JavaScript', 'SDK Development', 'Community'],
      logo: '🌍' // Global/open source icon
    }
  ];

  const skills = [
    'JavaScript', 'TypeScript', 'React.js', 'React Native',
    'HTML5', 'CSS3', 'Node.js', 'Supabase',
    'MongoDB', 'SDK Development', 'Full Stack', 'Open Source'
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
    },
    { 
      name: 'Facebook', 
      href: '#',
      icon: '👤'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  // PROFILE IMAGE - Replace this URL with your actual image
  const profileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"; // Replace with your image URL

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        @keyframes scroll {
          0%, 100% { transform: translate(-50%, 0); opacity: 1; }
          50% { transform: translate(-50%, 10px); opacity: 0.3; }
        }
        .scroll-dot {
          animation: scroll 2s infinite;
        }
        .project-card {
          transition: all 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-5px);
        }
        .project-logo {
          transition: all 0.3s ease;
        }
        .project-card:hover .project-logo {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>

      {/* Cursor Follower */}
      <div
        className="fixed w-5 h-5 border-2 border-[#00ff88] rounded-full pointer-events-none z-[9999] transition-transform duration-150"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          opacity: cursorVisible ? 1 : 0
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-2 py-2 flex justify-between items-center z-[1000] bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]">
        <div className="text-2xl font-bold tracking-tight px-2 py-2">YT</div>
        <ul className="flex gap-8 list-none">
          <li>
            <button onClick={() => scrollToSection('work')} className="text-white hover:text-[#00ff88] transition-colors duration-300 px-2 py-2">
              Work
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('skills')} className="text-white hover:text-[#00ff88] transition-colors duration-300 px-2 py-2">
              Skills
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} className="text-white hover:text-[#00ff88] transition-colors duration-300 px-2 py-2">
              Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-2 py-2 relative">
        <div className="max-w-[900px] px-2 py-2">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Profile Picture - Replace the image URL above */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#00ff88] px-2 py-2">
              <img 
                src={profileImage} 
                alt="Yoné Toussaint" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-2 py-2">
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-extrabold leading-none mb-4 tracking-[-3px]">
                Yoné<br />
                <span className="text-[#00ff88]">Toussaint</span>
              </h1>
              <p className="text-[clamp(1.2rem,2vw,1.5rem)] text-[#999] mb-8 max-w-[600px] px-2 py-2">
                Full Stack Developer crafting scalable web applications and contributing to open-source innovation.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => scrollToSection('work')}
            className="inline-block px-10 py-4 bg-[#00ff88] text-[#0a0a0a] font-semibold border-2 border-[#00ff88] hover:bg-transparent hover:text-[#00ff88] transition-all duration-300 hover:-translate-y-0.5 mx-2 my-2"
          >
            View My Work
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[30px] h-[50px] border-2 border-[#00ff88] rounded-[20px] opacity-60">
          <div className="scroll-dot absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#00ff88] rounded-sm" />
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-32 px-2 max-w-[1400px] mx-auto">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] mb-16 font-extrabold tracking-[-2px] px-2 py-2">
          Selected <span className="text-[#00ff88]">Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 px-2 py-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card bg-[#1a1a1a] p-8 border border-[#2a2a2a] hover:border-[#00ff88] relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00ff88] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              {/* Project Logo */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="project-logo text-4xl md:text-5xl bg-[#2a2a2a] p-4 rounded-lg border border-[#3a3a3a] group-hover:border-[#00ff88] transition-all duration-300">
                    {project.logo}
                  </div>
                  <div>
                    <h3 className="text-[1.8rem] font-bold px-2 py-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-[#2a2a2a] text-xs border border-[#2a2a2a] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[#999] mb-6 leading-relaxed px-2 py-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4 px-2 py-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#2a2a2a] text-sm border border-[#2a2a2a] rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#2a2a2a] hover:bg-[#00ff88] hover:text-black text-[#00ff88] font-semibold border border-[#2a2a2a] hover:border-[#00ff88] transition-all duration-300"
                >
                  <span>{project.link.includes('http') ? 'Visit Site' : 'View on GitHub'}</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-2 max-w-[1400px] mx-auto">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] mb-16 font-extrabold tracking-[-2px] px-2 py-2">
          Tech <span className="text-[#00ff88]">Stack</span>
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 px-2 py-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="p-6 bg-[#1a1a1a] text-center border border-[#2a2a2a] hover:border-[#00ff88] hover:bg-[#2a2a2a] transition-all duration-300 group"
            >
              <h4 className="text-lg font-semibold px-2 py-2 group-hover:text-[#00ff88] transition-colors duration-300">{skill}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="text-center py-32 px-2">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] mb-8 font-extrabold tracking-[-2px] px-2 py-2">
          Let's <span className="text-[#00ff88]">Connect</span>
        </h2>
        <p className="text-[#999] mb-12 px-2 py-2">Open to collaboration, opportunities, and interesting projects.</p>
        
        {/* Contact Information Cards */}
        <div className="max-w-2xl mx-auto mb-12 px-2 py-2">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg mb-4">
            <h3 className="text-xl font-semibold mb-4 text-[#00ff88] px-2 py-2">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-[#999]">Email:</span>
                <div className="flex items-center gap-2">
                  <span>yone95572@gmail.com</span>
                  <button 
                    onClick={() => copyToClipboard('yone95572@gmail.com')}
                    className="text-[#00ff88] hover:text-white transition-colors px-2 py-2"
                    title="Copy email"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-[#999]">WhatsApp:</span>
                <div className="flex items-center gap-2">
                  <span>+47279318</span>
                  <button 
                    onClick={() => copyToClipboard('+47279318')}
                    className="text-[#00ff88] hover:text-white transition-colors px-2 py-2"
                    title="Copy WhatsApp number"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex justify-center gap-4 flex-wrap mt-12 px-2 py-2">
          {contactLinks.map((link, index) => (
            <div key={index} className="relative group">
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="inline-flex flex-col items-center px-6 py-4 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#00ff88] hover:bg-[#2a2a2a] transition-all duration-300 hover:-translate-y-1 font-semibold min-w-[120px]"
              >
                <span className="text-2xl mb-2">{link.icon}</span>
                <span>{link.name}</span>
              </a>
              {link.copyText && (
                <button
                  onClick={() => copyToClipboard(link.copyText)}
                  className="absolute -top-2 -right-2 bg-[#00ff88] text-black rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Copy"
                >
                  📋
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 px-2 border-t border-[#2a2a2a] text-[#666]">
        <p className="px-2 py-2">© 2026 Yoné Toussaint. Built with passion and precision.</p>
        <p className="text-sm mt-2 px-2 py-2">Email: yone95572@gmail.com | WhatsApp: +47279318</p>
      </footer>
    </div>
  );
}