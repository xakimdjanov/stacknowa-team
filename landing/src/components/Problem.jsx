import React from 'react';
import { Clock, FolderX, EyeOff, Cpu, AlertTriangle } from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      number: '01',
      title: 'Ko‘p vaqt ketadi',
      desc: 'Topshiriqlarni tarqatish, yig‘ish va qo‘lda tekshirish o‘qituvchining dars berish vaqtini o‘g‘irlaydi.',
      icon: Clock,
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA'
    },
    {
      number: '02',
      title: 'Ishlar tarqoq',
      desc: 'Talaba ishlari turli messenjerlar, fayllar, platformalar va qog‘ozlarda sochilib saqlanadi.',
      icon: FolderX,
      color: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FDE68A'
    },
    {
      number: '03',
      title: 'Jarayonni kuzatish qiyin',
      desc: 'Davomat, topshiriq, darsdagi faollik va talabalar natijalarini rektorat yagona joyda ko‘ra olmaydi.',
      icon: EyeOff,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE'
    },
    {
      number: '04',
      title: 'AI vositalari tarqoq',
      desc: 'AI baholash, similarity checking va akademik integrity uchun alohida vositalar izlashga to‘g‘ri keladi.',
      icon: Cpu,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE'
    },
  ];

  return (
    <section id="platforma" style={{
      backgroundColor: '#F8FAFC',
      padding: '110px 0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#DC2626',
            backgroundColor: '#FEF2F2',
            padding: '6px 14px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px',
            border: '1px solid #FECACA',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertTriangle size={14} /> MAVJUD MUAMMOLAR
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Universitet ta’lim jarayoni hali ham tarqoq.
          </h2>
          <p className="section-subheading">
            Turli vositalar, qo‘lda bajariladigan jarayonlar va cheklangan ko‘rinish o‘qituvchi hamda universitet boshqaruviga ortiqcha yuk yaratadi.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.number}
                style={{
                  padding: '36px 30px',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = prob.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: prob.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: prob.color,
                    border: `1px solid ${prob.border}`
                  }}>
                    <Icon size={26} />
                  </div>
                  <span style={{ fontSize: '30px', fontWeight: '800', color: '#E2E8F0', fontFamily: 'monospace' }}>
                    {prob.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  {prob.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#64748B' }}>
                  {prob.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
