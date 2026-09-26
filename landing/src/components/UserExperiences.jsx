import React from 'react';
import { Building2, GraduationCap, UserCheck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function UserExperiences({ onOpenDemo }) {
  const experiences = [
    {
      roleBadge: 'UNIVERSITY',
      target: 'Universitet Admini uchun',
      title: 'Boshqaruv va Analitika',
      desc: 'Universitetdagi barcha o‘quv jarayonlarini markazlashtiring, dekanatlarni boshqaring va umumiy ko‘rsatkichlarni kuzating.',
      url: 'https://edu-mind-university.vercel.app/login',
      portalName: 'Universitet Adminiga kirish',
      icon: Building2,
      accent: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      features: [
        'Fakultet va Kafedralar boshqaruvi',
        'O‘qituvchilarni tasdiqlash (KYC)',
        'Rektorat BI analitikasi',
        'Universitet bo‘yicha davomat nazorati',
        'Akademik faollik monitoringi',
      ],
      snippet: {
        header: 'Rektorat Boshqaruv Paneli',
        metric1: '12 Fakultetlar to‘liq ulangan',
        metric2: '92% O‘rtacha Davomat',
        tag: 'Markaziy Nazorat',
      }
    },
    {
      roleBadge: 'TEACHER',
      target: 'O‘qituvchilar uchun',
      title: 'O‘qituvchi Ish Stoli',
      desc: 'O‘qituvchi qimmatli vaqtini qog‘ozbozlik va ma’muriy ishlarga emas, talabalar bilan sifatli ta’limga sarflasin.',
      url: 'https://edu-mind-teacher.vercel.app/',
      portalName: 'O‘qituvchi Kabinetiga kirish',
      icon: GraduationCap,
      accent: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      features: [
        'AI topshiriqlar yaratish va tekshirish',
        'Kriteriyalar asosida avtomatik baholash',
        'Akademik guruhlar va materiallar',
        'Game PIN orqali Live Classroom',
        'Barcha baholar va natijalar jurnali',
      ],
      snippet: {
        header: 'O‘qituvchi Ish Muhiti',
        metric1: 'Gemini AI Baholash: Faol',
        metric2: 'Live Quiz & Game PIN',
        tag: 'Avtomatlashtirish',
      }
    },
    {
      roleBadge: 'STUDENT',
      target: 'Talabalar uchun',
      title: 'Talabalar Shaxsiy Portali',
      desc: 'Talaba uchun darslar, topshiriqlar, natijalar va 24/7 sun’iy intellekt repetitoridan yordam olishning qulay platformasi.',
      url: 'https://edu-mind-student.vercel.app/',
      portalName: 'Talabalar Portaliga kirish',
      icon: UserCheck,
      accent: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      features: [
        'Raqamli topshiriqlar topshirish',
        '24/7 AI repetitor ko‘magi',
        'Jonli interaktiv darslarda qatnashish',
        'Baho va xatolar bo‘yicha batafsil fikrlar',
        'Guruhdagi shaxsiy reyting',
      ],
      snippet: {
        header: 'Talaba Shaxsiy Kabineti',
        metric1: '24/7 Gemini AI Repetitor',
        metric2: 'Real-time Reyting',
        tag: 'Interaktiv Ta’lim',
      }
    }
  ];

  return (
    <section id="universitetlar" style={{
      backgroundColor: '#F8FAFC',
      padding: '110px 0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> FOYDALANUVCHILAR ROLLARI
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Har bir rol uchun alohida professional tajriba.
          </h2>
          <p className="section-subheading">
            Rektoratdan tortib har bir talabagacha bo‘lgan barcha ishtirokchilar uchun maxsus moslashtirilgan qulay va chiroyli interfeys.
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
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '24px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 25px 40px -10px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = item.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  {/* Card Header & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      color: item.accent,
                      backgroundColor: item.bg,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${item.border}`
                    }}>
                      {item.roleBadge}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>
                      {item.target}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: item.bg,
                      border: `1px solid ${item.border}`,
                      color: item.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '23px', fontWeight: '800', color: '#0F172A' }}>
                      {item.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#64748B', marginBottom: '24px' }}>
                    {item.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    {item.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1E293B', fontWeight: '600' }}>
                        <CheckCircle2 size={17} color={item.accent} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Dashboard Snippet Card inside */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{item.snippet.header}</span>
                      <span style={{ fontSize: '11px', color: item.accent, background: item.bg, border: `1px solid ${item.border}`, padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>{item.snippet.tag}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748B' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Rejim:</span>
                        <strong style={{ color: '#0F172A' }}>{item.snippet.metric1}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Status:</span>
                        <strong style={{ color: item.accent }}>{item.snippet.metric2}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link to Portal */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      backgroundColor: item.bg,
                      border: `1px solid ${item.border}`,
                      color: item.accent,
                      fontWeight: '700',
                      fontSize: '13px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = item.accent;
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.boxShadow = `0 6px 16px ${item.accent}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = item.bg;
                      e.currentTarget.style.color = item.accent;
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                    }}
                  >
                    <span>{item.portalName}</span>
                    <ArrowRight size={15} />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
