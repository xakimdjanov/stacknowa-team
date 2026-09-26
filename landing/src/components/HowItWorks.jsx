import React from 'react';
import { Building2, UserPlus, Users2, Rocket, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenDemo }) {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Universitet ulanadi',
      desc: 'University Admin Smart Edu muhitini yaratadi.',
      icon: Building2,
      accent: '#34D399',
    },
    {
      step: 'STEP 02',
      title: 'O‘qituvchilar qo‘shiladi',
      desc: 'O‘qituvchi universitet Unique Code orqali ro‘yxatdan o‘tadi va Admin tomonidan tasdiqlanadi.',
      icon: UserPlus,
      accent: '#60A5FA',
    },
    {
      step: 'STEP 03',
      title: 'Talabalar ulanadi',
      desc: 'O‘qituvchi group yaratadi. Talabalar link, QR yoki PIN orqali qo‘shiladi.',
      icon: Users2,
      accent: '#F59E0B',
    },
    {
      step: 'STEP 04',
      title: 'Ta’lim jarayoni boshqariladi',
      desc: 'Topshiriq, AI, live dars, davomat va analytics bitta platformada ishlaydi.',
      icon: Rocket,
      accent: '#A78BFA',
    },
  ];

  return (
    <section id="qanday-ishlaydi" style={{
      backgroundColor: '#FFFFFF',
      padding: '110px 0',
      borderBottom: '1px solid #E5E7EB',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            INTEGRATSIYA JARAYONI
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
            Smart Edu qanday ishlaydi?
          </h2>
          <p className="section-subheading">
            Tizimni universitetingizga tatbiq etish va ishga tushirish 4 ta oddiy bosqichdan iborat.
          </p>
        </div>

        {/* Timeline Grid (Horizontal 4-Step Process) */}
        <div style={{ position: 'relative' }}>
          
          {/* Timeline connecting line for desktop */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, #34D399 0%, #60A5FA 33%, #F59E0B 66%, #A78BFA 100%)',
            zIndex: 1,
            opacity: 0.3
          }} className="timeline-line" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            position: 'relative',
            zIndex: 2
          }}>
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  style={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '24px',
                    padding: '36px 24px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = item.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  {/* Step Icon Badge */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    backgroundColor: '#FFFFFF',
                    border: `2px solid ${item.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: `0 8px 20px ${item.accent}20`
                  }}>
                    <Icon size={28} color={item.accent} />
                  </div>

                  {/* Step Label */}
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: item.accent,
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}>
                    {item.step}
                  </div>

                  {/* Step Title */}
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#6B7280' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Prompt */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={onOpenDemo}
            className="btn-secondary-light"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px' }}
          >
            Integratsiya ssenariysini ko‘rish <ArrowRight size={16} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .timeline-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}
