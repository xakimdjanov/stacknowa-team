import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export default function FinalCta({ onOpenDemo }) {
  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      padding: '70px 0 90px',
      position: 'relative',
    }}>
      <div className="container">
        
        {/* Banner Card */}
        <div className="final-cta-card" style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '28px',
          padding: '56px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.04)',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(248, 250, 252, 0) 70%)',
            pointerEvents: 'none',
            filter: 'blur(50px)'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
            {/* Eyebrow */}
            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
              <span className="eyebrow-badge">
                <Sparkles size={13} color="#059669" /> RAQAMLI TA'LIM KELAJAGI
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: 'clamp(22px, 4.5vw, 46px)',
              fontWeight: '800',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              margin: '0 auto 16px',
              color: '#0F172A'
            }}>
              Universitetingizni yanada aqlli boshqarishga tayyormisiz?
            </h2>

            {/* Subheading */}
            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: '#475569',
              maxWidth: '560px',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}>
              EduMind AI bilan barcha dekanatlar, o'qituvchilar va talabalarni yagona raqamli ekotizimga birlashtiring.
            </p>

            {/* Buttons */}
            <div className="final-cta-btns" style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '15px 30px', fontSize: '15px' }}>
                Universitet uchun demo olish <ArrowRight size={17} />
              </button>
              <a
                href="#faq"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '15px 26px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#94A3B8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                <MessageSquare size={17} /> Mutaxassis bilan bog'lanish
              </a>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .final-cta-card { padding: 40px 20px !important; border-radius: 22px !important; }
          .final-cta-btns { flex-direction: column !important; align-items: stretch !important; }
          .final-cta-btns a { justify-content: center !important; }
        }
        @media (max-width: 400px) {
          .final-cta-card { padding: 32px 14px !important; border-radius: 18px !important; }
        }
      `}</style>
    </section>
  );
}
