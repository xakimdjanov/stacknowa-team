# StackNowa Team — AI Practice Platform 🎓⚡

> **Universitet va professional ta'lim muassasalarida talabalarning amaliy mashg'ulotlarini raqamlashtirish, 8 betlik rasmiy kitobcha hisobotlarini yaratish va Google Gemini AI yordamida avtomatlashtirilgan baholash platformasi.**

---

## 📌 Loyiha Haqida (Project Overview)

**StackNowa** — oliy ta'lim muassasalarida o'qituvchi va talaba o'rtasidagi amaliy ishlarni topshirish jarayonini tubdan yangilovchi aqlli ta'lim ekotizimi. Talabalar qog'oz daftarlarga yoki noqulay hujjatlarga vaqt sarflamasdan, to'g'ridan-to'g'ri brauzerda **8 betlik rasmiy standartdagi raqamli kitobcha** (Digital WhitePaper) yozishadi. O'qituvchilar topshiriqlarni shablon fayllar bilan e'lon qiladi, **Google Gemini AI** esa topshirilgan hisobotni mezonlar, nazariya, amaliy hisob-kitoblar, neyrotarmoq yozuvi (AI-writing) va o'xshashlik bo'yicha tahlil qilib, lahzada ob'ektiv baholaydi.

---

## 🏗 Ekotizim Arxitekturasi (Architecture)

Loyiha mikroxizmatlar va mustaqil portallardan tashkil topgan:

```
stacknowa-team/
├── backend/          # Node.js + Express + PostgreSQL + Gemini AI + AWS S3 + InPay API (Port 5000)
├── teacher/          # O'qituvchi portali (React + Vite + Tailwind CSS) (Port 3001)
├── student/          # Talaba portali (React + Vite + Tailwind CSS) (Port 3002)
├── admin/            # Super Admin Platforma boshqaruv paneli (React + Vite) (Port 3000)
├── university/       # Universitet Admin Portali & Billing (React + Vite + Tailwind CSS) (Port 3003)
└── README.md
```

---

## ✨ Asosiy Imkoniyatlar (Key Features)

### 1. 📖 8 Betlik Raqamli Daftarcha (Digital WhitePaper & Book Viewer)
- **Rasmiy A4 Kitobcha Tuzilishi**:
  - **1-bet**: OTM, Kafedra, Fan, Mavzu, Talaba va O'qituvchi rekvizitlari bilan rasmiy Titul varaqasi.
  - **2-bet**: Mundarija va amaliy ish rejasi.
  - **3-bet**: Kirish, ishning maqsadi va domlaning talablari.
  - **4-bet**: 1-Bob. Nazariy asoslar, formulalar va qoidalar.
  - **5-bet**: 2-Bob. Amaliy tajriba, hisob-kitoblar va parametrlar jadvali.
  - **6-bet**: 3-Bob. Dastur kodi / algoritm fragmenti (JetBrains Mono sintaksisi).
  - **7-bet**: 4-Bob. Natijalar, diagrammalar va AWS S3 skrinshotlari.
  - **8-bet**: Xulosa, tavsiyalar va foydalanilgan adabiyotlar.
- **Interaktiv Varaqlanuvchi Kitobcha (`BookViewer`)**:
  - Haqiqiy 2 betlik varaqlanuvchi kitobcha (`Booklet`) rejimi.
  - Old muqova, tabiiy sahifa soyalari va o'rtadagi chok (spine) effekti.
  - Yakka sahifa (`Single`) va ketma-ket (`Continuous`) o'qish rejimlari.
  - Klaviatura strelkalari (`←` / `→`), zoom va to'liq ekran rejimi.
- **Erkin Matn va Rasm Muharriri**:
  - Sahifaning xohlagan joyiga kursor qo'yib yozish (`min-h-[850px] cursor-text`).
  - **Rasm Rejimi (Image Mode)**: Sahifaning istalgan nuqtasiga bosish orqali rasm joylashtirish.
  - **Burchagidan tortish (Corner Drag Handle)**: Rasmni xuddi Word dasturidagi kabi chekkasidan ushlab kattalashtirish va kichraytirish.
  - **Clipboard & Drag-Drop**: Ctrl+V yoki sudrab tashlash orqali AWS S3 ga tezkor yuklash.
  - Sahifalarni o'chirishda erkinlik (kamida 1 ta qolishi kerak), lekin topshirishda kamida 7 ta bet bo'lishi qat'iy nazorat qilinadi.

### 2. 🤖 Google Gemini AI Baholash Tizimi
- **Ko'p Bosqichli Fallback Tizimi**: `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3.5-flash`, `gemini-3.8-flash` modellarini avtomatik zanjirli qo'llab-quvvatlaydi.
- **Rubrika Mezonlari**: Har bir bo'lim (Kirish, Nazariya, Amaliyot, Xulosa) bo'yicha mustaqil ballar, foizli ko'rsatkich va AI tahliliy sharhi.
- **O'qituvchi va AI Tavsiyalari**: Ishning kuchli va zaif jihatlarini ko'rsatuvchi raqamlangan aniq maslahatlar.
- **PRO Tahlillar**:
  - **O'xshashlik (Similarity Check)**: Guruh ichidagi talabalar ishlari bilan solishtirish.
  - **Neyrotarmoq Yozuvi (AI-Writing Detection)**: Matnning AI tomonidan yozilganlik ehtimoli va indikatorlari.

