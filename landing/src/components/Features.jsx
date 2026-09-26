import React from 'react';
import { FileCheck, Bot, Video, UserCheck, ShieldCheck, LineChart, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

export default function Features() {
  const featuresList = [
    { title: 'AI Topshiriqlar & Baholash', desc: "Topshiriqlarni avtomatik tuzish, tarqatish va Gemini AI yordamida chuqur tahliliy baholash.", icon: FileCheck, badge: 'Gemini AI Powered' },
    { title: '24/7 AI Repetitor', desc: "Talabaga topshiriqni bajarish jarayonida qadam-baqadam yo'l-yo'riq va akademik maslahat beradi.", icon: Bot, badge: 'Shaxsiy AI Yordamchi' },
    { title: 'Live Classroom & Gamification', desc: "Materiallardan tezkor quiz yaratish, Game PIN orqali darsda ulanish va jonli reyting peshqadamlari.", icon: Video, badge: 'Interaktiv Dars' },
    { title: 'Aqlli Davomat Nazorati', desc: "Live darslarda talabalar ishtirokini avtomatik qayd etish va rektorat uchun shaffof ko'rsatkichlar.", icon: UserCheck, badge: 'Avtomatlashtirilgan' },
    { title: 'Akademik Halollik (Integrity)', desc: "Talaba ishlari o'rtasidagi o'xshashlik, AI generatsiya izlari va plagiatni ko'p bosqichli tekshirish.", icon: ShieldCheck, badge: 'Plagiat & Similarity' },
    { title: 'Universitet BI & Analitika', desc: "Fakultet, kafedra, o'qituvchi va talaba ko'rsatkichlarini real-vaqt rejimida yagona dashboardda ko'rish.", icon: LineChart, badge: 'Rektorat Paneli' },
  ];

  const CardItem = ({ feat }) => {
    const Icon = feat.icon;
    return (
      <div style={{ padding: '26px 22px', backgroundColor: '#fff', borderRadius: '20px', position: 'relative', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', height: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#A7F3D0'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #A7F3D0', flexShrink: 0 }}><Icon size={20} color="#059669" /></div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#047857', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '20px', border: '1px solid #A7F3D0', whiteSpace: 'nowrap' }}>{feat.badge}</span>
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{feat.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748B' }}>{feat.desc}</p>
        <div style={{ position: 'absolute', bottom: 0, left: '28px', right: '28px', height: '2px', background: 'linear-gradient(90deg,transparent,rgba(5,150,105,0.3),transparent)', borderRadius: '2px' }} />
      </div>
    );
  };

  return (
    <section id="imkoniyatlar" style={{ backgroundColor: '#F8FAFC', padding: '90px 0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}><Sparkles size={13} color="#059669" /> PLATFORMA IMKONIYATLARI</span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>Universitetga kerak bo'lgan barcha imkoniyatlar.</h2>
          <p className="section-subheading">O'quv jarayonining har bir bosqichini to'liq raqamlashtiruvchi va zamonaviy AI bilan qurollangan modullar majmuasi.</p>
        </div>

        {/* Desktop Grid */}
        <div className="cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px,1fr))', gap: '18px' }}>
          {featuresList.map(f => <CardItem key={f.title} feat={f} />)}
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.12} className="em-swiper">
            {featuresList.map(f => <SwiperSlide key={f.title}><CardItem feat={f} /></SwiperSlide>)}
          </Swiper>
        </div>
      </div>

      <style>{`
        .cards-mobile { display: none; }
        @media (max-width: 640px) {
          .cards-desktop { display: none !important; }
          .cards-mobile { display: block; }
          #imkoniyatlar { padding: 60px 0 !important; }
        }
      `}</style>
    </section>
  );
}
