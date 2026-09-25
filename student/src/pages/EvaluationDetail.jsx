import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  AlertCircle, 
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Code,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

import BookViewer from '../components/BookViewer';

const EvaluationDetail = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvaluation();
  }, [submissionId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/submissions/${submissionId}`);
      setSubmission(res.data.submission);
    } catch (err) {
      console.error(err);
      setError("Baholash natijasini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">AI natijalari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">{error || "Topshiriq topilmadi"}</h2>
          <Link
            to="/assignments"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-2xl text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Topshiriqlarga qaytish</span>
          </Link>
        </div>
      </div>
    );
  }

  const evaluation = submission.evaluation || {};
  const score = evaluation.total_score || submission.score || 0;
  const maxScore = submission.assignment?.max_score || 100;
  const percentage = Math.round((score / maxScore) * 100);

  const criteriaList = evaluation.criteria_results || evaluation.rubric_scores || [];
  const rawFeedback = evaluation.feedback || evaluation.ai_feedback;
  const feedbackList = Array.isArray(rawFeedback) ? rawFeedback : null;
  const feedbackString = typeof rawFeedback === 'string' ? rawFeedback : (rawFeedback ? JSON.stringify(rawFeedback) : null);

  // Content parsing
  let parsedContent = {};
  try {
    parsedContent = typeof submission.content === 'string' ? JSON.parse(submission.content) : submission.content;
  } catch {
    parsedContent = { practical: submission.content };
  }

  // Sahifalarni kitob ko'rinishi uchun tayyorlash
  let bookPages = [];
  if (parsedContent?.pages && Array.isArray(parsedContent.pages) && parsedContent.pages.length > 0) {
    bookPages = parsedContent.pages;
  } else {
    // Agar oldingi sodda format bo'lsa, kitobcha sahifalariga aylantiramiz
    bookPages = [
      {
        id: 1,
        title: "1-bet: Titul varaqasi",
        html: `
          <div style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 13pt; font-weight: bold; color: #2563eb; text-transform: uppercase;">"${submission.assignment?.group?.name || 'Guruh'}"</p>
            <h1 style="font-size: 24pt; font-weight: 800; color: #0f172a; margin: 20px 0;">${submission.assignment?.title || 'Amaliy Mashg\'ulot'}</h1>
            <p style="font-size: 14pt; color: #64748b;">AMALIY ISH HISOBOTI</p>
            <div style="margin-top: 100px; text-align: right; max-width: 380px; margin-left: auto; font-size: 12pt; line-height: 1.8;">
              <p><strong>Talaba:</strong> ${submission.student?.name || 'Talaba'}</p>
              <p><strong>Baholash bali:</strong> ${score} / ${maxScore}</p>
              <p><strong>Holati:</strong> ${submission.status || 'Baholangan'}</p>
            </div>
          </div>
        `
      },
      parsedContent?.theme && {
        id: 2,
        title: "2-bet: Kirish va Mavzu",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">KIRISH VA MAVZU</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsedContent.theme}</div>`
      },
      parsedContent?.theory && {
        id: 3,
        title: "3-bet: Nazariy Asoslar",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">1-BOB. NAZARIY QISM</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsedContent.theory}</div>`
      },
      parsedContent?.practical && {
        id: 4,
        title: "4-bet: Amaliy Qism",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">2-BOB. AMALIY JARAYON</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsedContent.practical}</div>`
      },
      parsedContent?.code && {
        id: 5,
        title: "5-bet: Dastur Kodi",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">3-BOB. ALGORITM VA DASTUR KODI</h2><pre style="background:#0f172a; color:#4ade80; padding:16px; border-radius:10px; font-family:monospace; font-size:11pt; margin-top:16px; overflow-x:auto;"><code>${parsedContent.code}</code></pre>`
      },
      parsedContent?.conclusion && {
        id: 6,
        title: "6-bet: Xulosa",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">XULOSA VA TAVSIYALAR</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsedContent.conclusion}</div>`
      }
    ].filter(Boolean);
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/assignments"
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Baholash Natijalari</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Topshiriq: <strong className="text-slate-700">{submission.assignment?.title}</strong>
            </p>
          </div>
        </div>

        <Link
          to={`/whitepaper/${submission.assignment_id}`}
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-2xl text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Daftarni Ko'rish / Qayta Topshirish</span>
        </Link>
      </div>

      {/* Returned for Revision Warning Banner */}
      {submission.status === 'returned' && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RotateCcw className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-amber-900 text-base">O'qituvchi Qayta Topshirishga Qaytardi</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">Qayta topshirish talab etiladi</span>
              </div>
              <p className="text-amber-800 text-sm mt-1">
                Ushbu topshiriq o'qituvchi tomonidan ko'rib chiqilib, qayta ishlash uchun sizga qaytarildi. Daftarga o'tib, tuzatishlar kiriting va qayta topshiring.
              </p>
              {evaluation?.feedback && (
                <div className="mt-2.5 p-3 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold text-amber-900">O'qituvchi / AI izohi: </span>
                  {evaluation.feedback}
                </div>
              )}
            </div>
          </div>
          <Link
            to={`/whitepaper/${submission.assignment_id}`}
            className="flex-shrink-0 inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-2xl text-xs shadow-md shadow-amber-200 transition-all hover:scale-105"
          >
            <span>Daftarga O'tish va Tuzatish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Score Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Gemini AI Auto-Evaluation</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Amaliy Ish Baholandi!
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              Topshiriq mezonlari, nazariy asoslar, amaliy qadamlar va xulosangiz chuqur tahlil qilindi.
            </p>

            <div className="flex items-center space-x-4 pt-2 text-xs text-indigo-300">
              <span>Topshirilgan vaqt: {new Date(submission.submitted_at || submission.updated_at).toLocaleString()}</span>
              <span>•</span>
              <span>Versiya: #{submission.version || 1}</span>
            </div>
          </div>

          {/* Big Score Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center flex-shrink-0 min-w-[200px]">
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Umumiy Natija</p>
            <div className="flex items-baseline justify-center space-x-1 mt-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">{score}</span>
              <span className="text-xl font-bold text-indigo-300">/ {maxScore}</span>
            </div>
            <div className="mt-3 inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{percentage}% Natija</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Breakdown & AI Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Rubric Criteria Scores */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Mezonlar Bo'yicha Ballar</span>
            </h3>

            {criteriaList.length > 0 ? (
              <div className="space-y-3">
                {criteriaList.map((r, idx) => {
                  const max = r.max || r.max_score || 25;
                  const rPerc = Math.min(100, Math.round(((r.score || 0) / max) * 100));
                  return (
                    <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{r.name}</span>
                        <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {r.score} / {max}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${rPerc}%` }}
                        ></div>
                      </div>
                      {r.comment && (
                        <p className="text-[11px] text-slate-500 mt-1">{r.comment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Mezon ballari hisoblanmoqda...</p>
            )}

            {/* Similarity / AI signal agar mavjud bo'lsa */}
            {evaluation.similarity_score !== undefined && evaluation.similarity_score !== null && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">O'xshashlik darajasi:</span>
                  <span className="font-bold text-slate-800">{evaluation.similarity_score}%</span>
                </div>
                {(evaluation.ai_writing_probability !== undefined && evaluation.ai_writing_probability !== null) && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">AI yozish ehtimoli:</span>
                    <span className="font-bold text-indigo-600">
                      {evaluation.ai_writing_probability <= 1 
                        ? Math.round(evaluation.ai_writing_probability * 100) 
                        : evaluation.ai_writing_probability}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Detailed AI Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Tahlili va O'qituvchi Tavsiyalari</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ishingizning kuchli jihatlari va uni yanada yaxshilash bo'yicha maslahatlar
              </p>
            </div>

            {/* Feedback Content */}
            <div className="space-y-3">
              {Array.isArray(feedbackList) && feedbackList.length > 0 ? (
                <div className="space-y-2.5">
                  {feedbackList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 flex items-start space-x-3.5 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs shadow-sm">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              ) : feedbackString ? (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 leading-relaxed whitespace-pre-wrap font-medium">
                  {feedbackString}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  AI tahliliy xulosasi tayyorlanmoqda...
                </div>
              )}
            </div>

            {/* Ish haqida qisqa ma'lumot */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hujjat hajmi: <strong className="text-slate-700">{bookPages.length} ta sahifa</strong></span>
              <a 
                href="#book-viewer-section"
                className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>Kitob shaklida o'qish</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOPSHIRILGAN AMALIY ISH (KITOB SHAKLIDA) */}
      <section id="book-viewer-section" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2.5">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Topshirilgan Amaliy Ish (Kitob Shaklida)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Topshirilgan rasmiy hisobot kitobchasini 2 betlik varaqlanuvchi kitobcha yoki to'liq ko'rinishda ko'ring.
            </p>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
              📖 Jami {bookPages.length} ta sahifa
            </span>
          </div>
        </div>

        <BookViewer 
          pages={bookPages}
          documentTitle={submission.assignment?.title || "Amaliy Ish"}
          studentName={submission.student?.name || "Talaba"}
        />
      </section>
    </div>
  );
};

export default EvaluationDetail;
