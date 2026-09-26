import React from 'react';
import { Building2, UserPlus, Users2, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks({ onOpenDemo }) {
  const { t } = useLanguage();
  const icons = [Building2, UserPlus, Users2, Rocket];
  const accents = ['#059669', '#2563EB', '#D97706', '#7C3AED'];
  const bgs = ['#ECFDF5', '#EFF6FF', '#FFFBEB', '#F5F3FF'];
  const borders = ['#A7F3D0', '#BFDBFE', '#FDE68A', '#DDD6FE'];

  const CardItem = ({ item, idx }) => {
    const Icon = icons[idx] || Building2;
    const accent = accents[idx];
    const bg = bgs[idx];
    const border = borders[idx];

    return (
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '22px', padding: '28px 20px', position: 'relative', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', height: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = border; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Icon size={22} color={accent} />
        </div>
        <div style={{ fontSize: '10px', fontWeight: '800', color: accent, letterSpacing: '0.05em', marginBottom: '5px' }}>{item.step}</div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{item.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748B' }}>{item.desc}</p>
      </div>
    );
  };

  return (
    <section id="qanday-ishlaydi" style={{ backgroundColor: '#FFFFFF', padding: '90px 0', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} color="#059669" /> {t.how.eyebrow}
          </span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>{t.how.title}</h2>
          <p className="section-subheading">{t.how.desc}</p>
        </div>

        {/* Desktop */}
        <div className="cards-desktop" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '38px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg,#059669 0%,#2563EB 33%,#D97706 66%,#7C3AED 100%)', zIndex: 1, opacity: 0.3 }} className="timeline-line" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '18px', position: 'relative', zIndex: 2 }}>
            {t.how.steps.map((s, idx) => <CardItem key={s.step} item={s} idx={idx} />)}
          </div>
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.12} className="em-swiper">
            {t.how.steps.map((s, idx) => (
              <SwiperSlide key={s.step}>
                <CardItem item={s} idx={idx} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <button onClick={onOpenDemo} className="btn-secondary-light" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {t.how.cta} <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .cards-mobile { display: none; }
        @media (max-width: 900px) { .timeline-line { display: none !important; } }
        @media (max-width: 640px) {
          .cards-desktop { display: none !important; }
          .cards-mobile { display: block; }
          #qanday-ishlaydi { padding: 60px 0 !important; }
        }
      `}</style>
    </section>
  );
}
