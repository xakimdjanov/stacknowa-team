import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    name: '',
    role: 'Rektor / Prorektor',
    phone: '',
    email: '',
    studentsCount: '5,000 - 15,000',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(11, 18, 32, 0.85)',
      backdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#0B1220',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(52, 211, 153, 0.15)',
        color: '#FFFFFF'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34D399',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                <Sparkles size={14} /> DEMO TUSHUNTIRISH VA SHAXSIY TAQDIMOT
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: '800', lineHeight: '1.2', color: '#FFF' }}>
                Universitetingiz uchun demo so‘rang
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '6px' }}>
                Smart Edu mutaxassislari 24 soat ichida siz bilan bog‘lanib, platformani universitetingizga moslashtirib ko‘rsatib berishadi.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                  Universitet nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Toshkent Davlat Texnika Universiteti"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#34D399'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                    Ism-sharifingiz *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. Jamshid Karimov"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#34D399'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                    Lavozimingiz *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#131E32',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="Rektor / Prorektor">Rektor / Prorektor</option>
                    <option value="Dekan / Dekan o‘rinbosari">Dekan / Dekan o‘rinbosari</option>
                    <option value="Kafedra mudiri">Kafedra mudiri</option>
                    <option value="IT va Raqamlashtirish bo‘limi">IT & Raqamlashtirish bo‘limi</option>
                    <option value="O‘qituvchi / Professor">O‘qituvchi / Professor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#34D399'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                    Talabalar soni
                  </label>
                  <select
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#131E32',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="1,000 tagacha">1,000 tagacha</option>
                    <option value="1,000 - 5,000">1,000 - 5,000</option>
                    <option value="5,000 - 15,000">5,000 - 15,000</option>
                    <option value="15,000 - 30,000">15,000 - 30,000</option>
                    <option value="30,000+">30,000 dan ortiq</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                  Ishchi Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rektorat@tstu.uz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#34D399'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px', padding: '14px', borderRadius: '10px' }}
              >
                <Send size={18} /> Ariqsa Yuborish & Demo Olish
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>
                <ShieldCheck size={14} color="#34D399" /> Maxfiylik va ma'lumotlar xavfsizligi каfolatlanadi
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              border: '2px solid #34D399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#34D399'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: '#FFF' }}>
              Arizangiz qabul qilindi!
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Hurmatli {formData.name}, sizning <strong>{formData.university}</strong> bo‘yicha demo so‘rovingiz mutaxassislarimizga yuborildi. Tez orada siz kiritgan telefon raqami ({formData.phone}) orqali bog‘lanamiz.
            </p>
            <button
              onClick={handleReset}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
            >
              Yopish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
