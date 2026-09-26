import React from 'react';

export default function Footer({ onOpenDemo }) {
  const footerLinks = [
    { name: 'Platforma', href: '#platforma' },
    { name: 'Imkoniyatlar', href: '#imkoniyatlar' },
    { name: 'Qanday ishlaydi', href: '#qanday-ishlaydi' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Kontakt', href: '#narxlar' },
  ];

  return (
    <footer style={{
      backgroundColor: '#070C15',
      color: '#9CA3AF',
      padding: '60px 0 40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '14px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '24px'
        }}>
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', flexContent: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#0B1220',
                fontSize: '15px'
              }}>
                SE
              </div>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>
                Smart <span style={{ color: '#34D399' }}>Edu</span>
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>
              AI-powered university education platform.
            </p>
          </div>

          {/* Links Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '28px',
            margin: '10px 0'
          }}>
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: '#D1D5DB',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#34D399'}
                onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            width: '100%',
            paddingTop: '24px',
            color: '#6B7280',
            fontSize: '13px'
          }}>
            © 2026 Smart Edu. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </div>
    </footer>
  );
}
