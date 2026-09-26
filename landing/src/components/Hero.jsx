import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle, Users, GraduationCap, Building2, Layers, Activity, TrendingUp, Sparkles, BookOpen, Check } from 'lucide-react';

export default function Hero({ onOpenDemo }) {
  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      paddingTop: '140px',
      paddingBottom: '90px',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid #E2E8F0'
    }}>
      {/* Background Subtle Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(70px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '50px',
          alignItems: 'center'
        }} className="hero-grid">

          {/* LEFT CONTENT */}
          <div>
            {/* Eyebrow */}
            <div style={{ marginBottom: '20px' }}>
              <span className="eyebrow-badge">
                <Sparkles size={14} color="#059669" /> EDUMIND AI • OTM SAAS PLATFORMASI
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-heading" style={{ marginBottom: '22px' }}>
              Universitetingiz uchun yagona <span style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>AI ekotizim.</span>
            </h1>

            {/* Supporting Line */}
            <p style={{
              fontSize: 'clamp(17px, 2vw, 19px)',
              lineHeight: '1.65',
              color: '#475569',
              marginBottom: '34px',
              maxWidth: '620px'
            }}>
              O‘qitish, topshiriqlar, davomat, live darslar, AI baholash va universitet boshqaruvi analitikasi — barchasi bitta professional B2B platformada.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '36px' }}>
              <button onClick={onOpenDemo} className="btn-primary">
                Demo olish <ArrowRight size={18} />
              </button>
              <a href="#narxlar" className="btn-secondary-dark">
                Biznes modeli va narxlar <ChevronDown size={18} />
              </a>
            </div>

            {/* Trust Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                <CheckCircle size={16} color="#059669" /> Rektorat & Dekanat
              </div>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                <CheckCircle size={16} color="#059669" /> O‘qituvchilar
              </div>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                <CheckCircle size={16} color="#059669" /> Talabalar
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REALISTIC LIGHT DASHBOARD MOCKUP */}
          <div style={{ position: 'relative' }}>
            {/* Dashboard Mockup Frame */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              position: 'relative'
            }}>
              {/* Mockup Header Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748B',
                  fontFamily: 'monospace',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '4px 14px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  edumind.uz / admin / dashboard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} /> Live Tizim
                </div>
              </div>

              {/* DASHBOARD TOP METRICS (5 Cards) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
                gap: '10px',
                marginBottom: '18px'
              }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                    <span>Talabalar</span>
                    <Users size={14} color="#059669" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>24,500</div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: '600', marginTop: '2px' }}>+12% semestr</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                    <span>O‘qituvchilar</span>
                    <GraduationCap size={14} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>1,240</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Tasdiqlangan</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                    <span>Davomat</span>
                    <Activity size={14} color="#059669" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>92%</div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: '600', marginTop: '2px' }}>Yuqori faollik</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                    <span>Fakultetlar</span>
                    <Building2 size={14} color="#D97706" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>12</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Tizimda faol</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                    <span>Kafedralar</span>
                    <Layers size={14} color="#7C3AED" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>48</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Boshqaruvda</div>
                </div>
              </div>

              {/* INNER CONTENT GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '14px' }}>
                {/* Faculty Performance Chart */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Fakultetlar Ko‘rsatkichi</h4>
                    <span style={{ fontSize: '11px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>AI Reyting</span>
                  </div>

                  {/* Progress bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '4px', fontWeight: '500' }}>
                        <span>Axborot Texnologiyalari</span>
                        <span style={{ fontWeight: '700', color: '#059669' }}>96%</span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '96%', height: '100%', background: '#059669', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '4px', fontWeight: '500' }}>
                        <span>Iqtisodiyot va Moliya</span>
                        <span style={{ fontWeight: '700', color: '#059669' }}>91%</span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '91%', height: '100%', background: '#059669', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '4px', fontWeight: '500' }}>
                        <span>Muhandislik va Fizika</span>
                        <span style={{ fontWeight: '700', color: '#2563EB' }}>88%</span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', background: '#2563EB', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment & Active Classes Feed */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>Real-time Faollik</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>AI</div>
                      <div>
                        <div style={{ color: '#0F172A', fontWeight: '700' }}>Topshiriq baholandi</div>
                        <div style={{ color: '#64748B', fontSize: '11px' }}>Gemini AI • Ball: 94/100</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>PIN</div>
                      <div>
                        <div style={{ color: '#0F172A', fontWeight: '700' }}>Live Quiz boshlandi</div>
                        <div style={{ color: '#64748B', fontSize: '11px' }}>Guruh 210-20 • 42 talaba</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge overlay */}
              <div style={{
                position: 'absolute',
                bottom: '-16px',
                right: '24px',
                background: '#FFFFFF',
                border: '1px solid #A7F3D0',
                boxShadow: '0 12px 25px -4px rgba(5, 150, 105, 0.2)',
                borderRadius: '12px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#065F46'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                AI Integrity Check: 99.8% Aniq
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1fr 1.15fr !important; }
        }
      `}</style>
    </section>
  );
}
