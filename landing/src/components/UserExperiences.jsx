import React from 'react';
import { Building2, GraduationCap, UserCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

export default function UserExperiences({ onOpenDemo }) {
  const experiences = [
    {
      roleBadge: 'UNIVERSITY', target: 'Universitet Admini uchun', title: 'Boshqaruv va Analitika',
      desc: "Universitetdagi barcha o'quv jarayonlarini markazlashtiring, dekanatlarni boshqaring va umumiy ko'rsatkichlarni kuzating.",
      url: 'https://edu-mind-university.vercel.app/login', portalName: 'Universitet Adminiga kirish',
      icon: Building2, accent: '#059669', bg: '#ECFDF5', border: '#A7F3D0',
      features: ["Fakultet va Kafedralar boshqaruvi", "O'qituvchilarni tasdiqlash (KYC)", 'Rektorat BI analitikasi', "Universitet bo'yicha davomat nazorati", 'Akademik faollik monitoringi'],
      snippet: { header: 'Rektorat Boshqaruv Paneli', metric1: "12 Fakultetlar to'liq ulangan", metric2: "92% O'rtacha Davomat", tag: 'Markaziy Nazorat' }
    },
    {
      roleBadge: 'TEACHER', target: "O'qituvchilar uchun", title: "O'qituvchi Ish Stoli",
      desc: "O'qituvchi qimmatli vaqtini qog'ozbozlik va ma'muriy ishlarga emas, talabalar bilan sifatli ta'limga sarflasin.",
      url: 'https://edu-mind-teacher.vercel.app/', portalName: "O'qituvchi Kabinetiga kirish",
      icon: GraduationCap, accent: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
      features: ['AI topshiriqlar yaratish va tekshirish', 'Kriteriyalar asosida avtomatik baholash', 'Akademik guruhlar va materiallar', 'Game PIN orqali Live Classroom', 'Barcha baholar va natijalar jurnali'],
      snippet: { header: "O'qituvchi Ish Muhiti", metric1: 'Gemini AI Baholash: Faol', metric2: 'Live Quiz & Game PIN', tag: 'Avtomatlashtirish' }
    },
    {
      roleBadge: 'STUDENT', target: 'Talabalar uchun', title: 'Talabalar Shaxsiy Portali',
      desc: "Talaba uchun darslar, topshiriqlar, natijalar va 24/7 sun'iy intellekt repetitoridan yordam olishning qulay platformasi.",
      url: 'https://edu-mind-student.vercel.app/', portalName: 'Talabalar Portaliga kirish',
      icon: UserCheck, accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
      features: ['Raqamli topshiriqlar topshirish', "24/7 AI repetitor ko'magi", 'Jonli interaktiv darslarda qatnashish', "Baho va xatolar bo'yicha batafsil fikrlar", 'Guruhdagi shaxsiy reyting'],
      snippet: { header: 'Talaba Shaxsiy Kabineti', metric1: '24/7 Gemini AI Repetitor', metric2: 'Real-time Reyting', tag: "Interaktiv Ta'lim" }
    }
  ];

  const CardItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '22px', padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', height: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 25px 40px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = item.border; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: item.accent, backgroundColor: item.bg, padding: '4px 10px', borderRadius: '7px', border: `1px solid ${item.border}` }}>{item.roleBadge}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textAlign: 'right' }}>{item.target}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: item.bg, border: `1px solid ${item.border}`, color: item.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={22} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{item.title}</h3>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#64748B', marginBottom: '20px' }}>{item.desc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {item.features.map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: '#1E293B', fontWeight: '600' }}>
                <CheckCircle2 size={16} color={item.accent} style={{ flexShrink: 0, marginTop: '1px' }} /><span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '14px 16px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '7px', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{item.snippet.header}</span>
              <span style={{ fontSize: '10px', color: item.accent, background: item.bg, border: `1px solid ${item.border}`, padding: '2px 7px', borderRadius: '5px', fontWeight: '700', flexShrink: 0 }}>{item.snippet.tag}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#64748B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span>Rejim:</span><strong style={{ color: '#0F172A', textAlign: 'right' }}>{item.snippet.metric1}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span>Status:</span><strong style={{ color: item.accent }}>{item.snippet.metric2}</strong></div>
            </div>
          </div>
          <a href={item.url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px 16px', borderRadius: '11px', backgroundColor: item.bg, border: `1px solid ${item.border}`, color: item.accent, fontWeight: '700', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = item.accent; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = item.bg; e.currentTarget.style.color = item.accent; }}>
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
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}><Sparkles size={13} color="#059669" /> FOYDALANUVCHILAR ROLLARI</span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>Har bir rol uchun alohida professional tajriba.</h2>
          <p className="section-subheading">Rektoratdan tortib har bir talabagacha bo'lgan barcha ishtirokchilar uchun maxsus moslashtirilgan qulay va chiroyli interfeys.</p>
        </div>

        {/* Desktop */}
        <div className="cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
          {experiences.map(e => <CardItem key={e.roleBadge} item={e} />)}
        </div>

        {/* Mobile Swiper */}
        <div className="cards-mobile em-swiper-wrapper">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={14} slidesPerView={1.08} className="em-swiper">
            {experiences.map(e => <SwiperSlide key={e.roleBadge}><CardItem item={e} /></SwiperSlide>)}
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
