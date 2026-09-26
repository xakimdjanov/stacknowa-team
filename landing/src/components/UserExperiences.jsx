import React from 'react';
import { Building2, GraduationCap, UserCheck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function UserExperiences({ onOpenDemo }) {
  const experiences = [
    {
      roleBadge: 'UNIVERSITY',
      target: 'For University Admins',
      title: 'Boshqaruv va Analitika',
      desc: 'Universitetdagi akademik jarayonlarni markazlashtiring va umumiy ko‘rsatkichlarni kuzating.',
      icon: Building2,
      accent: '#34D399',
      features: [
        'Faculty & Department',
        'Teacher approvals',
        'Analytics',
        'Attendance overview',
        'Activity monitoring',
      ],
      snippet: {
        header: 'Rektorat Dashboard',
        metric1: '12 Fakultetlar',
        metric2: '92% O‘rtacha Davomat',
        tag: 'Boshqaruv Paneli',
      }
    },
    {
      roleBadge: 'TEACHER',
      target: 'For Teachers',
      title: 'O‘qituvchi Ish Stoli',
      desc: 'O‘qituvchi vaqtini ma’muriy ishlarga emas, ta’limga sarflasin.',
      icon: GraduationCap,
      accent: '#60A5FA',
      features: [
        'Assignments',
        'AI evaluation',
        'Groups',
        'Live quiz',
        'Attendance',
        'Student results',
      ],
      snippet: {
        header: 'O‘qituvchi Muhiti',
        metric1: 'AI Avto-baholash: Active',
        metric2: 'Game PIN Live Quiz',
        tag: 'Darsni Avtomatlashtirish',
      }
    },
    {
      roleBadge: 'STUDENT',
      target: 'For Students',
      title: 'Talabalar Portali',
      desc: 'Talaba uchun o‘qish, topshirish va AI yordam olishning yagona muhiti.',
      icon: UserCheck,
      accent: '#F59E0B',
      features: [
        'Digital assignments',
        'AI Tutor',
        'Live classes',
        'Feedback',
        'Results',
      ],
      snippet: {
        header: 'Talaba Shaxsiy Kabineti',
        metric1: '24/7 Gemini AI Tutor',
        metric2: 'Real-time Reiting',
        tag: 'Interaktiv O‘quv',
      }
    }
  ];

  return (
    <section id="universitetlar" style={{
      backgroundColor: '#FFFFFF',
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
            FOYDALANUVCHILAR ROLLARI
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
            Har bir rol uchun alohida tajriba.
          </h2>
          <p className="section-subheading">
            Rektoratdan tortib har bir talabagacha bo‘lgan barcha ishtirokchilar uchun maxsus moslashtirilgan qulay interfeys.
          </p>
        </div>

        {/* 3 Large Experience Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {experiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.roleBadge}
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '24px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 25px 40px -10px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = item.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <div>
                  {/* Card Header & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                      color: item.accent,
                      backgroundColor: `${item.accent}15`,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${item.accent}30`
                    }}>
                      {item.roleBadge}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                      {item.target}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: item.accent,
                      color: '#0B1220',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                      {item.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4B5563', marginBottom: '24px' }}>
                    {item.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {item.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                        <CheckCircle2 size={16} color={item.accent} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard Snippet Card inside */}
                <div style={{
                  backgroundColor: '#0B1220',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFF'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#E5E7EB' }}>{item.snippet.header}</span>
                    <span style={{ fontSize: '10px', color: item.accent, background: `${item.accent}20`, padding: '2px 8px', borderRadius: '4px' }}>{item.snippet.tag}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#9CA3AF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Rejim:</span>
                      <strong style={{ color: '#FFF' }}>{item.snippet.metric1}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Status:</span>
                      <strong style={{ color: item.accent }}>{item.snippet.metric2}</strong>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
