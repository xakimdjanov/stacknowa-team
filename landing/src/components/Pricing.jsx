import React from 'react';
import { Check, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function Pricing({ onOpenDemo }) {
  const planIncludes = [
    'University Admin',
    'Faculty & Department Management',
    'Teacher & Student Access',
    'AI-powered features',
    'Live Classroom',
    'Analytics',
    'Support',
  ];

  return (
    <section id="narxlar" style={{
      backgroundColor: '#F5F7FA',
      padding: '110px 0',
      borderBottom: '1px solid #E5E7EB'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            padding: '6px 14px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px',
            border: '1px solid rgba(52, 211, 153, 0.3)'
          }}>
            ENTERPRISE SaaS MODELI
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
            Universitetlar uchun yaratilgan.
          </h2>
          <p className="section-subheading">
            Smart Edu universitet hajmi, talabalar soni va tanlangan modullarga mos ravishda kengayadi.
          </p>
        </div>

        {/* ONE LARGE ENTERPRISE PRICING CARD */}
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: '#0B1220',
          borderRadius: '28px',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 40px rgba(52, 211, 153, 0.15)',
          padding: '48px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(40px)'
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }} className="pricing-grid">
            
            {/* Left Column: Plan Title & Pricing detail */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34D399',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                <Building2 size={16} /> ENTERPRISE TIZIM
              </div>

              <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#FFF', marginBottom: '8px' }}>
                UNIVERSITY PLAN
              </h3>

              <div style={{ fontSize: '42px', fontWeight: '800', color: '#34D399', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Custom pricing
              </div>

              <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                Universitet ehtiyojlaridan kelib chiqqan holda, alohida server infratuzilmasi, maxsus domen hamda doimiy texnik qo‘llab-quvvatlash bilan ta’minlanadi.
              </p>

              <button
                onClick={onOpenDemo}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', borderRadius: '12px' }}
              >
                Universitet uchun demo olish <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Column: Included Features List */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFF', marginBottom: '20px' }}>
                Rejaga kiritilgan barcha imkoniyatlar:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {planIncludes.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#E5E7EB', fontWeight: '500' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(52, 211, 153, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34D399'
                    }}>
                      <Check size={14} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Small Note */}
              <div style={{
                fontSize: '12px',
                color: '#9CA3AF',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#34D399" />
                <span>Narx universitet hajmi va foydalaniladigan modullarga qarab belgilanadi.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
