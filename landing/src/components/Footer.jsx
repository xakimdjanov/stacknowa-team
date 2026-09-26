import React from 'react';

export default function Footer({ onOpenDemo }) {
  const footerLinks = [
    { name: 'Platforma', href: '#platforma' },
    { name: 'Imkoniyatlar', href: '#imkoniyatlar' },
    { name: 'Qanday ishlaydi', href: '#qanday-ishlaydi' },
    { name: 'Universitetlar', href: '#universitetlar' },
    { name: 'Biznes modeli', href: '#narxlar' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <footer style={{
      backgroundColor: '#F8FAFC',
      color: '#64748B',
      padding: '50px 0 36px',
      borderTop: '1px solid #E2E8F0',
      fontSize: '14px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '20px'
        }}>
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#FFFFFF',
                fontSize: '14px',
                boxShadow: '0 4px 10px rgba(5, 150, 105, 0.2)',
                flexShrink: 0
              }}>
                EM
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                EduMind <span style={{ color: '#059669' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '13px', marginTop: '2px', maxWidth: '300px' }}>
              O'zbekiston OTMlari uchun yagona AI ta'lim ekotizimi.
            </p>
          </div>

          {/* Links */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px 22px',
            margin: '4px 0'
          }}>
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid #E2E8F0',
            width: '100%',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>© 2026 EduMind AI. Barcha huquqlar himoyalangan.</span>
            <span style={{ color: '#CBD5E1', fontSize: '11px' }}>#MilliyAIXakaton 2026 uchun maxsus ishlab chiqilgan.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 400px) {
          footer { padding: 40px 0 28px !important; }
          footer .container > div { gap: 16px !important; }
        }
      `}</style>
    </footer>
  );
}