### 3. 📊 Guruh Batafsil Statistikasi va Monitoringi (`/groups/:id`)
- O'qituvchi uchun har bir guruh bo'yicha maxsus kengaytirilgan monitoring sahifasi:
  - **5 ta KPI Metrikasi**: Jami talabalar, faol topshiriqlar, topshirish nisbati (progress-bar bilan), o'rtacha/min/max ball, AI tahlil ko'rsatkichlari.
  - **Baholar Taqsimoti (Grade Distribution)**: A'lo (86-100), Yaxshi (71-85), Qoniqarli (55-70), Qoniqarsiz (0-54) natijalarning grafik vizualizatsiyasi.
  - **Talabalar Natijalari Matritsasi**: Qidiruv, saralash va filtrlar (*Barchasi*, *Topshirganlar*, *Qaytarilganlar*, *Topshirmaganlar*).
  - **Tezkor Harakatlar**: Talaba hisobotini **"📖 Kitobcha"** formatida o'qish va **"↩ Qaytarish"** orqali kamchiliklarni bildirib qayta ishlashga yuborish.

### 4. ↩ Qayta Topshirish Tizimi (Revision & Resubmit Workflow)
- O'qituvchi talabaning amaliy ishida kamchilik topsa, izoh yozib ishni qaytara oladi.
- Talaba portalida sariq ogohlantirish chiqadi, talaba o'zining daftarchasiga kirib xatolarni to'g'rilaydi va **"Qayta Topshirish"** tugmasi orqali yangilangan variantni AI baholashiga qayta topshiradi.

### 5. ☁️ AWS S3 / Cloudflare R2 & InPay To'lov Tizimi
- O'qituvchi yuklagan shablon hujjatlar (DOCX, PDF) va talaba biriktirgan barcha rasmlar AWS S3 bulutli xotirasiga xavfsiz yuklanadi.
- InPay to'lov shlyuzi integratsiyasi (O'zbekiston bank kartalari: Uzcard / Humo orqali PRO tarifga obuna bo'lish).

---

## 🛠 Texnologiyalar Steki (Tech Stack)

| Bo'lim | Texnologiyalar |
|---|---|
| **Backend** | Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, Axios, Multer |
| **AI Engine** | Google Gemini API (REST v1beta, multi-model fallback pipeline) |
| **Cloud Storage** | AWS SDK (S3 Buckets) / Cloudflare R2 |
| **To'lov Tizimi** | InPay Payment Gateway API |
| **Frontend Portallar** | React 18, Vite, Tailwind CSS, Lucide Icons, QRcode.react |
| **Interaktiv UI** | ContentEditable DOM Sync, Custom Booklet Engine, Modal Framework |

---

## 🚀 O'rnatish va Ishga Tushirish (Quick Start)

### 1. Repozitoriyani yuklab olish
```bash
git clone https://github.com/xakimdjanov/stacknowa-team.git
cd stacknowa-team
```

### 2. Backend Serverini Sozlash va Ishga Tushirish
```bash
cd backend
npm install

# .env faylini yaratish
cp .env.example .env
# .env faylidagi DB, AWS va GEMINI_API_KEY parametrlarini to'ldiring

# Ma'lumotlar bazasi va dastlabki ma'lumotlarni yaratish
node seed.js

# Serverni ishga tushirish (Port 5000)
npm run dev
```

### 3. O'qituvchi (Teacher) Portalini Ishga Tushirish
```bash
cd ../teacher
npm install
npm run dev
# Manzil: http://localhost:3001
```

### 4. Talaba (Student) Portalini Ishga Tushirish
```bash
cd ../student
npm install
npm run dev
# Manzil: http://localhost:3002
```

### 5. Admin Portalini Ishga Tushirish
```bash
cd ../admin
npm install
npm run dev
# Manzil: http://localhost:3000
```

---

## 🌐 Portallar Manzillari

- **Backend API**: `http://localhost:5000`
- **Talaba Portali**: `http://localhost:3002`
- **O'qituvchi Portali**: `http://localhost:3001`
- **Admin Portali**: `http://localhost:3000`

---

## 👥 StackNowa Jamoasi (Team)

Loyihani yaratuvchi va ishlab chiquvchilar:
- **StackNowa Team** — Talabalarga zamonaviy, qulay va intellektual raqamli ta'lim vositalarini taqdim etish maqsadida yaratilgan.

---

## 📄 Litsenziya (License)

Ushbu loyiha ochiq kodli bo'lib, **MIT License** ostida tarqatiladi.
