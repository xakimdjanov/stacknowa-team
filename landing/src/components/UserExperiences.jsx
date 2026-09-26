import React from 'react';
import { Building2, GraduationCap, UserCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';

export default function UserExperiences({ onOpenDemo }) {
  const { t } = useLanguage();

  const expMeta = [
    {
      url: 'https://edu-mind-university.vercel.app/login',
      icon: Building2, accent: '#059669', bg: '#ECFDF5', border: '#A7F3D0',
    },
    {
      url: 'https://edu-mind-teacher.vercel.app/',
      icon: GraduationCap, accent: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    },
    {
      url: 'https://edu-mind-student.vercel.app/',
      icon: UserCheck, accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
    }
  ];

  const CardItem = ({ item, meta }) => {
    const Icon = meta.icon;
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '22px', padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', height: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 25px 40px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = meta.border; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: meta.accent, backgroundColor: meta.bg, padding: '4px 10px', borderRadius: '7px', border: `1px solid ${meta.border}` }}>{item.roleBadge}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textAlign: 'right' }}>{item.target}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: meta.bg, border: `1px solid ${meta.border}`, color: meta.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={22} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{item.title}</h3>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#64748B', marginBottom: '20px' }}>{item.desc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {item.features.map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: '#1E293B', fontWeight: '600' }}>
                <CheckCircle2 size={16} color={meta.accent} style={{ flexShrink: 0, marginTop: '1px' }} /><span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '14px 16px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '7px', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{item.snippet.header}</span>
              <span style={{ fontSize: '10px', color: meta.accent, background: meta.bg, border: `1px solid ${meta.border}`, padding: '2px 7px', borderRadius: '5px', fontWeight: '700', flexShrink: 0 }}>{item.snippet.tag}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#64748B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span>{t.experiences.snippetLabels.mode}</span><strong style={{ color: '#0F172A', textAlign: 'right' }}>{item.snippet.metric1}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span>{t.experiences.snippetLabels.status}</span><strong style={{ color: meta.accent }}>{item.snippet.metric2}</strong></div>
            </div>
          </div>
          <a href={meta.url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px 16px', borderRadius: '11px', backgroundColor: meta.bg, border: `1px solid ${meta.border}`, color: meta.accent, fontWeight: '700', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = meta.accent; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = meta.bg; e.currentTarget.style.color = meta.accent; }}>
            <span>{item.portalName}</span><ArrowRight size={14} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <section id="universitetlar" style={{ backgroundColor: '#F8FAFC', padding: '90px 0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} color="#059669" /> {t.experiences.eyebrow}
          </span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>{t.experiences.title}</h2>
          <p className="section-subheading">{t.experiences.desc}</p>
        </div>

        {/* Desktop */}
        <div className="cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
          {t.experiences.cards.map((e, idx) => <CardItem key={e.roleBadge} item={e} meta={expMeta[idx]} />)}
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.08} className="em-swiper">
            {t.experiences.cards.map((e, idx) => (
              <SwiperSlide key={e.roleBadge}>
                <CardItem item={e} meta={expMeta[idx]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .cards-mobile { display: none; }
        @media (max-width: 700px) {
          .cards-desktop { display: none !important; }
          .cards-mobile { display: block; }
          #universitetlar { padding: 60px 0 !important; }
        }
      `}</style>
    </section>
  );
}
