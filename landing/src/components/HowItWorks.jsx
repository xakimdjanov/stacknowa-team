import React from 'react';
import { Building2, UserPlus, Users2, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

export default function HowItWorks({ onOpenDemo }) {
  const steps = [
    { step: 'BOSQICH 01', title: 'Universitet ulanadi', desc: 'University Admin tizimda oliygoh profilini yaratadi va dekanatlarni taqsimlaydi.', icon: Building2, accent: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { step: 'BOSQICH 02', title: "O'qituvchilar qo'shiladi", desc: "O'qituvchi universitet Unique Code orqali ro'yxatdan o'tadi va Admin tomonidan tasdiqlanadi.", icon: UserPlus, accent: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { step: 'BOSQICH 03', title: 'Talabalar ulanadi', desc: "O'qituvchi guruh yaratadi. Talabalar taklif havolasi, QR yoki Game PIN orqali bir zumda qo'shiladi.", icon: Users2, accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { step: 'BOSQICH 04', title: "To'liq jarayon boshqariladi", desc: "Topshiriqlar, AI tekshiruv, live darslar, davomat va chuqur analitika bitta tizimda ishlaydi.", icon: Rocket, accent: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  ];

  const CardItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '22px', padding: '28px 20px', position: 'relative', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', height: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = item.border; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: item.bg, border: `1px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Icon size={22} color={item.accent} />
        </div>
        <div style={{ fontSize: '10px', fontWeight: '800', color: item.accent, letterSpacing: '0.05em', marginBottom: '5px' }}>{item.step}</div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{item.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748B' }}>{item.desc}</p>
      </div>
    );
  };

  return (
    <section id="qanday-ishlaydi" style={{ backgroundColor: '#FFFFFF', padding: '90px 0', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}><Sparkles size={13} color="#059669" /> INTEGRATSIYA VA JORIY ETISH</span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>EduMind AI qanday ishlaydi?</h2>
          <p className="section-subheading">Tizimni universitetingizga tatbiq etish va to'liq ishga tushirish 4 ta oddiy va tezkor bosqichdan iborat.</p>
        </div>

        {/* Desktop */}
        <div className="cards-desktop" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '38px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg,#059669 0%,#2563EB 33%,#D97706 66%,#7C3AED 100%)', zIndex: 1, opacity: 0.3 }} className="timeline-line" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '18px', position: 'relative', zIndex: 2 }}>
            {steps.map(s => <CardItem key={s.step} item={s} />)}
          </div>
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.12} className="em-swiper">
            {steps.map(s => <SwiperSlide key={s.step}><CardItem item={s} /></SwiperSlide>)}
          </Swiper>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <button onClick={onOpenDemo} className="btn-secondary-light" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Integratsiya ssenariysini ko'rish <ArrowRight size={15} />
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
