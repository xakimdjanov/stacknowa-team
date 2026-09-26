import React from 'react';
import { Check, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function Pricing({ onOpenDemo }) {
  const plans = [
    {
      name: 'Starter',
      category: 'Kichik OTMlar',
      audience: '(< 5 000 talaba)',
      price: '12 mln',
      period: 'so‘m / yil',
      popular: false,
      features: [
        'Asosiy funksiyalar',
        'AI savollar (limit)',
        'Davomat va baholash',
        'Email qo‘llab-quvvatlash',
      ],
      buttonText: 'Starter tanlash',
      accentColor: '#059669',
      cardBg: '#FFFFFF',
    },
    {
      name: 'Standart',
      category: 'O‘rta OTMlar',
      audience: '(5 000 – 20 000 talaba)',
      price: '24 mln',
      period: 'so‘m / yil',
      popular: true,
      badge: 'Eng ommabop',
      features: [
        'Barcha asosiy funksiyalar',
        'AI savollar (kengaytirilgan)',
        'Analitika va hisobotlar',
        'Integratsiya (HEMIS va b.)',
        'Texnik qo‘llab-quvvatlash',
      ],
      buttonText: 'Standart tanlash',
      accentColor: '#059669',
      cardBg: '#FFFFFF',
    },
    {
      name: 'Enterprise',
      category: 'Yirik OTMlar',
      audience: '(> 20 000 talaba)',
      price: '36 mln',
      period: 'so‘m / yil',
      popular: false,
      features: [
        'Barcha funksiyalar',
        'Cheksiz AI imkoniyatlar',
        'Maxsus integratsiyalar',
        'Dedicated qo‘llab-quvvatlash',
        'Shaxsiy sozlashlar',
      ],
      buttonText: 'Enterprise bilan bog‘lanish',
      accentColor: '#2563EB',
      cardBg: '#FFFFFF',
    },
  ];

  return (
    <section id="narxlar" style={{
      backgroundColor: '#FFFFFF',
      padding: '110px 0 100px',
      borderBottom: '1px solid #E2E8F0',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span className="eyebrow-badge">
              <Sparkles size={14} color="#059669" /> B2B NARXLASH MODELI
            </span>
          </div>

          <h2 className="section-heading" style={{ marginBottom: '14px' }}>
            Biznes modeli
          </h2>
          <p className="section-subheading" style={{ fontSize: '18px', fontWeight: '500', color: '#475569' }}>
            B2B — Universitetlar uchun yillik obuna asosidagi model
          </p>
        </div>

        {/* FULL WIDTH NARXLASH PAKETLARI (3 TIERS) */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '28px',
          border: '1px solid #E2E8F0',
          padding: '44px 36px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
              Narxlash paketlari
            </h3>
            <p style={{ fontSize: '15px', color: '#64748B' }}>
              OTMlarning o‘lchamiga mos moslashuvchan tariflar
            </p>
          </div>

          {/* 3 TIERS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: plan.cardBg,
                  borderRadius: '22px',
                  border: plan.popular ? '2px solid #059669' : '1px solid #E2E8F0',
                  padding: '36px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: plan.popular
                    ? '0 16px 36px -6px rgba(5, 150, 105, 0.18)'
                    : '0 2px 5px rgba(0, 0, 0, 0.03)',
                  transform: plan.popular ? 'translateY(-6px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = plan.popular ? 'translateY(-6px)' : 'translateY(0)';
                  e.currentTarget.style.boxShadow = plan.popular
                    ? '0 16px 36px -6px rgba(5, 150, 105, 0.18)'
                    : '0 2px 5px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '5px 18px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em'
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: plan.popular ? '#ECFDF5' : '#F1F5F9',
                      border: plan.popular ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                      color: plan.popular ? '#059669' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                        {plan.name}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                        {plan.category} {plan.audience}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                        {plan.price}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#64748B' }}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '34px' }}>
                    {plan.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#334155' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: plan.popular ? '#ECFDF5' : '#F1F5F9',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={onOpenDemo}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: plan.popular ? 'none' : '1px solid #CBD5E1',
                    backgroundColor: plan.popular ? '#059669' : '#FFFFFF',
                    color: plan.popular ? '#FFFFFF' : '#0F172A',
                    boxShadow: plan.popular ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.backgroundColor = '#047857';
                    } else {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#94A3B8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.backgroundColor = '#059669';
                    } else {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }
                  }}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={16} />
                </button>

              </div>
            ))}
          </div>

          {/* Guarantee Note */}
          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#64748B'
          }}>
            <ShieldCheck size={18} color="#059669" />
            <span>Barcha tariflar rasmiy shartnoma, hisob-faktura va kafolatlangan texnik xizmat ko‘rsatish bilan birga taqdim etiladi.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
