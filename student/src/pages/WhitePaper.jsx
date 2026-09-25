import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  FileText, 
  Save, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Paperclip, 
  ArrowLeft, 
  ExternalLink,
  Code,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Eye,
  Award,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Undo,
  Redo,
  Printer,
  LayoutTemplate,
  Palette,
  Highlighter,
  Minus,
  Check,
  Plus,
  BookOpen,
  Layers,
  Columns,
  Maximize2,
  ChevronDown,
  Camera,
  UploadCloud
} from 'lucide-react';

const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '');
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getFileNameFromUrl = (url) => {
  if (!url) return 'Fayl';
  try {
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return 'Shablon fayl';
  }
};

// UNCONTROLLED CONTENTEDITABLE COMPONENT TO PREVENT REVERSE TYPING (SALOM -> MOLAS BUG)
const EditablePage = React.memo(({
  initialHtml,
  onHtmlChange,
  onClick,
  onKeyUp,
  onMouseUp,
  onDrop,
  onDragOver,
  onPaste,
  editorRef,
  isImageMode,
}) => {
  const localRef = useRef(null);

  useEffect(() => {
    if (localRef.current && initialHtml !== undefined) {
      if (document.activeElement !== localRef.current && localRef.current.innerHTML !== initialHtml) {
        localRef.current.innerHTML = initialHtml || '';
      }
    }
  }, [initialHtml]);

  return (
    <div
      ref={(el) => {
        localRef.current = el;
        if (editorRef) editorRef.current = el;
        if (el && !el.dataset.inited && initialHtml) {
          el.innerHTML = initialHtml;
          el.dataset.inited = 'true';
        }
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        onHtmlChange(e.currentTarget.innerHTML);
      }}
      onClick={(e) => {
        onClick?.(e);
        // Sahifaning istalgan bo'sh joyi bosilganda kursorni o'sha nuqtaga tushirish
        if (e.target === localRef.current && document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (range) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }}
      onKeyUp={onKeyUp}
      onMouseUp={onMouseUp}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onPaste={onPaste}
      className={`outline-none flex-1 min-h-[850px] cursor-text text-slate-900 text-[12pt] leading-[1.7] focus:outline-none transition-colors ${
        isImageMode ? 'cursor-crosshair bg-blue-50/15 ring-1 ring-blue-300 rounded' : ''
      }`}
      style={{
        fontFamily: "'Times New Roman', Georgia, serif",
        wordBreak: 'break-word',
      }}
    />
  );
});

const WhitePaper = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  // 8 TA ALOHIDA A4 BETLARDAN IBORAT KITOBCHA PAGES ARRAY
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Ko'rinish rejimi: 'continuous' (ketma-ket A4) yoki 'book' (yonma-yon kitobcha 2 bet)
  const [viewMode, setViewMode] = useState('continuous');

  // Rasm rejimi: faol bo'lsa sahifaning xohlagan joyiga bosib rasm yuklash mumkin
  const [imageMode, setImageMode] = useState(false);

  // Tanlangan rasm ma'lumotlari (chekasidan tortib o'lchamini o'zgartirish uchun)
  const [selectedImgInfo, setSelectedImgInfo] = useState(null);

  // Domla shablonini chiqarish va tasdiqlash modali
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Statuses
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Statistics
  const [wordCount, setWordCount] = useState(0);

  // Refs for scrolling, editable areas, and cursor range
  const pageRefs = useRef([]);
  const editorRefs = useRef([]);
  const pagesRef = useRef(pages);
  const savedRangeRef = useRef(null);
  const fileInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    fetchAssignmentDetail();
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [assignmentId]);

  // Topshiriq tafsilotlarini olish
  const fetchAssignmentDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/assignments/${assignmentId}`);
      const assign = res.data.assignment;
      setAssignment(assign);

      // Agar talabaning avvalgi submissioni bo'lsa
      if (res.data.my_submission) {
        const sub = res.data.my_submission;
        setSubmission(sub);
        if (sub.content) {
          try {
            const parsed = typeof sub.content === 'string' ? JSON.parse(sub.content) : sub.content;
            if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
              setPages(parsed.pages);
              calculateWordCount(parsed.pages);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Agar hali yozilmagan bo'lsa, domlaning ma'lumotlari asosida default 8 betlik kitobchani yuklaymiz
      initDefault8Pages(assign);
    } catch (err) {
      console.error(err);
      setErrorMessage("Topshiriq ma'lumotlarini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // 8 ta betdan iborat standart kitobcha shablonini generatsiya qilish
  const generate8PagesData = (assign) => {
    const today = new Date().toLocaleDateString('uz-UZ');
    const groupName = assign?.group?.name || 'Guruh';
    const subject = assign?.group?.subject || 'Fan';
    const teacherName = assign?.group?.teacher?.name || 'O\'qituvchi';
    const assignmentTitle = assign?.title || 'Amaliy Mashg\'ulot';
    const teacherDescription = assign?.description || 'Topshiriq talablariga muvofiq amaliy ishlarni bajaring.';
    const templateFile = assign?.template_file_url;
    const rubricList = assign?.rubric || [];

    return [
      // 1-BET: RASMIY TITUL VARAG'I (COVER PAGE)
      {
        id: 1,
        title: "1-bet: Rasmiy Titul",
        html: `
          <div style="text-align: center; margin-top: 40px; margin-bottom: 50px;">
            <h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; color: #334155; letter-spacing: 0.5px;">O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI</h3>
            <h4 style="margin: 6px 0 0 0; font-size: 12pt; color: #475569;">AXBOROT TEXNOLOGIYALARI VA AMALIY TIZIMLAR KAFEDRASI</h4>
          </div>

          <div style="text-align: center; margin: 90px 0 70px 0;">
            <p style="font-size: 13pt; font-weight: bold; color: #2563eb; text-transform: uppercase; margin-bottom: 8px;">"${subject}" FANI</p>
            <h1 style="font-size: 24pt; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3;">${assignmentTitle}</h1>
            <h3 style="font-size: 14pt; font-weight: 600; color: #64748b; margin: 0;">AMALIY MASHG'ULOT HISOBOTI</h3>
          </div>

          <div style="margin: 100px 40px 80px auto; max-width: 380px; font-size: 12pt; line-height: 1.8;">
            <p style="margin: 0;"><strong>Bajardi (Talaba):</strong> _________________</p>
            <p style="margin: 0;"><strong>Guruh:</strong> ${groupName}</p>
            <p style="margin: 0;"><strong>Qabul qildi:</strong> ${teacherName}</p>
            <p style="margin: 0;"><strong>Maksimal ball:</strong> ${assign?.max_score || 100} ball</p>
          </div>

          <div style="text-align: center; margin-top: 100px; border-top: 1px solid #cbd5e1; padding-top: 20px; font-size: 11pt; color: #64748b;">
            Toshkent — 2026-yil
          </div>
        `
      },

      // 2-BET: MUNDARIJA (REJA)
      {
        id: 2,
        title: "2-bet: Mundarija (Reja)",
        html: `
          <h2 style="text-align: center; color: #1e293b; font-size: 18pt; margin-bottom: 30px; text-transform: uppercase; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Mundarija (Amaliy Ish Rejasi)</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 12pt; margin-top: 20px;">
            <tbody>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">KIRISH VA ISHNING MAQSADI</td>
                <td style="text-align: right; font-weight: bold;">3-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">1-BOB. NAZARIY ASOSLAR VA ASOSIY QOIDALAR</td>
                <td style="text-align: right; font-weight: bold;">4-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="padding-left: 20px; color: #475569;">1.1. Mavzuga oid asosiy tushunchalar va formulalar</td>
                <td style="text-align: right; color: #475569;">4-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">2-BOB. AMALIY QISM VA HISOB-KITOBLAR</td>
                <td style="text-align: right; font-weight: bold;">5-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="padding-left: 20px; color: #475569;">2.1. Qadamlar ketma-ketligi va hisoblash jadvali</td>
                <td style="text-align: right; color: #475569;">5-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">3-BOB. DASTUR KODI YOKI ALGORITM FRAGMENTI</td>
                <td style="text-align: right; font-weight: bold;">6-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">4-BOB. NATIJALAR VA ILUSTRATSIYALAR</td>
                <td style="text-align: right; font-weight: bold;">7-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">XULOSA VA TAVSIYALAR</td>
                <td style="text-align: right; font-weight: bold;">8-bet</td>
              </tr>
              <tr style="border-bottom: 1px dotted #94a3b8; height: 38px;">
                <td style="font-weight: bold;">FOYDALANILGAN ADABIYOTLAR</td>
                <td style="text-align: right; font-weight: bold;">8-bet</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 60px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <p style="margin: 0; font-size: 11pt; color: #334155;">
              <strong>Eslatma:</strong> Mundarija qismini topshirig'ingiz rejasiga mos ravishda erkin o'zgartirishingiz va qo'shimcha bo'limlar kiritishingiz mumkin.
            </p>
          </div>
        `
      },

      // 3-BET: KIRISH VA ISHNING MAQSADI
      {
        id: 3,
        title: "3-bet: Kirish & Maqsad",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">KIRISH VA ISHNING MAQSADI</h2>
          
          <h3 style="color: #1e293b; font-size: 13pt; margin-top: 20px;">1. Mavzuning Dolzarbligi</h3>
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            Zamonaviy axborot texnologiyalari va dasturiy vositalar ta'lim va ishlab chiqarish jarayonlarida yuqori aniqlik va tezlikni ta'minlaydi. Ushbu amaliy mashg'ulotda berilgan vazifani bajarish orqali fanga doir amaliy ko'nikmalarni rivojlantirish va mustaqil tahlil qilish ko'zda tutilgan.
          </p>

          <h3 style="color: #1e293b; font-size: 13pt; margin-top: 24px;">2. O'qituvchining Asosiy Talablari va Vazifalar</h3>
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 12px 0; border-radius: 0 8px 8px 0; font-size: 11.5pt; color: #1e3a8a;">
            ${teacherDescription}
          </div>

          ${templateFile ? `
            <div style="margin-top: 20px; padding: 12px 16px; background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 8px;">
              <strong>O'qituvchi biriktirgan shablon fayl: </strong>
              <a href="${getFileUrl(templateFile)}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: bold;">
                ${getFileNameFromUrl(templateFile)}
              </a>
            </div>
          ` : ''}

          <h3 style="color: #1e293b; font-size: 13pt; margin-top: 24px;">3. Amaliy Mashg'ulot Maqsadi</h3>
          <ul style="font-size: 12pt; line-height: 1.7;">
            <li>Mavzu bo'yicha nazariy qoidalarni chuqur o'rganish;</li>
            <li>Amaliy algoritmlarni qadam-baqadam ishlab chiqish va tekshirish;</li>
            <li>Yakuniy natijalarni hisoblab, tahliliy xulosa chiqarish.</li>
          </ul>
        `
      },

      // 4-BET: NAZARIY QISM VA FORMULALAR
      {
        id: 4,
        title: "4-bet: Nazariy Qism",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">1-BOB. NAZARIY ASOSLAR VA ASOSIY QOIDALAR</h2>
          
          <h3 style="color: #1e293b; font-size: 13pt;">1.1. Asosiy Ta'riflar va Qoidalar</h3>
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            Amaliy masalani yechish uchun nazariy model va metodologiya aniqlanadi. Quyida mavzuga oid asosiy qonuniyatlar va formulalar keltirilgan:
          </p>

          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center; font-size: 13pt; font-family: 'Times New Roman', serif;">
            <em>F(x) = &sum; (a<sub>i</sub> &times; x<sup>i</sup>) + &epsilon;</em>
            <p style="font-size: 10.5pt; color: #64748b; margin: 6px 0 0 0;">(1-formula: Asosiy hisoblash modeli)</p>
          </div>

          <h3 style="color: #1e293b; font-size: 13pt; margin-top: 24px;">1.2. Qo'llanilgan Metodlar</h3>
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            Hisoblash va dasturiy tekshiruv jarayonida analitik va empirik metodlardan foydalanildi. Ushbu metodlar yordamida olingan ko'rsatkichlarning xatolik chegarasi minimal darajaga tushiriladi.
          </p>
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            <em>(Ushbu qismga domla bergan qo'shimcha nazariy ma'lumotlarni yozishingiz mumkin).</em>
          </p>
        `
      },

      // 5-BET: AMALIY QISM VA TAJRIBA JADVALI
      {
        id: 5,
        title: "5-bet: Amaliy Qism & Jadval",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">2-BOB. AMALIY QISM VA HISOB-KITOBLAR</h2>
          
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            Ushbu bo'limda bevosita amaliy topshiriqning bajarilish ketma-ketligi, qilingan tajribalar va olingan hisob-kitoblar ko'rsatilgan:
          </p>

          <table style="width: 100%; border: 1px solid #94a3b8; border-collapse: collapse; margin: 20px 0; font-size: 11pt;">
            <thead>
              <tr style="background-color: #e2e8f0; color: #1e293b;">
                <th style="border: 1px solid #94a3b8; padding: 10px; width: 40px; text-align: center;">№</th>
                <th style="border: 1px solid #94a3b8; padding: 10px; text-align: left;">Amaliy Qadam / Parametr</th>
                <th style="border: 1px solid #94a3b8; padding: 10px; width: 140px; text-align: center;">Qiymati</th>
                <th style="border: 1px solid #94a3b8; padding: 10px; text-align: left;">Bajarilgan Amal / Izoh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">1</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Dastlabki konfiguratsiya</td>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">V-1.0</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Muvaffaqiyatli ishga tushirildi</td>
              </tr>
              <tr>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">2</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Asosiy algoritm hisobi</td>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">0.042 ms</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Optimal ko'rsatkich qayd etildi</td>
              </tr>
              <tr>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">3</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Test va tekshiruv natijasi</td>
                <td style="border: 1px solid #94a3b8; padding: 8px; text-align: center;">100%</td>
                <td style="border: 1px solid #94a3b8; padding: 8px;">Barcha testlardan o'tdi</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            Hisoblash jarayoni xulosasiga ko'ra, barcha amaliy parametrlar o'qituvchi belgilagan mezonlarga to'la javob beradi.
          </p>
        `
      },

      // 6-BET: DASTUR KODI YOKI ALGORITM
      {
        id: 6,
        title: "6-bet: Dastur Kodi",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">3-BOB. DASTUR KODI YOKI ALGORITM FRAGMENTI</h2>
          
          <p style="font-size: 12pt; line-height: 1.7;">
            Quyida amaliy masalani yechish uchun yozilgan dasturiy kod fragmenti keltirilgan:
          </p>

          <pre style="background-color: #0f172a; color: #38bdf8; padding: 20px; border-radius: 8px; font-family: 'JetBrains Mono', Courier, monospace; font-size: 11pt; line-height: 1.5; overflow-x: auto; margin: 16px 0;">
/**
 * ${assignmentTitle}
 * Guruh: ${groupName}
 */
function solvePracticalTask() {
    console.log("Topshiriq algoritmi ishga tushdi...");
    
    const results = [];
    for (let step = 1; step <= 5; step++) {
        results.push({
            qadam: step,
            status: "Bajarildi"
        });
    }
    
    return results;
}

// Natijani chop etish
const output = solvePracticalTask();
console.log("Muvaffaqiyatli yakunlandi:", output);
          </pre>

          <p style="font-size: 11.5pt; color: #64748b; font-style: italic;">
            Izoh: Dasturiy ta'minot kodini o'z yechimingiz bilan almashtirishingiz mumkin.
          </p>
        `
      },

      // 7-BET: NATIJALAR, RASMLAR VA DIAGRAMMALAR (AWS S3)
      {
        id: 7,
        title: "7-bet: Natijalar & Rasmlar",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">4-BOB. NATIJALAR VA ILUSTRATSIYALAR</h2>
          
          <p style="font-size: 12pt; line-height: 1.7;">
            Ushbu sahifaga amaliy ish natijasi bo'lgan skrinshotlar, grafiklar yoki dastur ishlashi tasvirlangan rasmlarni joylang:
          </p>

          <div style="border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px; text-align: center; background-color: #f8fafc; margin: 24px 0;">
            <p style="font-size: 12pt; color: #64748b; margin: 0 0 10px 0;">
              🖼 <strong>Yuqori paneldagi "Rasm" tugmasini bosing</strong>
            </p>
            <p style="font-size: 10.5pt; color: #94a3b8; margin: 0;">
              Skrinshotlar avtomatik tarzda AWS S3 ga yuklanadi va aynan shu sahifaga rasmiy Word rasmi bo'lib tushadi.
            </p>
          </div>
        `
      },

      // 8-BET: XULOSA VA FOYDALANILGAN ADABIYOTLAR
      {
        id: 8,
        title: "8-bet: Xulosa & Adabiyotlar",
        html: `
          <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">XULOSA VA TAVSIYALAR</h2>
          
          <p style="font-size: 12pt; line-height: 1.7; text-align: justify;">
            "${assignmentTitle}" mavzusidagi amaliy mashg'ulotni bajarish davomida quyidagi ilmiy va amaliy xulosalarga erishildi:
          </p>

          <ol style="font-size: 12pt; line-height: 1.8; text-align: justify;">
            <li>Mavzuning nazariy tushunchalari va matematik asoslari to'liq o'rganildi;</li>
            <li>O'qituvchi tomonidan belgilangan barcha amaliy talablar va qadamlar bajarildi;</li>
            <li>Dasturiy yechim sinovdan o'tkazilib, kutilgan natija qayd etildi;</li>
            <li>Topshiriq mezonlari bo'yicha ko'rsatkichlar to'liq shakllantirildi.</li>
          </ol>

          <h3 style="color: #1e293b; font-size: 13pt; margin-top: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">FOYDALANILGAN ADABIYOTLAR</h3>
          <ul style="font-size: 11pt; line-height: 1.7; color: #334155;">
            <li>1. ${subject} fani bo'yicha ma'ruza va amaliy mashg'ulotlar to'plami. Toshkent, 2025.</li>
            <li>2. Rasmiy o'quv qo'llanma va uslubiy ko'rsatmalar.</li>
            <li>3. O'qituvchi ${teacherName} tomonidan taqdim etilgan elektron resurslar.</li>
          </ul>
        `
      }
    ];
  };

  const initDefault8Pages = (assign) => {
    const defaultPages = generate8PagesData(assign);
    setPages(defaultPages);
    setActivePageIndex(0);
    calculateWordCount(defaultPages);
  };

  // So'zlar sonini hisoblash
  const calculateWordCount = (pagesList) => {
    let allText = '';
    pagesList.forEach(p => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = p.html || '';
      allText += ' ' + (tempDiv.innerText || '');
    });
    const words = allText.trim() ? allText.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  // Kursor koordinatalarini va joylashuvini saqlab qolish
  const saveSelection = (pageIndex = activePageIndex) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = {
        range: sel.getRangeAt(0).cloneRange(),
        pageIndex
      };
    }
  };

  // Word Editor Exec Command
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    handleCurrentPageInput(activePageIndex);
  };

  // Joriy sahifa matni o'zgarganda (Typing paytida qayta re-render qilmay, kursor erkinligini 100% ta'minlaymiz)
  const handleCurrentPageInput = (pageIndex = activePageIndex, directHtml = null) => {
    const el = editorRefs.current[pageIndex];
    const newHtml = directHtml !== null ? directHtml : (el ? el.innerHTML : null);
    if (newHtml === null) return;

    if (pagesRef.current && pagesRef.current[pageIndex]) {
      pagesRef.current[pageIndex] = {
        ...pagesRef.current[pageIndex],
        html: newHtml
      };
    }

    // Debounced autosave (2.5 soniya): faqat talaba yozishdan to'xtaganda orqa fonda saqlanadi
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (pagesRef.current) {
        setPages([...pagesRef.current]);
        calculateWordCount(pagesRef.current);
        saveDraftContent(pagesRef.current, true);
      }
    }, 2500);
  };

  // Sahifaga sakrash (scroll to page)
  const scrollToPage = (index) => {
    setActivePageIndex(index);
    const targetEl = pageRefs.current[index];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Yangi sahifa qo'shish (talaba kamida 8 ta, undan uyog'i xohlagancha sahifa qo'sha oladi)
  const handleAddNewPage = () => {
    const newPageNum = pages.length + 1;
    const newPage = {
      id: Date.now(),
      title: `${newPageNum}-bet: Qo'shimcha varaq`,
      html: `
        <h2 style="color: #1d4ed8; font-size: 16pt; border-bottom: 2px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 16px;">${newPageNum}-BOB. QO'SHIMCHA MA'LUMOTLAR</h2>
        <p style="font-size: 12pt; line-height: 1.7;">
          Ushbu yangi sahifaga o'z ma'lumotlaringiz, qo'shimcha jadvallar yoki hisob-kitoblarni kiriting...
        </p>
      `
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setTimeout(() => {
      scrollToPage(updated.length - 1);
    }, 100);
    saveDraftContent(updated, false);
  };

  // Sahifani o'chirish (kamida 1 ta qolsa bo'ldi!)
  const handleDeletePage = (index, e) => {
    e?.stopPropagation();
    if (pages.length <= 1) {
      alert("Hujjatda kamida 1 ta sahifa qolishi shart!");
      return;
    }
    if (!confirm(`Haqiqatan ham ${index + 1}-betni o'chirmoqchimisiz?`)) return;

    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    const newActive = Math.max(0, Math.min(activePageIndex, updated.length - 1));
    setActivePageIndex(newActive);
    saveDraftContent(updated, false);
  };

  // Sahifa sarlavhasini o'zgartirish
  const handlePageTitleChange = (pageIndex, newTitle) => {
    setPages(prev => {
      const updated = [...prev];
      if (updated[pageIndex]) {
        updated[pageIndex] = { ...updated[pageIndex], title: newTitle };
      }
      saveDraftContent(updated, false);
      return updated;
    });
  };

  // Domla yuklagan shablonni qaytadan chiqarish (tasdiqlanganda)
  const handleConfirmApplyTemplate = () => {
    const freshPages = generate8PagesData(assignment);
    setPages(freshPages);
    freshPages.forEach((p, idx) => {
      if (editorRefs.current[idx]) {
        editorRefs.current[idx].innerHTML = p.html;
      }
    });
    setActivePageIndex(0);
    calculateWordCount(freshPages);
    saveDraftContent(freshPages, false);
    setShowTemplateModal(false);
    setSaveMessage("Domla shabloni 8 betlik kitobcha formatida muvaffaqiyatli tushirildi!");
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Overlay koordinatalarini aniqlash
  const updateSelectedImgOverlay = (img, pageIndex = activePageIndex) => {
    if (!img) {
      setSelectedImgInfo(null);
      return;
    }
    const pageEl = pageRefs.current[pageIndex];
    if (!pageEl) return;

    const imgRect = img.getBoundingClientRect();
    const pageRect = pageEl.getBoundingClientRect();

    let curPct = 70;
    if (img.style.width && img.style.width.includes('%')) {
      curPct = parseInt(img.style.width, 10);
    } else if (img.parentElement) {
      curPct = Math.round((img.offsetWidth / img.parentElement.offsetWidth) * 100);
    }

    setSelectedImgInfo({
      imgEl: img,
      pageIndex,
      top: imgRect.top - pageRect.top,
      left: imgRect.left - pageRect.left,
      width: imgRect.width,
      height: imgRect.height,
      widthPct: isNaN(curPct) ? 70 : Math.min(100, Math.max(10, curPct)),
    });
  };

  // Matn yoki rasm bosilganda (Rasm tanlash)
  const handleEditorClick = (e, pageIndex) => {
    setActivePageIndex(pageIndex);
    if (imageMode) {
      handlePageClickInImageMode(e, pageIndex);
      return;
    }

    if (e.target && e.target.tagName === 'IMG') {
      updateSelectedImgOverlay(e.target, pageIndex);
    } else if (selectedImgInfo && !e.target.closest('.image-resize-overlay')) {
      setSelectedImgInfo(null);
    }
  };

  // Rasmni CHEKASIDAN TORTIB o'lchamini o'zgartirish (Corner drag handle)
  const handleCornerDragStart = (e, corner = 'se') => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImgInfo?.imgEl) return;

    const img = selectedImgInfo.imgEl;
    const startX = e.clientX;
    const startWidth = img.offsetWidth;
    const parent = img.parentElement || document.body;
    const parentWidth = parent.offsetWidth || 700;
    const pageIdx = selectedImgInfo.pageIndex;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = corner === 'se' ? (moveEvent.clientX - startX) : (startX - moveEvent.clientX);
      const newWidthPx = Math.max(50, Math.min(parentWidth, startWidth + deltaX));
      const newPct = Math.round((newWidthPx / parentWidth) * 100);

      img.style.width = `${newPct}%`;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';

      updateSelectedImgOverlay(img, pageIdx);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      handleCurrentPageInput(pageIdx);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Rasmni tezkor foizga o'rnatish (25%, 50%, 75%, 100%)
  const handleSetImagePercent = (pct) => {
    if (!selectedImgInfo?.imgEl) return;
    const img = selectedImgInfo.imgEl;
    img.style.width = `${pct}%`;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    updateSelectedImgOverlay(img, selectedImgInfo.pageIndex);
    handleCurrentPageInput(selectedImgInfo.pageIndex);
  };

  // Tanlangan rasmni o'chirish
  const handleDeleteSelectedImage = () => {
    if (!selectedImgInfo?.imgEl) return;
    const img = selectedImgInfo.imgEl;
    const parent = img.closest('figure') || img.closest('div') || img;
    parent.remove();
    setSelectedImgInfo(null);
    handleCurrentPageInput(selectedImgInfo.pageIndex);
  };

  // Rasm joylash rejimi faol bo'lganda sahifaning xohlagan joyiga bosish
  const handlePageClickInImageMode = (e, pageIndex) => {
    if (!imageMode) return;
    if (e.target.closest('button')) return;

    setActivePageIndex(pageIndex);

    let range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (e.rangeParent) {
      range = document.createRange();
      range.setStart(e.rangeParent, e.rangeOffset);
    }

    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      savedRangeRef.current = {
        range: range.cloneRange(),
        pageIndex
      };
    } else {
      savedRangeRef.current = { range: null, pageIndex };
    }

    // Fayl tanlash oynasini ochamiz
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Rasmni AWS S3 ga yuklash va hujjatga kursor turgan joyga kiritish
  const uploadAndInsertImage = async (file, targetPageIndex = activePageIndex) => {
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/file', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const s3Url = res.data.file_url;
      const fullUrl = getFileUrl(s3Url);

      const imageHtml = `
        <div style="text-align: center; margin: 18px auto; max-width: 90%;">
          <img src="${fullUrl}" alt="${file.name || 'Amaliy ish rasmi'}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: inline-block;" />
          <p style="font-size: 10.5pt; color: #64748b; margin-top: 6px; font-style: italic; font-family: 'Times New Roman', serif;">
            Rasm: ${file.name || 'Amaliy ish natijasi'}
          </p>
        </div>
        <p><br/></p>
      `;

      let inserted = false;
      if (savedRangeRef.current?.range) {
        try {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current.range);
          document.execCommand('insertHTML', false, imageHtml);
          inserted = true;
        } catch (ex) {
          console.warn("Could not insertHTML with saved range:", ex);
        }
      }

      const editorEl = editorRefs.current[targetPageIndex];
      if (!inserted && editorEl) {
        editorEl.innerHTML += imageHtml;
      }

      handleCurrentPageInput(targetPageIndex);
      setSaveMessage("Rasm tanlangan joyga muvaffaqiyatli joylashtirildi!");
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert("Rasm yuklashda xatolik: " + (err.response?.data?.error || err.message));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Oddiy input o'zgarganda rasm yuklash
  const handleInsertImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file, savedRangeRef.current?.pageIndex ?? activePageIndex);
  };

  // Drag & drop orqali rasmni xohlagan sahifaga tashlash
  const handleDrop = async (e, pageIndex) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setActivePageIndex(pageIndex);

    let range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    }
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      savedRangeRef.current = { range: range.cloneRange(), pageIndex };
    } else {
      savedRangeRef.current = { range: null, pageIndex };
    }

    for (const file of imageFiles) {
      await uploadAndInsertImage(file, pageIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Clipboard dan rasm nusxasini (Ctrl+V) to'g'ridan-to'g'ri qabul qilish
  const handlePaste = async (e, pageIndex) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          saveSelection(pageIndex);
          await uploadAndInsertImage(file, pageIndex);
        }
        return;
      }
    }
  };

  // Jadval kiritish
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border: 1px solid #94a3b8; border-collapse: collapse; margin: 16px 0; font-size: 11pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #94a3b8; padding: 8px;">Ustun 1</th>
            <th style="border: 1px solid #94a3b8; padding: 8px;">Ustun 2</th>
            <th style="border: 1px solid #94a3b8; padding: 8px;">Ustun 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 1</td>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 2</td>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 4</td>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 5</td>
            <td style="border: 1px solid #94a3b8; padding: 8px;">Ma'lumot 6</td>
          </tr>
        </tbody>
      </table>
      <p><br/></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    handleCurrentPageInput(activePageIndex);
  };

  // Qoralamani saqlash (Draft)
  const saveDraftContent = async (pagesToSave = pages, isAuto = false) => {
    if (!assignmentId) return;
    try {
      if (!isAuto) setSavingDraft(true);
      const res = await api.post('/submissions/draft', {
        assignment_id: Number(assignmentId),
        content: JSON.stringify({
          pages: pagesToSave,
          total_pages: pagesToSave.length,
        }),
      });
      setSubmission(res.data.submission);
      setLastSaved(new Date());
      setSaveMessage(isAuto ? "Kitobcha avtosaqlandi" : "Barcha sahifalar saqlandi");
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      console.error(err);
      if (!isAuto) setErrorMessage("Saqlashda xatolik yuz berdi");
    } finally {
      if (!isAuto) setSavingDraft(false);
    }
  };

  // Yakuniy topshirish va AI baholash (Submit)
  const handleSubmitWork = async () => {
    // Topshirishda kamida 7 ta sahifa bo'lishi shart!
    if (pages.length < 7) {
      alert(`Topshirish uchun amaliy ish kamida 7 ta sahifadan iborat bo'lishi shart!\n\nSizda hozir ${pages.length} ta sahifa mavjud. Iltimos, yana kamida ${7 - pages.length} ta sahifa qo'shing yoki "Shablonni Chiqarish" tugmasini bosing.`);
      return;
    }

    if (!confirm(`Ushbu ${pages.length} betlik amaliy ish kitobchasini topshirishni tasdiqlaysizmi? AI tizimi barcha sahifalar, jadvallar va xulosalarni real vaqtda baholaydi.`)) {
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Barcha sahifalarning to'liq matnini AI tahliliga tayyorlaymiz
      let fullText = '';
      pages.forEach((p, idx) => {
        const d = document.createElement('div');
        d.innerHTML = p.html || '';
        fullText += `\n\n--- [${idx + 1}-BET: ${p.title}] ---\n` + (d.innerText || '');
      });

      const res = await api.post('/submissions/submit', {
        assignment_id: Number(assignmentId),
        content: JSON.stringify({
          pages: pages,
          total_pages: pages.length,
          practical: fullText,
        }),
      });

      const updatedSub = res.data.submission;
      setSubmission(updatedSub);
      navigate(`/evaluation/${updatedSub.id}`);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message || "Topshirishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">8 betlik Online Word Kitobchasi ochilmoqda...</p>
        </div>
      </div>
    );
  }

  const isGraded = submission?.status === 'graded';
  const isReturned = submission?.status === 'returned';

  return (
    <div className="h-screen print:h-auto w-full bg-[#cbd5e1] print:bg-white flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 overflow-hidden print:overflow-visible">
      {/* 1. TOP COMPACT HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex-shrink-0 z-30 shadow-sm flex items-center justify-between gap-4 print:hidden select-none">
        <div className="flex items-center space-x-3 overflow-hidden">
          <Link
            to="/assignments"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex-shrink-0"
            title="Topshiriqlarga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-900 truncate tracking-tight">
                {assignment?.title}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                {pages.length} betlik Kitobcha
              </span>
              {/* SAHIFA MA'LUMOTI (HEADERDA) */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 flex-shrink-0">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>{activePageIndex + 1}-bet</span>
                <span className="text-indigo-400 font-normal">/ {pages.length} ta</span>
                <span className="text-slate-500 font-medium truncate max-w-[140px] hidden md:inline">• {pages[activePageIndex]?.title || `${activePageIndex + 1}-bet`}</span>
              </div>
              {isGraded && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                  Baholandi ({submission?.score} ball)
                </span>
              )}
              {isReturned && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 flex-shrink-0 flex items-center space-x-1 animate-pulse">
                  <RotateCcw className="w-3 h-3 text-amber-600" />
                  <span>Qayta topshirish talab etiladi</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Fan: <strong className="text-slate-700">{assignment?.group?.subject}</strong> • Guruh: <strong className="text-slate-700">{assignment?.group?.name}</strong> • O'qituvchi: <strong className="text-slate-700">{assignment?.group?.teacher?.name}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Domla fayli (AWS S3) bo'lsa */}
          {assignment?.template_file_url && (
            <a
              href={getFileUrl(assignment.template_file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
              title="Domla yuklagan faylni ochish"
            >
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              <span>Domla Fayli</span>
              <ExternalLink className="w-3 h-3 text-blue-500" />
            </a>
          )}

          {/* ASOSIY TUGMA: DOMLA SHABLONINI CHIQARISH */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1d58d8] hover:bg-[#1648b8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
            title="Domla yuklagan shablonni chiqarish"
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Shablonni Chiqarish</span>
          </button>

          {/* Ko'rinish rejimi: Ketma-ket A4 yoki Yonma-yon Kitobcha */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'continuous' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ketma-ket A4 varaqlar"
            >
              Ketma-ket
            </button>
            <button
              type="button"
              onClick={() => setViewMode('book')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
                viewMode === 'book' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Yonma-yon 2 betlik Kitobcha"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kitobcha</span>
            </button>
          </div>

          {/* Qoralama saqlash */}
          <button
            type="button"
            onClick={() => saveDraftContent(pages, false)}
            disabled={savingDraft || submitting}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{savingDraft ? "..." : "Saqlash"}</span>
          </button>

          {/* Chop etish */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors hidden sm:inline-flex"
            title="Chop etish / PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* AI Baholashga topshirish */}
          {isGraded ? (
            <Link
              to={`/evaluation/${submission.id}`}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3.5 rounded-xl shadow-sm text-xs transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Natija ({submission?.score})</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleSubmitWork}
              disabled={submitting}
              title={pages.length < 7 ? `Topshirish uchun kamida 7 ta sahifa kerak (hozirda: ${pages.length} ta)` : isReturned ? "Tahrirlangan kitobchani qayta topshirish" : "AI ga baholash uchun topshirish"}
              className={`inline-flex items-center space-x-1.5 font-bold py-1.5 px-3.5 rounded-xl shadow-md text-xs transition-all disabled:opacity-50 text-white ${
                isReturned
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Baholanmoqda...</span>
                </>
              ) : (
                <>
                  {isReturned ? <RotateCcw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isReturned ? "Qayta Topshirish" : "Topshirish"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Qayta topshirish haqida ogohlantirish banneri */}
      {isReturned && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-950 z-20 flex-shrink-0 select-none">
          <div className="flex items-center space-x-2.5">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>O'qituvchi ishingizni qayta topshirish uchun qaytargan!</strong> Daftardagi kamchiliklarni to'g'rilab, yana <strong>"Qayta Topshirish"</strong> tugmasini bosing.
              {submission?.evaluation?.feedback && (
                <span className="ml-1.5 text-slate-700 italic">
                  ({Array.isArray(submission.evaluation.feedback) ? submission.evaluation.feedback[0] : submission.evaluation.feedback})
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSubmitWork}
            disabled={submitting}
            className="ml-3 px-3.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex-shrink-0 shadow-sm"
          >
            {submitting ? "Baholanmoqda..." : "Qayta Jo'natish"}
          </button>
        </div>
      )}

      {/* 2. WORD TOOLBAR */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-1.5 flex-shrink-0 z-20 shadow-sm flex items-center space-x-1 overflow-x-auto print:hidden select-none">
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 pr-2 border-r border-slate-200">
          <button type="button" onClick={() => execCmd('undo')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Ortga (Ctrl+Z)">
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('redo')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Oldinga (Ctrl+Y)">
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shrift Sarlavhalari */}
        <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
          <select
            onChange={(e) => execCmd('formatBlock', e.target.value)}
            defaultValue="p"
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="p">Oddiy matn</option>
            <option value="h1">Sarlavha 1 (H1)</option>
            <option value="h2">Sarlavha 2 (H2)</option>
            <option value="h3">Sarlavha 3 (H3)</option>
          </select>

          <select
            onChange={(e) => execCmd('fontName', e.target.value)}
            defaultValue="Times New Roman"
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer hidden sm:block"
          >
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Monospace (Kod)</option>
          </select>
        </div>

        {/* Formatlar */}
        <div className="flex items-center space-x-0.5 px-2 border-r border-slate-200">
          <button type="button" onClick={() => execCmd('bold')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-bold" title="Qalin">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('italic')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 italic" title="Kursiv">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('underline')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 underline" title="Tagiga chizilgan">
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ranglar */}
        <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
          <label className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-slate-100" title="Matn rangi">
            <Palette className="w-3.5 h-3.5 text-slate-600 mr-1" />
            <input type="color" defaultValue="#1e293b" onChange={(e) => execCmd('foreColor', e.target.value)} className="w-4 h-4 cursor-pointer border-0 p-0 bg-transparent" />
          </label>
          <label className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-slate-100" title="Fon rangi">
            <Highlighter className="w-3.5 h-3.5 text-amber-600 mr-1" />
            <input type="color" defaultValue="#fef08a" onChange={(e) => execCmd('hiliteColor', e.target.value)} className="w-4 h-4 cursor-pointer border-0 p-0 bg-transparent" />
          </label>
        </div>

        {/* Tekislash */}
        <div className="flex items-center space-x-0.5 px-2 border-r border-slate-200">
          <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Chapga">
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Markazga">
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="O'ngga">
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('justifyFull')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Kenglik bo'yicha">
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ro'yxat, Jadval va Rasm */}
        <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
          <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Raqamlangan ro'yxat">
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700" title="Belgilangan ro'yxat">
            <List className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={handleInsertTable} className="inline-flex items-center space-x-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold" title="Jadval">
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Jadval</span>
          </button>
        </div>

        {/* RASM REJIMI VA YUKLASH (ISTALGAN JOYGA QO'YISH) */}
        <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => setImageMode(!imageMode)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
              imageMode
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title={imageMode ? "Rasm joylash rejimini o'chirish" : "Rasm joylash rejimini yoqish — sahifaning istalgan joyiga bosib rasm yuklash"}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{imageMode ? "Rasm Rejimi (FAOL)" : "Rasm Rejimi"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              saveSelection(activePageIndex);
              fileInputRef.current?.click();
            }}
            disabled={uploadingImage}
            className="inline-flex items-center space-x-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            title="Kursor turgan joyga rasm yuklash"
          >
            {uploadingImage ? (
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden sm:inline">Rasm qo'yish</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleInsertImage} accept="image/*" className="hidden" />
        </div>

        {/* YANGI SAHIFA QO'SHISH TUGMASI (KAMIDA 8 TA, CHEKSIZ QO'SHISH MUMKIN) */}
        <button
          type="button"
          onClick={handleAddNewPage}
          className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
          title="Yangi A4 sahifa qo'shish"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi Bet</span>
        </button>
      </div>

      {/* Rasm Mode Faol Ko'rsatmasi */}
      {imageMode && (
        <div 
          style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
          className="text-white text-xs font-medium py-2 px-4 sm:px-6 flex items-center justify-between shadow-md select-none flex-shrink-0"
        >
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>
              <strong>Rasm joylash rejimi faol:</strong> Sahifaning xohlagan yeriga sichqoncha bilan bosing — rasm aynan o'sha nuqtaga joylashtiriladi. Shuningdek, faylni to'g'ridan-to'g'ri sudrab (drag & drop) tashlashingiz yoki Ctrl+V bilan nusxa ko'chirishingiz mumkin.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setImageMode(false)}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg ml-4 flex-shrink-0 transition-colors cursor-pointer"
          >
            Rejimni yopish ✕
          </button>
        </div>
      )}

      {/* Bannerlar */}
      {saveMessage && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1 px-4 text-center shadow-inner flex items-center justify-center space-x-1.5 flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 3. MAIN WORKSPACE: CHAPDA SAHIFALAR DRAWERI, O'NGDA A4 BETLAR */}
      <div className="flex-1 flex overflow-hidden min-h-0 print:h-auto print:overflow-visible">
        {/* CHAP: SAHIFALAR RO'YXATI (PAGES THUMBNAILS DRAWER) - FIXED VA ICHKI SCROLL */}
        <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between hidden lg:flex flex-shrink-0 select-none print:hidden h-full min-h-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sahifalar ({pages.length})</span>
            </span>
            <button
              type="button"
              onClick={handleAddNewPage}
              className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
              title="Yangi sahifa qo'shish"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Miniatyuralar ro'yxati (Mustaqil ichki scroll) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
            {pages.map((p, idx) => {
              const isActive = activePageIndex === idx;
              return (
                <div
                  key={p.id || idx}
                  onClick={() => scrollToPage(idx)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800 truncate pr-1">
                      {p.title || `${idx + 1}-bet`}
                    </span>
                    {/* Sahifani o'chirish: 1 ta qolsa bo'ldi! */}
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeletePage(idx, e)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                        title="Ushbu sahifani o'chirish"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="w-full h-12 bg-white rounded-md border border-slate-200 p-1 overflow-hidden opacity-75">
                    <div 
                      className="text-[6px] text-slate-400 line-clamp-3 select-none pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: p.html }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pastki yangi sahifa tugmasi */}
          <div className="p-3 border-t border-slate-100 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={handleAddNewPage}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Yangi bet qo'shish</span>
            </button>
          </div>
        </aside>

        {/* O'NGDA: A4 SAHIFALAR MAYDONI (MUSTAQIL SCROLL) */}
        <main className="flex-1 h-full overflow-y-auto py-8 px-2 sm:px-6 flex flex-col items-center min-h-0 print:h-auto print:overflow-visible print:p-0">
          
          <div className={`w-full ${viewMode === 'book' ? 'max-w-[1700px] grid grid-cols-1 xl:grid-cols-2 gap-8' : 'max-w-4xl space-y-10'} flex flex-col items-center`}>
            {pages.map((p, idx) => {
              const isActive = activePageIndex === idx;

              return (
                <div
                  key={p.id || idx}
                  ref={(el) => (pageRefs.current[idx] = el)}
                  onClick={() => setActivePageIndex(idx)}
                  className={`w-full max-w-[820px] min-h-[1120px] bg-white shadow-2xl p-10 sm:p-14 md:p-16 border rounded-sm relative flex flex-col justify-between transition-all ${
                    isActive ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-300'
                  } ${imageMode ? 'ring-2 ring-blue-400 ring-dashed' : ''}`}
                  style={{
                    boxSizing: 'border-box',
                  }}
                >
                  {/* CHEKASIDAN TORTISH VA SOZLASH RAMKASI (CORNER RESIZE OVERLAY) */}
                  {selectedImgInfo && selectedImgInfo.pageIndex === idx && (
                    <div
                      className="image-resize-overlay"
                      style={{
                        position: 'absolute',
                        top: selectedImgInfo.top,
                        left: selectedImgInfo.left,
                        width: selectedImgInfo.width,
                        height: selectedImgInfo.height,
                        border: '2px solid #2563eb',
                        borderRadius: '6px',
                        pointerEvents: 'none',
                        zIndex: 30,
                      }}
                    >
                      {/* SODDA MINI PANEL (FOIZLAR VA O'CHIRISH) */}
                      <div
                        style={{ pointerEvents: 'auto' }}
                        className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xl flex items-center space-x-2 border border-slate-700 select-none whitespace-nowrap z-40"
                      >
                        <span className="text-blue-400 font-mono text-xs">{selectedImgInfo.widthPct}%</span>
                        <div className="h-3 w-[1px] bg-slate-700"></div>
                        {[25, 50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleSetImagePercent(pct)}
                            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                              selectedImgInfo.widthPct === pct ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                        <div className="h-3 w-[1px] bg-slate-700"></div>
                        <button
                          type="button"
                          onClick={handleDeleteSelectedImage}
                          className="p-1 hover:bg-rose-600 text-rose-300 hover:text-white rounded transition-colors"
                          title="Rasmni o'chirish"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* O'NG PASTKI CHEKADAN TORTISH DASTAGI (DRAG HANDLE) */}
                      <div
                        style={{ pointerEvents: 'auto' }}
                        onMouseDown={(e) => handleCornerDragStart(e, 'se')}
                        className="w-4 h-4 bg-blue-600 border-2 border-white rounded shadow-lg absolute -bottom-2 -right-2 cursor-se-resize hover:scale-125 active:scale-125 transition-transform z-40"
                        title="Rasmni chekasidan tortib o'lchamini o'zgartirish"
                      />

                      {/* CHAP PASTKI CHEKADAN TORTISH DASTAGI */}
                      <div
                        style={{ pointerEvents: 'auto' }}
                        onMouseDown={(e) => handleCornerDragStart(e, 'sw')}
                        className="w-4 h-4 bg-blue-600 border-2 border-white rounded shadow-lg absolute -bottom-2 -left-2 cursor-sw-resize hover:scale-125 active:scale-125 transition-transform z-40"
                        title="Rasmni chekasidan tortib o'lchamini o'zgartirish"
                      />
                    </div>
                  )}

                  {/* A4 Header (Sahifa ma'lumoti va tahrirlanuvchi sarlavha) */}
                  <div className="border-b border-slate-200 pb-2.5 mb-6 flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
                    <span className="uppercase tracking-widest font-semibold text-slate-600">
                      {assignment?.group?.subject || 'AMALIY ISH'} • {assignment?.title}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400 font-bold text-[10px] uppercase">{idx + 1}-BET:</span>
                      <input
                        type="text"
                        value={p.title || `${idx + 1}-bet`}
                        onChange={(e) => handlePageTitleChange(idx, e.target.value)}
                        className="bg-transparent hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-400 rounded px-1.5 py-0.5 font-bold text-slate-800 text-xs focus:ring-1 focus:ring-blue-400 outline-none transition-all text-right max-w-[200px] truncate"
                        title="Sahifa sarlavhasini tahrirlash"
                        placeholder={`${idx + 1}-bet sarlavhasi`}
                      />
                    </div>
                  </div>

                  {/* Rasm rejimi faol bo'lsa yo'naltiruvchi belgi */}
                  {imageMode && (
                    <div className="mb-4 py-1.5 px-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-semibold flex items-center justify-between select-none">
                      <div className="flex items-center space-x-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        <span>Rasm qo'ymoqchi bo'lgan joyni bosing:</span>
                      </div>
                      <span className="text-[10px] bg-blue-200/60 text-blue-800 px-2 py-0.5 rounded font-mono">
                        + Rasm kiritish
                      </span>
                    </div>
                  )}

                  {/* EDITABLE CONTENT PER PAGE (UNCONTROLLED TO PREVENT SALOM -> MOLAS REVERSE TYPING) */}
                  <EditablePage
                    key={p.id || idx}
                    initialHtml={p.html}
                    editorRef={(el) => (editorRefs.current[idx] = el)}
                    onHtmlChange={(newHtml) => {
                      handleCurrentPageInput(idx, newHtml);
                    }}
                    onClick={(e) => handleEditorClick(e, idx)}
                    onKeyUp={() => saveSelection(idx)}
                    onMouseUp={(e) => {
                      saveSelection(idx);
                      if (imageMode) {
                        handlePageClickInImageMode(e, idx);
                      }
                    }}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragOver={handleDragOver}
                    onPaste={(e) => handlePaste(e, idx)}
                    isImageMode={imageMode}
                  />

                  {/* A4 Footer (Sahifa raqami) */}
                  <div className="border-t border-slate-200 pt-3 mt-8 flex items-center justify-between text-xs text-slate-400 select-none pointer-events-none">
                    <span className="font-mono text-[11px]">{assignment?.title}</span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {idx + 1}-bet / {pages.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* 4. PASTKI WORD STATUS BAR */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2 flex-shrink-0 z-20 text-xs text-slate-500 flex items-center justify-between select-none print:hidden shadow-sm">
        <div className="flex items-center space-x-4">
          <span>
            Jami betlar: <strong className="text-slate-800">{pages.length} ta</strong>
            <span className="text-slate-400 text-[11px] ml-1">(topshirishda kamida 7 ta)</span>
          </span>
          <span>
            So'zlar: <strong className="text-slate-800">{wordCount}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-indigo-600 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Kitobchani baholashga tayyor</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-[11px] text-slate-400">
              Oxirgi saqlash: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Avtosaqlash faol</span>
          </span>
        </div>
      </footer>

      {/* 5. DOMLA SHABLONINI CHIQARISH VA TASDIQLASH MODALI */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Domla Yuklagan Shablonni Chiqarish"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {assignment?.group?.subject}
              </span>
              <span className="text-xs font-bold text-slate-700">
                Maksimal: {assignment?.max_score} ball
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{assignment?.title}</h3>
            <p className="text-xs text-slate-500">
              O'qituvchi: <strong className="text-slate-700">{assignment?.group?.teacher?.name}</strong> • Guruh: <strong className="text-slate-700">{assignment?.group?.name}</strong>
            </p>
          </div>

          {/* Domla tavsifi */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              O'qituvchi Talablari va Vazifalar:
            </h4>
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {assignment?.description || "Standart amaliy mashg'ulot talablari amal qiladi."}
            </div>
          </div>

          {/* Domla biriktirgan fayl */}
          {assignment?.template_file_url && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Domla Yuklagan Shablon Fayli:
              </h4>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900 truncate pr-2">
                  <Paperclip className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{getFileNameFromUrl(assignment.template_file_url)}</span>
                </div>
                <a
                  href={getFileUrl(assignment.template_file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 py-1 px-3 bg-white border border-emerald-300 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors shadow-sm flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ko'rish / Ochish</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          )}

          {/* 8 betlik kitobcha tuzilishi ma'lumoti */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs space-y-1.5">
            <p className="font-bold flex items-center space-x-1 text-indigo-700">
              <BookOpen className="w-4 h-4" />
              <span>Chiqariladigan 8 betlik kitobcha tarkibi:</span>
            </p>
            <p className="text-indigo-900/80 leading-relaxed text-[11px]">
              1-bet: Rasmiy Titul varag'i | 2-bet: Mundarija (Reja) | 3-bet: Kirish va Maqsad | 4-bet: Nazariy Qism | 5-bet: Amaliy Qism va Jadval | 6-bet: Dastur Kodi | 7-bet: Natijalar & Rasmlar | 8-bet: Xulosa va Adabiyotlar.
            </p>
            <p className="text-[11px] text-indigo-600 font-semibold">
              * Shablon tushgach, har bir varaqni xohlagancha erkin o'zgartirishingiz, rasm va qo'shimcha sahifalar qo'shishingiz mumkin.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTemplateModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleConfirmApplyTemplate}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#1d58d8] hover:bg-[#1648b8] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Shablonni Tasdiqlash va 8 Betlik Kitobchani Yaratish</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WhitePaper;
