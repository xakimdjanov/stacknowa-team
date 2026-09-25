import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Server,
  ShieldCheck,
  Key,
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Lock,
  Cpu,
  HardDrive,
  Zap,
  ChevronRight,
  Info,
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

/* ─── Integration Card ───────────────────── */
const IntegrationCard = ({ icon: Icon, name, description, status, statusLabel, color, details }) => {
  const statusStyles = {
    active:    { bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.2)',  color: '#059669', icon: CheckCircle2, label: statusLabel || 'Ulangan'    },
    ready:     { bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)', color: '#0d9488', icon: CheckCircle2, label: statusLabel || 'Tayyor'      },
    warning:   { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#d97706', icon: AlertCircle,  label: statusLabel || 'Tekshiring'  },
    inactive:  { bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.2)',color: '#64748b', icon: Clock,        label: statusLabel || 'Nofaol'      },
  };
  const s = statusStyles[status] || statusStyles.ready;
  const StatusIcon = s.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}12`, border: `1px solid ${color}22` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-800">{name}</h3>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
            >
              <StatusIcon className="w-2.5 h-2.5" />
              {s.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{description}</p>
          {details && (
            <p className="text-[11px] font-mono text-slate-600 mt-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md inline-block font-semibold">
              {details}
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-slate-500 transition-colors mt-1" />
      </div>
    </div>
  );
};

/* ─── Info Row ───────────────────────────── */
const InfoRow = ({ label, value, mono = false }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <span className={`text-xs font-bold text-slate-700 ${mono ? 'font-mono bg-slate-100 px-2 py-0.5 rounded-md text-[11px]' : ''}`}>
      {value}
    </span>
  </div>
);

/* ─── Section ────────────────────────────── */
const Section = ({ title, icon: Icon, color = '#059669', children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">{title}</h2>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Tizim Sozlamalari
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Server konfiguratsiyasi, integratsiyalar va tizim holati.
            </p>
          </div>

          {/* System status chip */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-2 self-start sm:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-800">Barcha tizimlar faol</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5 sm:py-6 space-y-6 sm:space-y-8">

        {/* 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Integrations (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            <Section title="Ma'lumotlar Bazasi" icon={Database} color="#059669">
              <IntegrationCard
                icon={Database}
                name="PostgreSQL 15"
                description="Asosiy relational ma'lumotlar bazasi (Sequelize ORM orqali ulangan)"
                status="active"
                statusLabel="Ulangan"
                color="#059669"
                details="postgres://localhost:5432/stacknowa"
              />
            </Section>

            <Section title="Sun'iy Intellekt Tizimlari" icon={Sparkles} color="#0d9488">
              <IntegrationCard
                icon={Sparkles}
                name="Google Gemini 2.5 Flash"
                description="Talabalar topshiriqlarini avtomatik tekshirish, ballash va tahlil qilish"
                status="active"
                statusLabel="API Kalit Faol"
                color="#0d9488"
                details="GEMINI_API_KEY · Active"
              />
              <IntegrationCard
                icon={Zap}
                name="Plagiat Detektori (Gemini AI)"
                description="Semantik o'xshashlikni baholash va kod nusxalashni aniqlash tizimi"
                status="ready"
                statusLabel="Tayyor"
                color="#059669"
                details="AI Practice Plagiarism Engine v2"
              />
            </Section>

            <Section title="To'lov Tizimi" icon={Cpu} color="#0284c7">
              <IntegrationCard
                icon={Cpu}
                name="inPAY To'lov Gateway"
                description="Uzcard, Humo va xalqaro kartalar orqali PRO obunalarni qabul qilish"
                status="ready"
                statusLabel="Konfiguratsiya qilingan"
                color="#0284c7"
                details="INPAY_API_KEY · Merchant ID: active"
              />
            </Section>

            <Section title="Xavfsizlik & Autentifikatsiya" icon={ShieldCheck} color="#059669">
              <IntegrationCard
                icon={Lock}
                name="JWT Autentifikatsiya"
                description="Bearer token asosida RBAC (Admin, Teacher, Student) huquq tizimi"
                status="active"
                statusLabel="Himoyalangan"
                color="#059669"
                details="HS256 · 7d expiry"
              />
              <IntegrationCard
                icon={Globe}
                name="CORS & Rate Limiting"
                description="Cross-origin so'rovlar va API so'rovlar chastotasini nazorat qilish"
                status="active"
                statusLabel="Yoqilgan"
                color="#0d9488"
              />
            </Section>
          </div>

          {/* Right — Info panels (1/3) */}
          <div className="space-y-4">

            {/* Admin info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <SettingsIcon className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Admin Ma'lumotlari</h3>
              </div>

              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                  style={{ background: EMERALD_GRADIENT }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-slate-400 truncate font-medium">{user?.email}</p>
                </div>
              </div>

              <div>
                <InfoRow label="Roli" value="ADMIN" />
                <InfoRow label="Tarif" value={user?.plan_type || 'PRO'} />
                <InfoRow label="Holat" value="✅ Faol" />
              </div>
            </div>

            {/* System info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Server Ma'lumotlari</h3>
              </div>
              <InfoRow label="Backend port" value="5000" mono />
              <InfoRow label="Admin panel" value="3000" mono />
              <InfoRow label="Teacher panel" value="3001" mono />
              <InfoRow label="Runtime" value="Node.js + Express" />
              <InfoRow label="ORM" value="Sequelize v6" />
              <InfoRow label="Versiya" value="v1.0.0" mono />
            </div>

            {/* Stack info */}
            <div
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{ background: EMERALD_GRADIENT, boxShadow: '0 4px 16px rgba(5,150,105,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-emerald-200" />
                <h3 className="text-sm font-bold">Tech Stack</h3>
              </div>
              {[
                'React 18 + Vite',
                'TailwindCSS',
                'Express.js',
                'PostgreSQL 15',
                'Sequelize ORM',
                'Google Gemini AI',
                'JWT Auth',
                'inPAY Gateway',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                  <span className="text-xs text-emerald-50 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div
              className="rounded-2xl p-4 flex gap-3 bg-amber-50/60 border border-amber-200/60"
            >
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Sozlamalarni o'zgartirish uchun server <strong>.env</strong> faylini tahrirlang va backendni qayta ishga tushiring.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
