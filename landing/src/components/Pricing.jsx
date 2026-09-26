import React from 'react';
import { Check, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing({ onOpenDemo }) {
  const { t } = useLanguage();

  const CardItem = ({ plan }) => (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: '20px',
      border: plan.popular ? '2px solid #059669' : '1px solid #E2E8F0',
      padding: '28px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative',
      boxShadow: plan.popular ? '0 16px 36px -6px rgba(5,150,105,0.18)' : '0 2px 5px rgba(0,0,0,0.03)',
      height: '100%', transition: 'all 0.3s ease'
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.09)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = plan.popular ? 'translateY(-6px)' : 'translateY(0)'; e.currentTarget.style.boxShadow = plan.popular ? '0 16px 36px -6px rgba(5,150,105,0.18)' : '0 2px 5px rgba(0,0,0,0.03)'; }}>
      {plan.popular && (
        <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#059669', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '4px 16px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(5,150,105,0.35)', whiteSpace: 'nowrap' }}>{plan.badge}</div>
      )}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: plan.popular ? '#ECFDF5' : '#F1F5F9', border: plan.popular ? '1px solid #A7F3D0' : '1px solid #E2E8F0', color: plan.popular ? '#059669' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={22} /></div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>{plan.name}</h4>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>{plan.category} {plan.audience}</div>
          </div>
        </div>
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(26px,5vw,34px)', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>{plan.price}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748B' }}>{plan.period}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '26px' }}>
          {plan.features.map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#334155' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: plan.popular ? '#ECFDF5' : '#F1F5F9', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}><Check size={12} strokeWidth={3} /></div>
              <span style={{ fontWeight: '500' }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onOpenDemo} style={{ width: '100%', padding: '13px 18px', borderRadius: '11px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', border: plan.popular ? 'none' : '1px solid #CBD5E1', backgroundColor: plan.popular ? '#059669' : '#fff', color: plan.popular ? '#fff' : '#0F172A', boxShadow: plan.popular ? '0 4px 14px rgba(5,150,105,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
        onMouseEnter={(e) => { if (plan.popular) { e.currentTarget.style.backgroundColor = '#047857'; } else { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#94A3B8'; } }}
        onMouseLeave={(e) => { if (plan.popular) { e.currentTarget.style.backgroundColor = '#059669'; } else { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#CBD5E1'; } }}>
        <span>{plan.buttonText}</span><ArrowRight size={14} />
      </button>
    </div>
  );

  return (
    <section id="narxlar" style={{ backgroundColor: '#FFFFFF', padding: '90px 0', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} color="#059669" /> {t.pricing.eyebrow}
          </span>
          <h2 className="section-heading" style={{ marginBottom: '12px' }}>{t.pricing.title}</h2>
          <p className="section-subheading" style={{ fontSize: 'clamp(14px,2vw,18px)', fontWeight: '500', color: '#475569' }}>
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="pricing-box" style={{ backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px 24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 28px' }}>
            <h3 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>{t.pricing.boxTitle}</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>{t.pricing.boxDesc}</p>
          </div>

          {/* Desktop */}
          <div className="cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px', alignItems: 'stretch' }}>
            {t.pricing.plans.map(p => <CardItem key={p.name} plan={p} />)}
          </div>

          {/* Mobile Swiper */}
          <div className="cards-mobile em-swiper-wrapper">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.1} initialSlide={1} className="em-swiper">
              {t.pricing.plans.map(p => (
                <SwiperSlide key={p.name}>
                  <CardItem plan={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
            <ShieldCheck size={17} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{t.pricing.guarantee}</span>
          </div>
        </div>
      </div>

      <style>{`
        .cards-mobile { display: none; }
        @media (max-width: 700px) {
          .cards-desktop { display: none !important; }
          .cards-mobile { display: block; }
          #narxlar { padding: 60px 0 !important; }
          .pricing-box { padding: 20px 12px !important; border-radius: 18px !important; }
        }
      `}</style>
    </section>
  );
}
