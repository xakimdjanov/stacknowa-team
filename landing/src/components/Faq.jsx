import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Universitet EduMind AI tizimiga qanday ulanadi?',
      a: 'University Admin tizimda ro‘yxatdan o‘tib, universitet tashkiliy tuzilmasini yaratadi va generatsiya qilingan Unique Code orqali o‘qituvchi va xodimlarni tizimga ulaydi.'
    },
    {
      q: 'O‘qituvchilar tizimga qanday qo‘shiladi?',
      a: 'O‘qituvchi mustaqil ro‘yxatdan o‘tib, o‘zining universitet Unique Code kodini kiritadi. Rektorat yoki Dekanat Admini tasdiqlagach, barcha funksiyalar faollashadi.'
    },
    {
      q: 'HEMIS va boshqa davlat tizimlari bilan integratsiya bormi?',
      a: 'Ha, EduMind AI O‘zbekiston OTMlarida amalda bo‘lgan HEMIS axborot tizimi va boshqa ma’lumotlar bazalari bilan API orqali to‘liq integratsiya qilinadi.'
    },
    {
      q: 'Talabalar dars va quizlarga qanday kirishadi?',
      a: 'Talabalar o‘qituvchi yuborgan havola, QR-kod yoki real-vaqt rejimida doskada ko‘rsatiladigan 6 xonali Game PIN orqali hech qanday qiyinchiliksiz ulanishadi.'
    },
    {
      q: 'AI baholash qanchalik xolis va aniq ishlaydi?',
      a: 'Gemini AI baholash modeli o‘qituvchi belgilagan rubrika va mezonlar asosida javoblarni tahlil qiladi, plagiat va o‘xshashlikni aniqlaydi hamda har bir talabaga shaxsiy izoh va ball taqdim etadi.'
    },
    {
      q: 'Universitet ma’lumotlari xavfsizligi qanday ta’minlanadi?',
      a: 'Tizim bank darajasidagi shifrlash (AES-256 va TLS 1.3) protokollaridan foydalanadi. OTM ma’lumotlari himoyalangan mahalliy server infratuzilmasida saqlanadi.'
    },
  ];

  return (
    <section id="faq" style={{
      backgroundColor: '#F8FAFC',
      padding: '110px 0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> SAVOLLAR VA XAVFSIZLIK
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Ko‘p beriladigan savollar
          </h2>
          <p className="section-subheading">
            EduMind AI integratsiyasi, foydalanish tartibi va ma’lumotlar xavfsizligi bo‘yicha muhim savollarga javoblar.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isOpen ? '1px solid #059669' : '1px solid #E2E8F0',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 10px 25px -5px rgba(5, 150, 105, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.02)'
                }}
              >
                {/* Question Row */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '22px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                    gap: '16px'
                  }}
                >
                  <span style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A', lineHeight: '1.4' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#ECFDF5' : '#F1F5F9',
                    border: isOpen ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                    color: isOpen ? '#059669' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div style={{
                    padding: '0 28px 24px 28px',
                    fontSize: '15px',
                    lineHeight: '1.65',
                    color: '#475569',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '16px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
