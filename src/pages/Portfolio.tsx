import React, { useState, useEffect, useRef } from 'react';

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
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

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        // Store in localStorage for persistence
        localStorage.setItem('portfolioProfileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('portfolioProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const projects = [
    {
      title: 'Mima',
      description: 'A comprehensive online marketplace platform connecting buyers and sellers with seamless transaction capabilities.',
      tags: ['React', 'TypeScript', 'MongoDB'],
      link: 'https://mimaht.com'
    },
    {
      title: 'TransfèPam',
      description: 'Modern money transfer web application enabling fast and secure financial transactions with an intuitive interface.',
      tags: ['React', 'Node.js', 'Supabase']
    },
    {
      title: 'Auth SDK',
      description: 'Authentication SDK designed to simplify secure user authentication implementation for developers.',
      tags: ['TypeScript', 'SDK', 'Open Source'],
      link: '#'
    },
    {
      title: 'Easy+ Gaz',
      description: 'Project management application built for operational efficiency, streamlining workflow and team collaboration.',
      tags: ['React', 'JavaScript', 'MongoDB'],
      link: 'https://mimaht.com/easy'
    },
    {
      title: 'Open Source Contributions',
      description: 'Active contributor to major open-source projects including PayPal SDK and Moncash SDK JS, improving payment integrations.',
      tags: ['JavaScript', 'SDK Development', 'Community']
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
        .profile-hover:hover .profile-overlay {
          opacity: 1;
        }
      `}</style>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfileImageUpload}
        accept="image/*"
        className="hidden"
      />

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
            {/* Profile Picture */}
            <div 
              className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#00ff88] cursor-pointer profile-hover px-2 py-2"
              onClick={triggerFileInput}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-4xl">
                  YT
                </div>
              )}
              <div className="profile-overlay absolute inset-0 bg-[#00ff88]/20 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold px-2 py-2">Click to Upload</span>
              </div>
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
              className="project-card bg-[#1a1a1a] p-10 border border-[#2a2a2a] hover:border-[#00ff88] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00ff88] scale-x-0 hover:scale-x-100 transition-transform duration-300" />
              <h3 className="text-[1.8rem] mb-4 font-bold px-2 py-2">{project.title}</h3>
              <p className="text-[#999] mb-6 leading-relaxed px-2 py-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-4 px-2 py-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#2a2a2a] text-sm border border-[#2a2a2a]">
                    {tag}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ff88] font-semibold inline-flex items-center gap-2 mt-4 px-2 py-2"
                >
                  {project.link.includes('http') ? 'Visit Site' : 'View on GitHub'} →
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
              className="p-6 bg-[#1a1a1a] text-center border border-[#2a2a2a] hover:border-[#00ff88] hover:bg-[#2a2a2a] transition-all duration-300"
            >
              <h4 className="text-lg font-semibold px-2 py-2">{skill}</h4>
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