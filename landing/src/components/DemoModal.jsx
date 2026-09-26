import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DemoModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    name: '',
    role: t.modal.roles[0],
    phone: '',
    studentsCount: t.modal.studentOptions[1],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8839058283:AAEUXZ4nelpC-AHm2U3e0FSsnnc6DVoKSmE';
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '6519831069';

    const messageText = 
      `🎓 <b>Yangi Demo So'rovi — EduMind AI</b>\n\n` +
      `🏛 <b>Universitet:</b> ${formData.university}\n` +
      `👤 <b>Ism-sharifi:</b> ${formData.name}\n` +
      `💼 <b>Lavozimi:</b> ${formData.role}\n` +
      `📞 <b>Telefon:</b> ${formData.phone}\n` +
      `👥 <b>Talabalar hajmi:</b> ${formData.studentsCount}\n\n` +
      `⏰ <b>Yuborilgan vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
        }),
      });
      const data = await res.json();
      if (!data.ok) console.warn('Telegram API:', data);
      setSubmitted(true);
    } catch (err) {
      console.error('Telegramga yuborishda xatolik:', err);
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
      role: t.modal.roles[0],
      phone: '',
      studentsCount: t.modal.studentOptions[1],
    });
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    color: '#0F172A',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '22px',
        padding: '28px 24px',
        boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.25)',
        color: '#0F172A',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.background = '#E2E8F0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#F1F5F9'; }}
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div style={{ marginBottom: '20px', paddingRight: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                fontSize: '11px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                <Sparkles size={12} /> {t.modal.eyebrow}
              </div>
              <h3 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '800', lineHeight: '1.2', color: '#0F172A' }}>
                {t.modal.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}>
                {t.modal.desc}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E293B', marginBottom: '5px' }}>
                  {t.modal.fields.university}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.modal.fields.universityPh}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>

              <div className="modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E293B', marginBottom: '5px' }}>
                    {t.modal.fields.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.modal.fields.namePh}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E293B', marginBottom: '5px' }}>
                    {t.modal.fields.role}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ ...inputStyle }}
                  >
                    {t.modal.roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E293B', marginBottom: '5px' }}>
                    {t.modal.fields.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.modal.fields.phonePh}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E293B', marginBottom: '5px' }}>
                    {t.modal.fields.students}
                  </label>
                  <select
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                    style={{ ...inputStyle }}
                  >
                    {t.modal.studentOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '13px',
                  borderRadius: '10px',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={17} className="animate-spin" /> {t.modal.submitting}</>
                ) : (
                  <><Send size={17} /> {t.modal.submit}</>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748B', fontSize: '12px' }}>
                <ShieldCheck size={14} color="#059669" /> {t.modal.privacy}
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: '#059669'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: '800', marginBottom: '10px', color: '#0F172A' }}>
              {t.modal.successTitle}
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '22px' }}>
              {t.modal.successDesc(formData.name, formData.university, formData.phone)}
            </p>
            <button
              onClick={handleReset}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
            >
              {t.modal.close}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .modal-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
