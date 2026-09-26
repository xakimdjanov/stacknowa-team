import React from 'react';
import { Clock, FolderX, EyeOff, Cpu } from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      number: '01',
      title: 'Ko‘p vaqt ketadi',
      desc: 'Topshiriqlarni tarqatish, yig‘ish va tekshirish o‘qituvchining vaqtini oladi.',
      icon: Clock,
      color: '#EF4444',
    },
    {
      number: '02',
      title: 'Ishlar tarqoq',
      desc: 'Talaba ishlari turli fayllar, platformalar va qog‘ozlarda saqlanadi.',
      icon: FolderX,
      color: '#F59E0B',
    },
    {
      number: '03',
      title: 'Jarayonni kuzatish qiyin',
      desc: 'Davomat, topshiriq, faollik va natijalarni yagona joyda ko‘rish qiyin.',
      icon: EyeOff,
      color: '#6366F1',
    },
    {
      number: '04',
      title: 'AI vositalari tarqoq',
      desc: 'AI baholash, similarity checking va akademik yordam uchun alohida vositalar kerak bo‘ladi.',
      icon: Cpu,
      color: '#EC4899',
    },
  ];

  return (
    <section id="platforma" style={{
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
            color: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            padding: '6px 14px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px'
          }}>
            MAVJUD MUAMMOLAR
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
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
                className="glass-card-light"
                style={{
                  padding: '36px 30px',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${prob.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: prob.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: '#E5E7EB', fontFamily: 'monospace' }}>
                    {prob.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  {prob.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#6B7280' }}>
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
