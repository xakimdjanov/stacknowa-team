import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle, Users, GraduationCap, Building2, Layers, Activity, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onOpenDemo }) {
  const { t } = useLanguage();
  const icons = [Users, GraduationCap, Activity, Building2, Layers];
  const iconColors = ['#059669', '#2563EB', '#059669', '#D97706', '#7C3AED'];
  const chartColors = ['#059669', '#059669', '#2563EB'];

  return (
    <section className="hero-section" style={{
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      paddingTop: '120px',
      paddingBottom: '70px',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid #E2E8F0'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(70px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          alignItems: 'center'
        }}>

          {/* LEFT CONTENT */}
          <div>
            {/* Eyebrow */}
            <div style={{ marginBottom: '16px' }}>
              <span className="eyebrow-badge">
                <Sparkles size={13} color="#059669" /> {t.hero.eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-heading" style={{ marginBottom: '18px' }}>
              {t.hero.title1}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {t.hero.titleAccent}
              </span>
            </h1>

            {/* Supporting Line */}
            <p className="hero-desc" style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              lineHeight: '1.65',
              color: '#475569',
              marginBottom: '28px',
              maxWidth: '600px'
            }}>
              {t.hero.desc}
            </p>

            {/* CTAs */}
            <div className="hero-cta-group" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <button onClick={onOpenDemo} className="btn-primary">
                {t.hero.cta1} <ArrowRight size={17} />
              </button>
              <a href="#narxlar" className="btn-secondary-dark">
                {t.hero.cta2} <ChevronDown size={17} />
              </a>
            </div>

            {/* Trust Bar */}
            <div className="hero-trust-bar" style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px 12px',
              color: '#64748B',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {t.hero.trust.map((item, index) => (
                <React.Fragment key={item}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0F172A' }}>
                    <CheckCircle size={14} color="#059669" /> {item}
                  </div>
                  {index < t.hero.trust.length - 1 && <span style={{ color: '#CBD5E1' }}>•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT: Dashboard Mockup */}
          <div style={{ position: 'relative' }}>
            <div className="hero-mockup-frame" style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              position: 'relative'
            }}>
              {/* Mockup Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '14px',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div className="hero-control-url" style={{
                  fontSize: '10px',
                  color: '#64748B',
                  fontFamily: 'monospace',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0
                }}>
                  {t.hero.mock.url}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#059669', fontWeight: '700', flexShrink: 0 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                  {t.hero.mock.live}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="hero-metrics-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
                gap: '8px',
                marginBottom: '14px'
              }}>
                {t.hero.mock.metrics.map((item, idx) => {
                  const Icon = icons[idx] || Users;
                  const color = iconColors[idx] || '#059669';
                  return (
                    <div key={item.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '10px', fontWeight: '600' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                        <Icon size={12} color={color} style={{ flexShrink: 0 }} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: idx === 2 ? '#059669' : '#0F172A', marginTop: '3px' }}>{item.val}</div>
                      <div style={{ fontSize: '9px', color: idx === 0 || idx === 2 ? '#059669' : '#64748B', fontWeight: '600', marginTop: '1px' }}>{item.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Inner Content */}
              <div className="hero-inner-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px' }}>
                {/* Faculty Chart */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '6px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>{t.hero.mock.chartTitle}</h4>
                    <span style={{ fontSize: '9px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '5px', fontWeight: '600', flexShrink: 0 }}>{t.hero.mock.chartBadge}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {t.hero.mock.chartRows.map((row, idx) => {
                      const color = chartColors[idx] || '#059669';
                      return (
                        <div key={row.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#334155', marginBottom: '3px', fontWeight: '500' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '4px' }}>{row.name}</span>
                            <span style={{ fontWeight: '700', color: color, flexShrink: 0 }}>{row.pct}%</span>
                          </div>
                          <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${row.pct}%`, height: '100%', background: color, borderRadius: '3px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Feed */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', marginBottom: '10px' }}>{t.hero.mock.activityTitle}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {t.hero.mock.activities.map((act, idx) => (
                      <div key={act.title} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '9px' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '7px',
                          background: idx === 0 ? '#ECFDF5' : '#EFF6FF',
                          color: idx === 0 ? '#059669' : '#2563EB',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '9px', fontWeight: '800', flexShrink: 0
                        }}>
                          {idx === 0 ? 'AI' : 'PIN'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: '#0F172A', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.title}</div>
                          <div style={{ color: '#64748B', fontSize: '10px' }}>{act.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="hero-floating-badge" style={{
                position: 'absolute',
                bottom: '-14px',
                right: '20px',
                background: '#FFFFFF',
                border: '1px solid #A7F3D0',
                boxShadow: '0 12px 25px -4px rgba(5, 150, 105, 0.2)',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#065F46',
                whiteSpace: 'nowrap'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                {t.hero.mock.badge}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1fr 1.15fr !important; }
        }
        @media (max-width: 768px) {
          .hero-section { padding-top: 90px !important; padding-bottom: 50px !important; }
          .hero-mockup-frame { padding: 14px !important; border-radius: 16px !important; }
          .hero-inner-grid { grid-template-columns: 1fr !important; }
          .hero-floating-badge { display: none !important; }
          .hero-desc { max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .hero-section { padding-top: 80px !important; padding-bottom: 40px !important; }
          .hero-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
          .hero-cta-group { flex-direction: column !important; }
          .hero-trust-bar { font-size: 12px !important; gap: 6px 10px !important; }
          .hero-control-url { display: none !important; }
        }
        @media (max-width: 400px) {
          .hero-section { padding-top: 76px !important; }
          .hero-mockup-frame { padding: 10px !important; }
          .hero-metrics-grid { gap: 5px !important; }
        }
      `}</style>
    </section>
  );
}
