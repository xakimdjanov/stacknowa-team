import React from 'react';
import { Building2, UserPlus, Users2, Rocket, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorks({ onOpenDemo }) {
  const steps = [
    {
      step: 'BOSQICH 01',
      title: 'Universitet ulanadi',
      desc: 'University Admin tizimda oliygoh profilini yaratadi va dekanatlarni taqsimlaydi.',
      icon: Building2,
      accent: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0'
    },
    {
      step: 'BOSQICH 02',
      title: 'O‘qituvchilar qo‘shiladi',
      desc: 'O‘qituvchi universitet Unique Code orqali ro‘yxatdan o‘tadi va Admin tomonidan tasdiqlanadi.',
      icon: UserPlus,
      accent: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE'
    },
    {
      step: 'BOSQICH 03',
      title: 'Talabalar ulanadi',
      desc: 'O‘qituvchi guruh yaratadi. Talabalar taklif havolasi, QR yoki Game PIN orqali bir zumda qo‘shiladi.',
      icon: Users2,
      accent: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A'
    },
    {
      step: 'BOSQICH 04',
      title: 'To‘liq jarayon boshqariladi',
      desc: 'Topshiriqlar, AI tekshiruv, live darslar, davomat va chuqur analitika bitta tizimda ishlaydi.',
      icon: Rocket,
      accent: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE'
    },
  ];

  return (
    <section id="qanday-ishlaydi" style={{
      backgroundColor: '#FFFFFF',
      padding: '110px 0',
      borderBottom: '1px solid #E2E8F0',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> INTEGRATSIYA VA JORIY ETISH
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            EduMind AI qanday ishlaydi?
          </h2>
          <p className="section-subheading">
            Tizimni universitetingizga tatbiq etish va to‘liq ishga tushirish 4 ta oddiy va tezkor bosqichdan iborat.
          </p>
        </div>

        {/* Timeline Grid */}
        <div style={{ position: 'relative' }}>
          
          {/* Timeline connecting line for desktop */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, #059669 0%, #2563EB 33%, #D97706 66%, #7C3AED 100%)',
            zIndex: 1,
            opacity: 0.35
          }} className="timeline-line" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            position: 'relative',
            zIndex: 2
          }}>
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '24px',
                    padding: '36px 24px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = item.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  {/* Step Icon Badge */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    backgroundColor: item.bg,
                    border: `1px solid ${item.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
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
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#64748B' }}>
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
