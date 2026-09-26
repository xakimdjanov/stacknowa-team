import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Building2, GraduationCap, UserCheck, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('platforma');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loginPortals = [
    {
      title: 'Universitet Admini',
      desc: 'Rektorat va Dekanat boshqaruvi',
      badge: 'Rektorat',
      url: 'https://edu-mind-university.vercel.app/login',
      icon: Building2,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      title: 'O‘qituvchi Kabineti',
      desc: 'Topshiriqlar, AI tekshiruv, Live dars',
      badge: 'O‘qituvchi',
      url: 'https://edu-mind-teacher.vercel.app/',
      icon: GraduationCap,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    {
      title: 'Talaba Portali',
      desc: 'Darslar, topshiriqlar va AI repetitor',
      badge: 'Talaba',
      url: 'https://edu-mind-student.vercel.app/',
      icon: UserCheck,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
  ];

  const navLinks = [
    { name: 'Platforma', href: '#platforma', id: 'platforma' },
    { name: 'Imkoniyatlar', href: '#imkoniyatlar', id: 'imkoniyatlar' },
    { name: 'Qanday ishlaydi', href: '#qanday-ishlaydi', id: 'qanday-ishlaydi' },
    { name: 'Universitetlar', href: '#universitetlar', id: 'universitetlar' },
    { name: 'Biznes modeli', href: '#narxlar', id: 'narxlar' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy: Determine which section is currently active in the viewport
      const scrollPosition = window.scrollY + 200;

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (e, link) => {
    setActiveSection(link.id);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(226, 232, 240, 0.6)',
      boxShadow: scrolled ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : 'none',
      padding: scrolled ? '12px 0' : '18px 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#FFFFFF',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            letterSpacing: '0.05em'
          }}>
            EM
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
              EduMind
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '800',
              color: '#059669',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              AI
            </span>
          </div>
        </a>

        {/* Desktop Links with Active State Highlighting */}
        <div style={{ display: 'none', gap: '8px', alignItems: 'center' }} className="desktop-links">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  color: isActive ? '#059669' : '#475569',
                  backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                  border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#059669';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Action Buttons: Tizimga kirish (Dropdown) + Demo olish */}
        <div style={{ display: 'none', gap: '12px', alignItems: 'center', position: 'relative' }} className="desktop-actions" ref={dropdownRef}>
          
          {/* Tizimga kirish Dropdown Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0F172A',
                backgroundColor: loginDropdownOpen ? '#F8FAFC' : '#FFFFFF',
                border: loginDropdownOpen ? '1px solid #059669' : '1px solid #CBD5E1',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!loginDropdownOpen) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }
              }}
            >
              <span>Tizimga kirish</span>
              <ChevronDown
                size={16}
                color={loginDropdownOpen ? '#059669' : '#64748B'}
                style={{
                  transition: 'transform 0.25s ease',
                  transform: loginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            {/* Premium Login Portals Popover Card */}
            {loginDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '340px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.6)',
                zIndex: 1100,
                animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div style={{ padding: '4px 10px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Foydalanuvchi portallari
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>
                    O‘z profilingizga kiring
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {loginPortals.map((portal) => {
                    const Icon = portal.icon;
                    return (
                      <a
                        key={portal.title}
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setLoginDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          textDecoration: 'none',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #F1F5F9',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = portal.border;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px -4px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#F1F5F9';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: portal.bg,
                          border: `1px solid ${portal.border}`,
                          color: portal.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={22} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                              {portal.title}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              color: portal.color,
                              backgroundColor: portal.bg,
                              border: `1px solid ${portal.border}`,
                              padding: '1px 6px',
                              borderRadius: '6px',
                              flexShrink: 0
                            }}>
                              {portal.badge}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {portal.desc}
                          </div>
                        </div>
                        <ExternalLink size={15} color="#94A3B8" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Demo Olish Button */}
          <button
            onClick={onOpenDemo}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '14px', borderRadius: '10px' }}
          >
            Demo olish <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '10px'
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)'
        }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  color: isActive ? '#059669' : '#1E293B',
                  backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: isActive ? '700' : '600',
                  textDecoration: 'none',
                }}
              >
                {link.name}
              </a>
            );
          })}

          {/* Mobile Login Portals Group */}
          <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
              Tizimga kirish
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loginPortals.map((portal) => (
                <a
                  key={portal.title}
                  href={portal.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#0F172A'
                  }}
                >
                  <span>{portal.title}</span>
                  <ExternalLink size={14} color="#64748B" />
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Demo olish <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS media queries for desktop vs mobile toggle */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-links { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
