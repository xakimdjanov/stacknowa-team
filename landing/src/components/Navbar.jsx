import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Building2, GraduationCap, UserCheck, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('platforma');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loginPortals = [
    { title: 'Universitet Admini', desc: 'Rektorat va Dekanat boshqaruvi', badge: 'Rektorat', url: 'https://edu-mind-university.vercel.app/login', icon: Building2, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { title: "O'qituvchi Kabineti", desc: 'Topshiriqlar, AI tekshiruv, Live dars', badge: "O'qituvchi", url: 'https://edu-mind-teacher.vercel.app/', icon: GraduationCap, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { title: 'Talaba Portali', desc: 'Darslar, topshiriqlar va AI repetitor', badge: 'Talaba', url: 'https://edu-mind-student.vercel.app/', icon: UserCheck, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
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
      const scrollPosition = window.scrollY + 200;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el && scrollPosition >= el.offsetTop) { setActiveSection(navLinks[i].id); break; }
      }
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLoginDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    handleScroll();
    return () => { window.removeEventListener('scroll', handleScroll); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, link) => { setActiveSection(link.id); setMobileMenuOpen(false); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(226,232,240,0.6)',
        boxShadow: scrolled ? '0 4px 20px -2px rgba(0,0,0,0.05)' : 'none',
        padding: scrolled ? '10px 0' : '14px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#10B981 0%,#059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '14px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)', flexShrink: 0 }}>EM</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>EduMind</span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1px 6px', borderRadius: '5px' }}>AI</span>
            </div>
          </a>

          {/* Desktop Links */}
          <div style={{ display: 'none', gap: '6px', alignItems: 'center' }} className="desktop-links">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link)} style={{ color: isActive ? '#059669' : '#475569', backgroundColor: isActive ? '#ECFDF5' : 'transparent', border: isActive ? '1px solid #A7F3D0' : '1px solid transparent', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: isActive ? '700' : '600', textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#059669'; e.currentTarget.style.backgroundColor = '#F8FAFC'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.backgroundColor = 'transparent'; } }}>
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div style={{ display: 'none', gap: '10px', alignItems: 'center', position: 'relative', flexShrink: 0 }} className="desktop-actions" ref={dropdownRef}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLoginDropdownOpen(!loginDropdownOpen)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', color: '#0F172A', backgroundColor: loginDropdownOpen ? '#F8FAFC' : '#FFFFFF', border: loginDropdownOpen ? '1px solid #059669' : '1px solid #CBD5E1', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#059669'; }}
                onMouseLeave={(e) => { if (!loginDropdownOpen) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#CBD5E1'; } }}>
                <span>Tizimga kirish</span>
                <ChevronDown size={15} color={loginDropdownOpen ? '#059669' : '#64748B'} style={{ transition: 'transform 0.25s', transform: loginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {loginDropdownOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '14px', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.15)', zIndex: 1100 }}>
                  <div style={{ padding: '4px 8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Foydalanuvchi portallari</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>O'z profilingizga kiring</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {loginPortals.map((portal) => {
                      const Icon = portal.icon;
                      return (
                        <a key={portal.title} href={portal.url} target="_blank" rel="noreferrer" onClick={() => setLoginDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #F1F5F9', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = portal.border; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: portal.bg, border: `1px solid ${portal.border}`, color: portal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={20} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{portal.title}</span>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: portal.color, backgroundColor: portal.bg, border: `1px solid ${portal.border}`, padding: '1px 6px', borderRadius: '5px', flexShrink: 0 }}>{portal.badge}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{portal.desc}</div>
                          </div>
                          <ExternalLink size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px', borderRadius: '10px' }}>
              Demo olish <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-toggle"
            style={{ display: 'block', background: mobileMenuOpen ? '#ECFDF5' : '#F1F5F9', border: mobileMenuOpen ? '1px solid #A7F3D0' : '1px solid #E2E8F0', color: mobileMenuOpen ? '#059669' : '#0F172A', cursor: 'pointer', padding: '7px', borderRadius: '9px', flexShrink: 0, transition: 'all 0.2s' }}
            aria-label="Menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ==================== FULL SCREEN MOBILE MENU ==================== */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        backgroundColor: '#FFFFFF',
        display: 'flex', flexDirection: 'column',
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto',
      }}>
        {/* Menu Header — spacer under fixed navbar */}
        <div style={{ height: '64px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '20px' }}>Menyu</span>
        </div>

        {/* Nav Links */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Sahifalar</div>
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  color: isActive ? '#059669' : '#1E293B',
                  backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                  border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                  padding: '13px 16px', borderRadius: '14px',
                  fontSize: '16px', fontWeight: isActive ? '700' : '600',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                <span>{link.name}</span>
                {isActive && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} />}
              </a>
            );
          })}

          {/* Login Portals */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Tizimga kirish</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loginPortals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <a key={portal.title} href={portal.url} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', backgroundColor: portal.bg, border: `1px solid ${portal.border}`, textDecoration: 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', backgroundColor: '#fff', border: `1px solid ${portal.border}`, color: portal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}><Icon size={20} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{portal.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>{portal.desc}</div>
                    </div>
                    <ExternalLink size={15} color={portal.color} style={{ flexShrink: 0 }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ marginTop: '20px', paddingBottom: '10px' }}>
            <button onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '15px', borderRadius: '14px' }}>
              Demo olish <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-links { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}
