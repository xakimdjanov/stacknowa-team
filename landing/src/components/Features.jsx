import React from 'react';
import { FileCheck, Bot, Video, UserCheck, ShieldCheck, LineChart, Sparkles } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      title: 'AI Topshiriqlar & Baholash',
      desc: 'Topshiriqlarni avtomatik tuzish, tarqatish va Gemini AI yordamida chuqur tahliliy baholash.',
      icon: FileCheck,
      badge: 'Gemini AI Powered',
    },
    {
      title: '24/7 AI Repetitor',
      desc: 'Talabaga topshiriqni bajarish jarayonida qadam-baqadam yo‘l-yo‘riq va akademik maslahat beradi.',
      icon: Bot,
      badge: 'Shaxsiy AI Yordamchi',
    },
    {
      title: 'Live Classroom & Gamification',
      desc: 'Materiallardan tezkor quiz yaratish, Game PIN orqali darsda ulanish va jonli reyting peshqadamlari.',
      icon: Video,
      badge: 'Interaktiv Dars',
    },
    {
      title: 'Aqlli Davomat Nazorati',
      desc: 'Live darslarda talabalar ishtirokini avtomatik qayd etish va rektorat uchun shaffof ko‘rsatkichlar.',
      icon: UserCheck,
      badge: 'Avtomatlashtirilgan',
    },
    {
      title: 'Akademik Halollik (Integrity)',
      desc: 'Talaba ishlari o‘rtasidagi o‘xshashlik, AI generatsiya izlari va plagiatni ko‘p bosqichli tekshirish.',
      icon: ShieldCheck,
      badge: 'Plagiat & Similarity',
    },
    {
      title: 'Universitet BI & Analitika',
      desc: 'Fakultet, kafedra, o‘qituvchi va talaba ko‘rsatkichlarini real-vaqt rejimida yagona dashboardda ko‘rish.',
      icon: LineChart,
      badge: 'Rektorat Paneli',
    },
  ];

  return (
    <section id="imkoniyatlar" style={{
      backgroundColor: '#F8FAFC',
      padding: '110px 0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> PLATFORMA IMKONIYATLARI
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Universitetga kerak bo‘lgan barcha imkoniyatlar.
          </h2>
          <p className="section-subheading">
            O‘quv jarayonining har bir bosqichini to‘liq raqamlashtiruvchi va zamonaviy AI bilan qurollangan modullar majmuasi.
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
                style={{
                  padding: '36px 30px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  position: 'relative',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#A7F3D0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #A7F3D0'
                  }}>
                    <Icon size={26} color="#059669" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#047857',
                    backgroundColor: '#ECFDF5',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid #A7F3D0'
                  }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '21px', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#64748B' }}>
                  {feat.desc}
                </p>

                {/* Subtle Green Accent Line on bottom of card */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '30px',
                  right: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.3), transparent)',
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
