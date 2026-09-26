import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export default function FinalCta({ onOpenDemo }) {
  return (
    <section style={{
      backgroundColor: '#0B1220',
      color: '#FFFFFF',
      padding: '130px 0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Background glow behind CTA */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.18) 0%, rgba(11, 18, 32, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(70px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        
        {/* Eyebrow */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <span className="eyebrow-badge">
            <Sparkles size={14} color="#34D399" /> RAQAMLI TA'LIM KELAJAGI
          </span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(36px, 4.8vw, 60px)',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          maxWidth: '860px',
          margin: '0 auto 20px',
          color: '#FFFFFF'
        }}>
          Universitetingizni yanada aqlli boshqarishga tayyormisiz?
        </h2>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(17px, 2vw, 20px)',
          color: '#9CA3AF',
          maxWidth: '620px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Smart Edu bilan ta’lim jarayonini bir platformaga birlashtiring.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '60px' }}>
          <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '16px 36px', fontSize: '17px' }}>
            Demo olish <ArrowRight size={18} />
          </button>
          <a href="#faq" className="btn-secondary-dark" style={{ padding: '16px 32px', fontSize: '17px' }}>
            <MessageSquare size={18} /> Jamoa bilan bog‘lanish
          </a>
        </div>

        {/* Brand Tagline below CTA */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '36px',
          display: 'inline-block'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Smart <span style={{ color: '#34D399' }}>Edu</span>
          </div>
          <div style={{ fontSize: '15px', color: '#6B7280', fontWeight: '500' }}>
            “Bitta platforma. Butun ta’lim jarayoni.”
          </div>
        </div>

      </div>
    </section>
  );
}
