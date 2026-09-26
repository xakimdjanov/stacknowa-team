import React from 'react';
import { FileCheck, Bot, Video, UserCheck, ShieldCheck, LineChart, Sparkles } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      title: 'AI Assignments',
      desc: 'Topshiriqlarni yaratish, tarqatish va AI yordamida baholash.',
      icon: FileCheck,
      badge: 'Gemini AI Powered',
    },
    {
      title: 'AI Tutor',
      desc: 'Talabaga topshiriqni bajarish jarayonida tushuntirish va yordam.',
      icon: Bot,
      badge: '24/7 Yordamchi',
    },
    {
      title: 'Live Classroom',
      desc: 'Materiallardan quiz yaratish, Game PIN orqali ulanish va real-time natijalar.',
      icon: Video,
      badge: 'Interaktiv Dars',
    },
    {
      title: 'Smart Attendance',
      desc: 'Live darslarda talabalar ishtiroki va davomatini kuzatish.',
      icon: UserCheck,
      badge: 'Avto Davomat',
    },
    {
      title: 'Academic Integrity',
      desc: 'Talaba ishlari o‘xshashligi, AI foydalanish indikatorlari va topshiriq talablarini tekshirish.',
      icon: ShieldCheck,
      badge: 'Plagiat & Similarity',
    },
    {
      title: 'University Analytics',
      desc: 'Faculty, department, teacher va student ko‘rsatkichlarini yagona dashboardda ko‘rish.',
      icon: LineChart,
      badge: 'Boshqaruv Paneli',
    },
  ];

  return (
    <section id="imkoniyatlar" style={{
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
            PLATFORMA IMMONIYATLARI
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
            Universitetga kerak bo‘lgan barcha imkoniyatlar.
          </h2>
          <p className="section-subheading">
            O‘quv jarayonining har bir bosqichini raqamlashtiruvchi va sun’iy intellekt bilan kuchaytirilgan vositalar majmuasi.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {featuresList.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card-light"
                style={{
                  padding: '36px 30px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  position: 'relative',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(52, 211, 153, 0.25)'
                  }}>
                    <Icon size={26} color="#059669" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#047857',
                    backgroundColor: '#ECFDF5',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #A7F3D0'
                  }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4B5563' }}>
                  {feat.desc}
                </p>

                {/* Subtle Green Accent Line on bottom of card */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '30px',
                  right: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.5), transparent)',
                  borderRadius: '2px'
                }} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
