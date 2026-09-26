import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Universitet Smart Edu’ga qanday ulanadi?',
      a: 'University Admin universitet uchun Smart Edu muhitini yaratadi va Unique Code orqali o‘qituvchilarni tizimga ulaydi.'
    },
    {
      q: 'O‘qituvchi qanday qo‘shiladi?',
      a: 'O‘qituvchi mustaqil ro‘yxatdan o‘tadi, universitet Unique Code’ini kiritadi va University Admin tomonidan tasdiqlanadi.'
    },
    {
      q: 'Talabalar qanday qo‘shiladi?',
      a: 'Talabalar o‘qituvchi yaratgan group’ga link yoki QR orqali qo‘shiladi. Live eventlar uchun Game PIN ishlatiladi.'
    },
    {
      q: 'Admin nimalarni ko‘ra oladi?',
      a: 'University Admin fakultet, department, teacher, student, attendance, assignment va umumiy activity ko‘rsatkichlarini kuzatishi mumkin.'
    },
    {
      q: 'Smart Edu kimlar uchun?',
      a: 'Universitetlar, o‘qituvchilar va talabalar uchun yagona ta’lim platformasi.'
    },
  ];

  return (
    <section id="faq" style={{
      backgroundColor: '#FFFFFF',
      padding: '110px 0',
      borderBottom: '1px solid #E5E7EB'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            padding: '6px 14px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px',
            border: '1px solid rgba(52, 211, 153, 0.3)'
          }}>
            TUZILMALAR VA XAVFSIZLIK
          </span>
          <h2 className="section-heading" style={{ color: '#111827', marginBottom: '16px' }}>
            Universitetlar ko‘p so‘raydigan savollar.
          </h2>
          <p className="section-subheading">
            Integratsiya, foydalanish va ma’lumotlar xavfsizligi bo‘yicha tez-tez beriladigan savollarga javoblar.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                style={{
                  backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                  border: isOpen ? '1px solid #34D399' : '1px solid #E5E7EB',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 10px 20px -5px rgba(52, 211, 153, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
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
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#34D399' : '#F1F5F9',
                    color: isOpen ? '#0B1220' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#4B5563',
                    borderTop: '1px dashed #E2E8F0',
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
