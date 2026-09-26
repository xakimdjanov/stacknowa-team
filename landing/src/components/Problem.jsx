import React from 'react';
import { Clock, FolderX, EyeOff, Cpu, AlertTriangle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';

export default function Problem() {
  const { t } = useLanguage();
  const icons = [Clock, FolderX, EyeOff, Cpu];
  const colors = ['#EF4444', '#F59E0B', '#2563EB', '#7C3AED'];
  const bgs = ['#FEF2F2', '#FFFBEB', '#EFF6FF', '#F5F3FF'];
  const borders = ['#FECACA', '#FDE68A', '#BFDBFE', '#DDD6FE'];

  const CardItem = ({ prob, idx }) => {
    const Icon = icons[idx] || Clock;
    const color = colors[idx];
    const bg = bgs[idx];
    const border = borders[idx];

    return (
      <div style={{ padding: '26px 22px', position: 'relative', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', height: '100%', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = border; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, border: `1px solid ${border}`, flexShrink: 0 }}>
            <Icon size={20} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#E2E8F0', fontFamily: 'monospace' }}>{prob.number}</span>
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{prob.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748B' }}>{prob.desc}</p>
      </div>
    );
  };

  return (
    <section id="platforma" style={{ backgroundColor: '#F8FAFC', padding: '90px 0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '5px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px', border: '1px solid #FECACA', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={13} /> {t.problem.eyebrow}
          </span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>{t.problem.title}</h2>
          <p className="section-subheading">{t.problem.desc}</p>
        </div>

        {/* Desktop Grid */}
        <div className="cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '18px' }}>
          {t.problem.cards.map((p, idx) => <CardItem key={p.number} prob={p} idx={idx} />)}
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.12} centeredSlides={false} className="em-swiper">
            {t.problem.cards.map((p, idx) => (
              <SwiperSlide key={p.number}>
                <CardItem prob={p} idx={idx} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .cards-mobile { display: none; }
        @media (max-width: 640px) {
          .cards-desktop { display: none !important; }
          .cards-mobile { display: block; }
          #platforma { padding: 60px 0 !important; }
        }
      `}</style>
    </section>
  );
}
