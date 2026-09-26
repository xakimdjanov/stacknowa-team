import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send, Loader2 } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    name: '',
    role: 'Rektor / Prorektor',
    phone: '',
    studentsCount: '5,000 - 20,000 talaba',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8839058283:AAEUXZ4nelpC-AHm2U3e0FSsnnc6DVoKSmE';
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '6519831069';

    const messageText = 
      `🎓 <b>Yangi Demo So‘rovi — EduMind AI</b>\n\n` +
      `🏛 <b>Universitet:</b> ${formData.university}\n` +
      `👤 <b>Ism-sharifi:</b> ${formData.name}\n` +
      `💼 <b>Lavozimi:</b> ${formData.role}\n` +
      `📞 <b>Telefon:</b> ${formData.phone}\n` +
      `👥 <b>Talabalar hajmi:</b> ${formData.studentsCount}\n\n` +
      `⏰ <b>Yuborilgan vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        console.warn('Telegram API javobi:', data);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Telegramga yuborishda xatolik:', err);
      // Agar tarmoqda xatolik bo'lsa ham foydalanuvchini to'xtatmaymiz
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      university: '',
      name: '',
      role: 'Rektor / Prorektor',
      phone: '',
      studentsCount: '5,000 - 20,000 talaba',
    });
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
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.25)',
        color: '#0F172A'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.background = '#E2E8F0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#F1F5F9'; }}
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
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                <Sparkles size={14} /> DEMO TAQDIMOT VA KONSALTING
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: '800', lineHeight: '1.2', color: '#0F172A' }}>
                Universitetingiz uchun demo oling
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>
                EduMind AI mutaxassislari 24 soat ichida siz bilan bog‘lanib, platformani oliygohingizga moslashtirib ko‘rsatib berishadi.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
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
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                    Lavozimingiz *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
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
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                    Talabalar soni
                  </label>
                  <select
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="< 5,000 talaba">&lt; 5,000 talaba (Starter)</option>
                    <option value="5,000 - 20,000 talaba">5,000 - 20,000 talaba (Standart)</option>
                    <option value="> 20,000 talaba">&gt; 20,000 talaba (Enterprise)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '14px',
                  borderRadius: '10px',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Ariza Yuborish & Demo Olish
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
                <ShieldCheck size={15} color="#059669" /> Maxfiylik va ma’lumotlar xavfsizligi kafolatlanadi
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#059669'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: '#0F172A' }}>
              Arizangiz muvaffaqiyatli qabul qilindi!
            </h3>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Hurmatli {formData.name}, sizning <strong>{formData.university}</strong> bo‘yicha demo so‘rovingiz qabul qilindi va mutaxassislarimizga yuborildi. Tez orada siz bilan <strong>{formData.phone}</strong> raqami orqali bog‘lanamiz.
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
