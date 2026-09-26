import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platforma', href: '#platforma' },
    { name: 'Imkoniyatlar', href: '#imkoniyatlar' },
    { name: 'Qanday ishlaydi', href: '#qanday-ishlaydi' },
    { name: 'Universitetlar', href: '#universitetlar' },
    { name: 'Narxlar', href: '#narxlar' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(11, 18, 32, 0.9)' : 'rgba(11, 18, 32, 0.5)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
      padding: scrolled ? '14px 0' : '20px 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#0B1220',
            fontSize: '18px',
            boxShadow: '0 0 15px rgba(52, 211, 153, 0.4)'
          }}>
            SE
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Smart <span style={{ color: '#34D399' }}>Edu</span>
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: '#D1D5DB',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#34D399'}
              onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'none', gap: '12px', alignItems: 'center' }} className="desktop-actions">
          <a
            href="#universitetlar"
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Kirish
          </a>
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
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '6px'
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0B1220',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#E5E7EB',
                fontSize: '16px',
                fontWeight: '500',
                textDecoration: 'none',
                padding: '8px 0'
              }}
            >
              {link.name}
            </a>
          ))}
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
