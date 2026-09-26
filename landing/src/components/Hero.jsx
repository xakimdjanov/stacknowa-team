import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle, Users, GraduationCap, Building2, Layers, Activity, TrendingUp, Sparkles, BookOpen, Check } from 'lucide-react';

export default function Hero({ onOpenDemo }) {
  return (
    <section style={{
      backgroundColor: '#0B1220',
      color: '#FFFFFF',
      paddingTop: '150px',
      paddingBottom: '100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, rgba(11, 18, 32, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)'
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
            <div style={{ marginBottom: '24px' }}>
              <span className="eyebrow-badge">
                <Sparkles size={14} color="#34D399" /> AI-POWERED UNIVERSITY PLATFORM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-heading" style={{ marginBottom: '24px' }}>
              Universitetingiz uchun yagona <span style={{
                background: 'linear-gradient(135deg, #FFFFFF 30%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>AI platforma.</span>
            </h1>

            {/* Supporting Line */}
            <p style={{
              fontSize: 'clamp(17px, 2vw, 20px)',
              lineHeight: '1.6',
              color: '#9CA3AF',
              marginBottom: '36px',
              maxWidth: '620px'
            }}>
              O‘qitish, topshiriqlar, davomat, live darslar, AI baholash va universitet analitikasi — barchasi bitta platformada.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '40px' }}>
              <button onClick={onOpenDemo} className="btn-primary">
                Demo olish <ArrowRight size={18} />
              </button>
              <a href="#qanday-ishlaydi" className="btn-secondary-dark">
                Qanday ishlaydi <ChevronDown size={18} />
              </a>
            </div>

            {/* Trust Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E5E7EB' }}>
                <CheckCircle size={16} color="#34D399" /> Universitet
              </div>
              <span style={{ color: '#374151' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E5E7EB' }}>
                <CheckCircle size={16} color="#34D399" /> O‘qituvchi
              </div>
              <span style={{ color: '#374151' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E5E7EB' }}>
                <CheckCircle size={16} color="#34D399" /> Talaba
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REALISTIC DASHBOARD MOCKUP */}
          <div style={{ position: 'relative' }}>
            {/* Green Glow behind Dashboard */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.22) 0%, rgba(11, 18, 32, 0) 70%)',
              borderRadius: '30px',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            {/* Dashboard Mockup Frame */}
            <div className="glass-card-dark" style={{
              padding: '24px',
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              {/* Mockup Header Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontFamily: 'monospace',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  admin.smartedu.uz / dashboard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34D399' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 8px #34D399' }} /> Live System
                </div>
              </div>

              {/* DASHBOARD TOP METRICS (5 Cards as specified in prompt) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                    <span>Talabalar</span>
                    <Users size={14} color="#34D399" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', marginTop: '4px' }}>24,500</div>
                  <div style={{ fontSize: '10px', color: '#34D399', marginTop: '2px' }}>+12% ushbu semestr</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                    <span>O‘qituvchilar</span>
                    <GraduationCap size={14} color="#60A5FA" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', marginTop: '4px' }}>1,240</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>Faol tasdiqlangan</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                    <span>Davomat</span>
                    <Activity size={14} color="#34D399" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#34D399', marginTop: '4px' }}>92%</div>
                  <div style={{ fontSize: '10px', color: '#34D399', marginTop: '2px' }}>Yuqori davomat</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                    <span>Fakultetlar</span>
                    <Building2 size={14} color="#F59E0B" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', marginTop: '4px' }}>12</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>Tizimga ulangan</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                    <span>Kafedralar</span>
                    <Layers size={14} color="#A78BFA" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', marginTop: '4px' }}>48</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>Boshqaruvda</div>
                </div>
              </div>

              {/* INNER CONTENT GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                {/* Faculty Performance Chart */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB' }}>Fakultetlar Ko‘rsatkichi</h4>
                    <span style={{ fontSize: '11px', color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '4px' }}>AI Reiting</span>
                  </div>

                  {/* Progress bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#D1D5DB', marginBottom: '4px' }}>
                        <span>Axborot Texnologiyalari</span>
                        <span style={{ fontWeight: '700', color: '#34D399' }}>96%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '96%', height: '100%', background: '#34D399', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#D1D5DB', marginBottom: '4px' }}>
                        <span>Moliya va Bank Ishi</span>
                        <span style={{ fontWeight: '700', color: '#34D399' }}>91%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '91%', height: '100%', background: '#34D399', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#D1D5DB', marginBottom: '4px' }}>
                        <span>Muhandislik va Energetika</span>
                        <span style={{ fontWeight: '700', color: '#60A5FA' }}>88%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', background: '#60A5FA', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment & Active Classes Feed */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '12px' }}>Real-time Activity</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>AI</div>
                      <div>
                        <div style={{ color: '#E5E7EB', fontWeight: '600' }}>Topshiriq baholandi</div>
                        <div style={{ color: '#9CA3AF', fontSize: '10px' }}>Gemini AI • Ball: 94/100</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(96,165,250,0.2)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>PIN</div>
                      <div>
                        <div style={{ color: '#E5E7EB', fontWeight: '600' }}>Live Quiz boshlandi</div>
                        <div style={{ color: '#9CA3AF', fontSize: '10px' }}>Guruh 210-20 • 42 talaba</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge overlay */}
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                right: '-15px',
                background: '#131E32',
                border: '1px solid #34D399',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                borderRadius: '12px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#FFF'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399', animation: 'pulse 1.5s infinite' }} />
                AI Integrity Check: 99.8% Aniq
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1fr 1.1fr !important; }
        }
      `}</style>
    </section>
  );
}
