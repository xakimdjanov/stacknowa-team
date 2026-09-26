import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export default function FinalCta({ onOpenDemo }) {
  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      padding: '80px 0 100px',
      position: 'relative',
    }}>
      <div className="container">
        
        {/* Sleek SaaS Banner Card Container */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '32px',
          padding: '64px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.04)',
        }}>
          {/* Subtle Ambient Radial Glow */}
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

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
            {/* Eyebrow */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <span className="eyebrow-badge">
                <Sparkles size={14} color="#059669" /> RAQAMLI TA'LIM KELAJAGI
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: 'clamp(30px, 4.2vw, 48px)',
              fontWeight: '800',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              margin: '0 auto 18px',
              color: '#0F172A'
            }}>
              Universitetingizni yanada aqlli boshqarishga tayyormisiz?
            </h2>

            {/* Subheading */}
            <p style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              color: '#475569',
              maxWidth: '600px',
              margin: '0 auto 36px',
              lineHeight: '1.6'
            }}>
              EduMind AI bilan barcha dekanatlar, o‘qituvchilar va talabalarni yagona raqamli ekotizimga birlashtiring.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '16px 34px', fontSize: '15px' }}>
                Universitet uchun demo olish <ArrowRight size={18} />
              </button>
              <a
                href="#faq"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontSize: '15px',
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
                <MessageSquare size={18} /> Mutaxassis bilan bog‘lanish
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
